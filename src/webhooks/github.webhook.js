import express from "express";
import crypto from "crypto";

const router = express.Router();

router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {

    // Signature verify karo
    const sig = req.headers['x-hub-signature-256'];
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    console.log("secret:", secret);

    const hash = 'sha256=' + crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    if (sig !== hash) {
      return res.status(401).send('Invalid!');
    }

    // 200 pehle!
    res.status(200).json({ received: true });

    const event = req.headers['x-github-event'];

    if (event === 'push') {
      console.log('New commit!');
    }

    if (event === 'workflow_run') {
      const status = req.body.workflow_run.conclusion;
      console.log('Deploy:', status);
    }

});

export default router;