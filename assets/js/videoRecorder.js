const recorderContainer = document.getElementById('jsRecordContainer');
const recordBtn = document.getElementById('jsRecordButton');
const videoPreview = document.getElementById('jsVideoPreview');

let streamObject;
let videoRecorder;

const handleVideoData = ( event ) => {
    const {
        data: videoFile
    } = event;

    // <a> 태그를 하나 생성해서 link 변수에 담고
    const link = document.createElement('a');

    // a의 href를 설정해주고 ( 뭔지는 모르겠음... )
    link.href = URL.createObjectURL(videoFile);

    // 파일 다운로드 = 파일명 ( 확장자는 webm인데 오픈소스임. )
    link.download = "recorded.webm";

    // 만들어진 a 를 body에 append 하고
    document.body.appendChild(link);

    // 강제 클릭.
    link.click();
}

const stopRecording = () => {
    videoRecorder.stop();
    recordBtn.removeEventListener( 'click', stopRecording ); 
    recordBtn.addEventListener( 'click', getVideo );
    recordBtn.innerHTML = "Start Recording";
}

const startRecording = async ( stream ) => {
    // 미디어레코더 생성자로 videoRecorder 변수 생성. 스트림 데이터를 인자로 넘김.
    videoRecorder = new MediaRecorder(streamObject);

    // 녹화 시작. start() 안에 숫자를 넣어주면 ms 단위로 넘기고, 해당 시간마다 끊어서 녹화가 가능하다. end 를 안해줘도 리스타트 할때 dataavailable 이벤트 실행 가능.
    videoRecorder.start(); 

    // dataavailable 이벤트는 녹화가 끝났을 때 작동한다.
    videoRecorder.addEventListener( 'dataavailable', handleVideoData );

    // 녹화가 시작되면, 버튼에 Stop 기능을 추가
    recordBtn.addEventListener( 'click', stopRecording ); 
    recordBtn.innerHTML = "Stop Recording";
}

const getVideo = async () => {
    try {
        // 사용자의 미디어 (카메라, 마이크 등)을 입력받는다.
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 }
        });
        // 유저미디어 가져온 stream을 소스로 넘긴다. 파일이 아니고 객체이기 때문에 srcObject 로 넘김.
        videoPreview.srcObject = stream; 

        // 자신의 목소리를 듣지 않게.
        videoPreview.muted = true; 

        videoPreview.play();
        
        streamObject = stream;

        // stream 데이터를 실제로 녹화하기 위해 startRecording 함수로 넘김.
        startRecording();
    } catch(error) {
        recordBtn.innerHTML = "😥 Can't Record";
    } finally {
        recordBtn.removeEventListener( 'click', getVideo );
    }
}

function init() {
    recordBtn.addEventListener( 'click', getVideo );
}

if ( recorderContainer ) {
    init();
}