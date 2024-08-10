const uservideo = document.getElementById('user-video');

const startBtn = document.getElementById('start-btn');

const state = { media : null} 

const socket = io();

startBtn.addEventListener('click', async(e) => {
    const mediaRecorder = new MediaRecorder(state.media,{
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        framerate: 25
    });

    mediaRecorder.ondataavailable= ev => {
        console.log("Binary Stream :",ev.data);
        socket.emit('stream', ev.data);
    }

    mediaRecorder.start(25)

});

window.addEventListener('load', async(e) => {
    const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    state.media = media;
    uservideo.srcObject = media;
});

