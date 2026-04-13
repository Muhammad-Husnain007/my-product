import { Router } from 'express';
import deviceRouter from '../device/route/device.route.js';
import userRouter from '../user/route/user.route.js';
import addressRouter from '../address/route/address.route.js';
import documentRouter from '../document/route/document.route.js';
import vendorRouter from '../onboarding/route/vendor.route.js';
import hallRouter from '../hallUpload/route/hall.route.js';
import accRejRouter from '../../admin/modules/vendorAccRej/route/acceptReject.route.js';

const apiRouter = Router();

apiRouter.use('/device', deviceRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/address', addressRouter);
apiRouter.use('/document', documentRouter);
apiRouter.use('/vendor', vendorRouter);
apiRouter.use('/hall', hallRouter);

//  Admin Routes ??? //////////////////

apiRouter.use('/nova', accRejRouter)

export default apiRouter;
 