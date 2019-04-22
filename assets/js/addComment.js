import axios from 'axios';

const addCommentForm = document.getElementById('jsAddComment');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');
const deleteCommentBtn = document.querySelectorAll('.video__comment-deletebtn');


const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML) - 1;
}
    
const SendDelete = async ( commentId, parent ) => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
        url: `/api/${videoId}/comment/delete`,
        method: 'POST',
        data: {
            commentId
        }
    });
    if ( response.status === 200 ) {
        decreaseNumber();
        parent.parentNode.parentNode.removeChild(parent.parentNode);
    }
}

const deleteComment = ( event ) => {
    let parent = event.target.parentNode;
    let commentId = parent.getElementsByClassName('video__comment-id')[0].innerHTML;
    SendDelete( commentId, parent );
}

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML) + 1;
}

const addComment = ( comment, commentId ) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const span2 = document.createElement('span');
    const i = document.createElement('i');

    span.classList.add('video__comment-txt');
    i.classList.add('fas', 'fa-minus-circle', 'video__comment-deletebtn');
    span2.classList.add('video__comment-id');

    span.innerHTML = comment;
    i.addEventListener('click', deleteComment);
    span2.innerHTML = commentId;

    li.appendChild(span);
    span.appendChild(i);
    span.appendChild(span2);

    commentList.prepend(li);

    increaseNumber();
}

const getCommentId = async ( comment ) => {
    const videoId = window.location.href.split("/videos/")[1];
    axios({
        url: `/api/${videoId}/comment/getid`,
        method: 'POST',
        data: {
            comment
        }
    }).then(response => {
        addComment( comment, response.data );
    }).catch(error => { });
}

const sendComment = async ( comment ) => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: 'POST',
        data: {
            comment
        }
    });
    if ( response.status === 200 ) {
        getCommentId(comment);
    }
}

const handleSubmit = ( event ) => {
    event.preventDefault(); // 이벤트를 취소할 수 있는 경우, 이벤트의 전파를 막지않고 그 이벤트를 취소.
    const commentInput = addCommentForm.querySelector('input');
    const comment = commentInput.value;
    sendComment( comment );
    commentInput.value = '';
}

function init() {
    addCommentForm.addEventListener( 'submit', handleSubmit );
    for( let i = 0; i<deleteCommentBtn.length ; i++) {
        deleteCommentBtn[i].addEventListener( 'click', deleteComment );
    }
}

if ( addCommentForm ) {
    init();
}