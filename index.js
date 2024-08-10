import http from 'http';
import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import {  Server as socketIO} from 'socket.io'

const app = express();

const server = http.createServer(app);

const io = new socketIO(server);

const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2/dcfx-m7v2-j248-3185-9207`,
];

const ffpegProcss = spawn('ffmpeg', options);

ffpegProcss.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ffpegProcss.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ffpegProcss.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});


app.use(express.static(path.resolve( './public')));

io.on('connection', (socket) => {
    console.log("socket connected",socket.id);
    socket.on('stream', (data) => {
        ffpegProcss.stdin.write(data, err => {
            console.log('ERR: ',err);
        });
    });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});