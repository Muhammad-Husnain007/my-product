import { Router } from 'express';
import deviceRouter from '../device/route/device.route.js';
import userRouter from '../user/route/user.route.js';
import addressRouter from '../address/route/address.route.js';
import documentRouter from '../document/route/document.route.js';

const apiRouter = Router();

apiRouter.use('/device', deviceRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/address', addressRouter);
apiRouter.use('/document', documentRouter);

// Agar future me aur modules add karna ho
// router.use('/booking', bookingRouter);
// router.use('/user', userRouter);

export default apiRouter;
 