import express from "express";
import crypto from "crypto";
import logger from "../../config/logger.config.js";

const router = express.Router();

router.post('/', async (req, res) => {

    const sig = req.headers['x-hub-signature-256'];
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    const body = JSON.stringify(req.body);

    const hash = 'sha256=' + crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (sig !== hash) {
      return res.status(401).send('Invalid!');
    }

    res.status(200).json({ received: true });
    logger.info('New webhook received!', { requestBody: req.body });

    const event = req.headers['x-github-event'];

    if (event === 'push') {
      logger.info('New commit!');
    }

    if (event === 'workflow_run') {
      const status = req.body.workflow_run?.conclusion;
      logger.info('Deploy:', status);
    }

});

export default router;