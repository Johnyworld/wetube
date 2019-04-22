import express from 'express';
import routes from '../routes';
import { postResisterView, postAddComment, postDeleteComment, getGetCommentId } from '../controllers/videoControllers';

const apiRouter = express.Router();

apiRouter.post( routes.resisterView, postResisterView );
apiRouter.post( routes.addComment, postAddComment );
apiRouter.post( routes.deleteComment, postDeleteComment );
apiRouter.post( routes.getCommentId, getGetCommentId );

export default apiRouter;