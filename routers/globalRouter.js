import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoControllers";
import { getJoin, postJoin, logout, getLogin, postLogin, githubLogin, postGithubLogin, getMe, facebookLogin, postFacebookLogin } from "../controllers/userControllers";
import { onlyPublic, onlyPrivate } from "../middlewares";

const globalRouter = express.Router();

// Join
globalRouter.get( routes.join, onlyPublic, getJoin );
globalRouter.post( routes.join, onlyPublic, postJoin, postLogin );

// Login
globalRouter.get( routes.login, onlyPublic, getLogin );
globalRouter.post( routes.login, onlyPublic, postLogin );

globalRouter.get( routes.home, home );
globalRouter.get( routes.search, search );

globalRouter.get( routes.logout, onlyPrivate, logout );


// Github Login
globalRouter.get( routes.github, githubLogin );
globalRouter.get( 
    routes.githubCallback, 
    passport.authenticate('github', { failureRedirect: '/login' }), 
    postGithubLogin 
);

// Facebook Login
globalRouter.get( routes.facebook, facebookLogin );
globalRouter.get( 
    routes.facebookCallback, 
    passport.authenticate('facebook', { failureRedirect: '/login' }), 
    postFacebookLogin 
);

// Logged User Detail
globalRouter.get( routes.me, getMe );

export default globalRouter;