import passport from 'passport';
import GithubStrategy from 'passport-github';
import FacebookStrategy from 'passport-facebook';
import User from './models/User';
import routes from './routes';
import { githubLoginCallback, facebookLoginCallback } from './controllers/userControllers';

passport.use(User.createStrategy());

passport.use( 
    new GithubStrategy({
        clientID: process.env.GH_ID,
        clientSecret: process.env.GH_SECRET,
        callbackURL: `http://localhost:4000${routes.githubCallback}`
    }, githubLoginCallback ) // 모든게 잘 돌아가고 있을 때 돌아가는 함수!
);

passport.use(
    new FacebookStrategy({
        clientID: process.env.FB_ID,
        clientSecret: process.env.FB_SECRET,
        callbackURL: `https://bad-pug-83.localtunnel.me/${routes.facebookCallback}`,
        profileFields: [ 'id', 'displayName', 'photos', 'email' ],
        scope: [ 'public_profile', 'email' ]
    }, facebookLoginCallback ) // 모든게 잘 돌아가고 있을 때 돌아가는 함수!
);


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());