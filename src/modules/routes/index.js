import { Router } from 'express';
import deviceRouter from '../device/route/device.route.js';
import userRouter from '../user/route/user.route.js';

const apiRouter = Router();

apiRouter.use('/device', deviceRouter);
apiRouter.use('/user', userRouter);

// Agar future me aur modules add karna ho
// router.use('/booking', bookingRouter);
// router.use('/user', userRouter);

export default apiRouter;
