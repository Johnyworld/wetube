import getBlobDuration from 'get-blob-duration';

const videoContainer = document.getElementById('jsVideoPlayer');
const videoPlayer = document.querySelector('#jsVideoPlayer video');
const playBtn = document.getElementById('jsPlayButton');
const volumeBtn = document.getElementById('jsVolumeButton')
const fullScreenBtn = document.getElementById('jsFullScreen');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const volumeRange = document.getElementById('jsVolume');

const resisterView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, {
        method : "POST"
    });
}

function handlePlayClick() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>'
    } else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>'
    }
}

function handleVolumeClick() {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up">';
        volumeRange.value = videoPlayer.volume;
    } else {
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute">';
        volumeRange.value = 0; 
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
    fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScreenBtn.removeEventListener( 'click', exitFullScreen );
    fullScreenBtn.addEventListener( 'click', goFullScreen );
}

function goFullScreen() {
    if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) { /* Firefox */
        videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) { /* IE/Edge */
        videoContainer.msRequestFullscreen();
    }
    fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScreenBtn.removeEventListener( 'click', goFullScreen );
    fullScreenBtn.addEventListener( 'click', exitFullScreen );
}

const formatDate = seconds => {
    // 초를 정수로 표현
    const totalSeconds = parseInt( seconds, 10 );
    
    // 1시간은 3600초. 나머지 버림.
    let hours = Math.floor( totalSeconds / 3600 );

    // 토탈에서 시간으로 제해진 분량을 먼제 빼면, 59분 이하만 남게된다. 남은 분중에서 1분은 60초. 나머지 버림.
    let minutes = Math.floor(( totalSeconds - hours * 3600 ) / 60 );

    // totalSeconds 에서 현재 시간과 분을 합친 값을 빼면, 나머지로 버려진 초의 값을 구할 수 있다.
    let secondsNum = totalSeconds - hours * 3600 - minutes * 60;

    // 시, 분, 초의 숫자가 한자리수일 경우 앞에 0을 붙여준다.
    if ( hours < 10 ) {
        hours = `0${hours}`;
    }

    if ( minutes < 10 ) {
        minutes = `0${minutes}`;
    }

    if ( secondsNum < 10 ) {
        secondsNum = `0${secondsNum}`;
    }
    return `${hours}:${minutes}:${secondsNum}`;
}

function getCurrentTime() {
    currentTime.innerHTML = formatDate( Math.floor(videoPlayer.currentTime) );
}

async function setTotalTime() {
    const blob = await fetch(videoPlayer.src).then( response => response.blob());
    const duration = await getBlobDuration(blob);
    console.log(duration);
    const totalTimeString = formatDate(duration);
    totalTime.innerHTML = totalTimeString;
    setInterval( getCurrentTime, 1000 );
}

function handleEnded() {
    resisterView();
    videoPlayer.currentTime = 0;
    playBtn.innerHTML = '<i class="fas fa-play"></i>'
}

function handleDrag(event) {
    const { 
        target: { value }
    } = event
    videoPlayer.volume = value;
    if ( value > 0.6 ) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up">';
    } else if ( value > 0.1 ) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down">';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-off">';
    }
}

function init() {
    videoPlayer.volume = 0.5;
    playBtn.addEventListener( 'click', handlePlayClick );
    volumeBtn.addEventListener( 'click', handleVolumeClick );
    fullScreenBtn.addEventListener( 'click', goFullScreen );
    videoPlayer.addEventListener( 'loadedmetadata', setTotalTime );
    videoPlayer.addEventListener( 'ended', handleEnded );
    volumeRange.addEventListener( 'input', handleDrag );
}

if ( videoContainer ) {
    init();
}