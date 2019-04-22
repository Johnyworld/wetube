import routes from '../routes';
import Video from '../models/Video';
import Comment from '../models/Comment';


// Home
export const home = async(req, res) => {
    try {
        const videos = await Video.find({}).sort({ _id: -1 });
        res.render( "home", {
            pageTitle: 'Home', 
            videos 
        });
    } catch(error) {
        console.log(error);
        res.render( "home", { 
            pageTitle: 'Home', 
            videos : []
        });
    }
}

// Search
export const search = async (req, res) => {
    const {
        query: {
            term: searchingBy 
        }
    } = req;
    let videos = [];
    try {
        videos = await Video.find({ title: {$regex: searchingBy, $options: 'i'} });
    } catch(error) {
        console.log(error);
    }
    res.render("search", { pageTitle: 'Search', searchingBy, videos });
}

// Upload
export const getUpload = (req, res) => {
    res.render('upload', { pageTitle: 'Upload' } );
} 

export const postUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { location }
    } = req;
    const newVideo = await Video.create({
        fileUrl: location,
        title,
        description,
        creator: req.user.id
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
}

// Video Detail
export const videoDetail = async (req, res) => {
    
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id)
            .populate('creator')
            .populate('comments'); // populate는 객체를 가져오는 함수이고, model 타입이 ObjectId 인 객체만 가져올 수 있다.
        res.render('video-detail', { pageTitle: video.title, video } );
    } catch(error) {
        console.log(error);
        res.redirect( routes.home );
    }
} 

// Edit Video
export const getEditVideo = async (req, res) => {
    try {
        const {
            params: { id }
        } = req;
        const video = await Video.findById(id);
        if ( video.creator.toString() !== req.user.id.toString() ) {
            throw Error();
        } else {
            res.render('edit-video', { pageTitle: `Edit ${video.title}`, video } );
        }
    } catch(error) {
        console.log(error);
        res.redirect(routes.home);
    }
} 

export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, { title, description });
        res.redirect(routes.videoDetail( id ));
    } catch(error) {
        console.log(error);
        res.redirect(routes.home);
    }
} 

// Delete Video
export const deleteVideo = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id);
        console.log(video.creator);
        console.log(req.user.id);
        if ( video.creator.toString() !== req.user.id.toString() ) {
            throw Error();
        } else {
            await Video.findByIdAndRemove({ _id: id });
        }
        // res.render('delete-video', { pageTitle: 'Delete Video' } );
    } catch( error ) {
        console.log(error);
    }
    res.redirect(routes.home);
} 


// Resister Video Views : 이 함수는 템플릿이 없고 오직 서버와 소통만 한다.
export const postResisterView = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById( id ); // 현재 url의 parameter에 있는 id 값을 mongoose의 기능인 findById로 넘겨서 해당하는 비디오를 video 상수에 담고
        video.views += 1; // 그 video 상수의 views 값을 +1
        video.save(); // 그리고 저장
        res.status(200); // Okay !
    } catch(error) {
        res.status(400);
        res.end();
    } finally {
        res.end();
    }
}  

// Add Comment
export const postAddComment = async (req, res) => {
    const {
        params: { id },
        body: { comment },
        user
    } = req;
    try {
        const video = await Video.findById( id );
        const newComment = await Comment.create({
            text: comment,
            creator: user.id
        });
        video.comments.push( newComment.id );
        video.save();
    } catch(error) {
        res.status(400);
    } finally {
        res.end();
    }
}

// Delete Comment
export const postDeleteComment = async (req, res) => {
    const {
        params: { id },
        body: { commentId },
        user
    } = req;
    try {
        await Comment.findByIdAndRemove( commentId );
    } catch(error) {
        res.status(400);
    } finally {
        res.end();
    }
}

export const getGetCommentId = async (req, res) => {
    const {
        params: { id },
        body: { comment },
        user
    } = req;
    let commentId = undefined; 
    try {
        const video = await Video.findById( id ).populate('comments');
        const comments = video.comments;
        comments.forEach(cmt => {
            if ( cmt.text == comment ) {
                commentId = cmt.id;
            }
        });
    } catch (error) {
        res.status(400);
    } finally {
        res.end(commentId);
    }
}