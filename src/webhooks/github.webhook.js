import express from "express";
import crypto from "crypto";
import logger from "../../config/logger.config.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const sig = req.headers["x-hub-signature-256"];
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  const body = JSON.stringify(req.body);

  const hash =
    "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");

  if (sig !== hash) {
    return res.status(401).send("Invalid!");
  }

  res.status(200).json({ received: true });

  const gitevent = req.headers["x-github-event"];
  const delivery = req.headers["x-github-delivery"];

  logger.info("Webhook received", {
    event: gitevent,
    delivery,
    repository: req.body?.repository?.name,
    branch: req.body?.ref,
    commits: req.body?.commits[0].message,
    pusher: req.body?.pusher?.name,
    pusherEmail: req.body?.pusher?.email,
    timestamp: new Date().toISOString(),
  });

  if (gitevent === "workflow_run") {
    const workflow = req.body?.workflow_run;
    logger.info("CI/CD workflow completed", {
      name: workflow?.name,
      status: workflow?.conclusion,
      branch: workflow?.head_branch,
    });
  }
});

export default router;
