import express from "express";
import routes from "../routes";
import { getUpload, postUpload, deleteVideo, videoDetail, getEditVideo, postEditVideo } from "../controllers/videoControllers";
import { uploadVideo, onlyPrivate } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get( "/", (req, res) => res.send('Videos!') );

// Upload Video
videoRouter.get( routes.upload, onlyPrivate, getUpload );
videoRouter.post( routes.upload, onlyPrivate, uploadVideo, postUpload );

// Video Detail
videoRouter.get( routes.videoDetail(), videoDetail );

// Edit Video
videoRouter.get( routes.editVideo(), onlyPrivate, getEditVideo );
videoRouter.post( routes.editVideo(), onlyPrivate, postEditVideo );

// Delete Video
videoRouter.get( routes.deleteVideo(), onlyPrivate, deleteVideo );

export default videoRouter;
