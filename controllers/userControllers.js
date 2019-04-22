import passport from 'passport';
import routes from '../routes';
import User from '../models/User';


// Join
export const getJoin = (req, res) => {
    res.render('join', { pageTitle: 'Join' } );
}

export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password, password2 } 
    } = req;
    if ( password !== password2 ) {
        res.status(400);
        res.render('join', { pageTitle: 'Join' });
    } else {
        try {
            const user = await User({
                name,
                email
            });
            await User.register(user, password);
            next();
        } catch(error) {
            console.log("❌ [ERROR] : ", error);
            res.redirect(routes.join);
        }
    }
};

// Log in
export const getLogin = (req, res) => {
    res.render('login', { pageTitle: 'Log In' });
};

export const postLogin = passport.authenticate('local', {
    failureRedirect: routes.login,
    successRedirect: routes.home
});


// Github Login
export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
    const { 
        _json : { id, email, name, avatar_url: avatarUrl } 
    } = profile;
    try {
        const user = await User.findOne({ email });
        if(user) {
            user.githubId = id;
            user.avatarUrl ? user.avatarUrl : user.avatarUrl = avatarUrl
            user.save();
            console.log('🔶', user);
            return cb(null, user);
        } 
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl
        });
        return cb(null, newUser);
    } catch(error) {
        return cb(error);
    }
} 

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
}


// Facebook Login
export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = async (_, __, profile, cb) => {
    const { _json: {
        id, name, email
    }} = profile;
    try {
        const user = await User.findOne({ email }); 
        if(user) {
            user.facebookId = id;
            user.avatarUrl ? user.avatarUrl : user.avatarUrl = `http://graph.facebook.com/${id}/picture?type=large`
            user.save();
            console.log('🔶', user);
            return cb(null, user);
        } 
        const newUser = await User.create({
            email,
            name,
            facebookId: id,
            avatarUrl: `http://graph.facebook.com/${id}/picture?type=large`
        });
        return cb(null, newUser);
    } catch(error) {
        cb( error );
    }
}

export const postFacebookLogin = (req, res) => {
    res.redirect(routes.home);
}

// Logout
export const logout = (req, res) => {
    req.logout(); // Passport's powerful function
    res.redirect(routes.home);
} 


// User Detail
// getMe 로 접속 했을 때만 user 정보를 user-detail.pug에 넘겨준다.
// url로 아무 user id 나 입력해서 접속 할 경우, 
// userDetail 함수로 접속이 되는데, 이와 같은 경우 req.user 정보가 들어가지 않기 때문에, 오류가 난다.
export const getMe = async (req, res) => {
    const user = await User.findById( req.user.id ).populate('videos');
    res.render('user-detail', { pageTitle: 'Users', user: user } );
}

export const userDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const user = await User.findById( id ).populate('videos'); // populate는 객체를 가져오는 함수이고, model 타입이 ObjectId 인 객체만 가져올 수 있다.
        res.render('user-detail', { pageTitle: 'User Detail', user });
    } catch(error) {
        console.log(error);
        res.redirect(routes.home);
    }
}

// Edit Profile
export const getEditProfile = (req, res) =>
    res.render('edit-profile', { pageTitle: 'Edit Profile' } );

export const postEditProfile = async (req, res) => {
    const {
        body: { name, email },
        file
    } = req;
    console.log(req);
    try {
        await User.findByIdAndUpdate( req.user.id, { 
            name, 
            email, 
            avatarUrl: file ? file.location : req.user.avatarUrl
        });
        res.redirect(routes.me);
    } catch(error) {
        res.redirect( routes.editProfile );
    }
}

export const getChangePassword = (req, res) => {
    res.render('change-password', { pageTitle: 'Change Password' } );
} 

export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, newPassword2 }
    } = req;

    try {
        if ( newPassword !== newPassword2 ) {
            res.status(400);
            res.redirect( `/users${routes.changePassword}` );
            return;
        }
        await req.user.changePassword( oldPassword, newPassword );
        res.redirect(routes.me);
    } catch(error) {
        res.status(400);
        res.redirect( `/users${routes.changePassword}` );
    }
} 