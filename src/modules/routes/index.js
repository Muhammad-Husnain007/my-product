import { Router } from 'express';
import deviceRouter from '../device/route/device.route.js';
import userRouter from '../user/route/user.route.js';
import addressRouter from '../address/route/address.route.js';
import documentRouter from '../document/route/document.route.js';
import vendorRouter from '../onboarding/route/vendor.route.js';
import hallRouter from '../hallUpload/route/hall.route.js';
import accRejRouter from '../../admin/modules/vendorAccRej/route/acceptReject.route.js';
import apiAuditLoggerRouter from "../apiAuditLogs/index.ui.js";
import bookingRouter from "../booking/route/booking.route.js";
import negotiateRouter from "../negotiate/route/negotiate.route.js";
import walletRouter from "../wallet/route/wallet.route.js";
import paymentRouter from "../payment/route/payment.route.js";
import githubWebhook from "../../webhooks/github.webhook.js";


const apiRouter = Router();

apiRouter.use('/device', deviceRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/address', addressRouter);
apiRouter.use('/document', documentRouter);
apiRouter.use('/vendor', vendorRouter);
apiRouter.use('/hall', hallRouter);
apiRouter.use('/admin', apiAuditLoggerRouter);
apiRouter.use('/booking', bookingRouter);
apiRouter.use('/negotiate', negotiateRouter);
apiRouter.use('/wallet', walletRouter);
apiRouter.use('/payment', paymentRouter);
apiRouter.use('/', githubWebhook);

//   app.use(`${config.urlMount}`, apiAuditLogsRouter);

//  Admin Routes ??? //////////////////

apiRouter.use('/nova',  accRejRouter)

export default apiRouter;
 