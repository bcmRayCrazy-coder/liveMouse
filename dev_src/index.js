import { Application } from 'pixi.js';
import { io } from "./lib/socket.io.esm.min.js";

function setState(text) {
    console.log(text);
    document.querySelector('#state').innerHTML = text;
}

setState('连接服务器...');
const socket = io();

socket.emit('auth', {
    name: prompt('请输入你的名字'),
});
socket.on('authBack', () => {
    setState('连接成功');
});

const app = new Application({
    width: 1024,
    height: 512,
    antialias: true,
    backgroundAlpha: 1,
    backgroundColor: 0x000000,
    resolution: 1,
});
document.body.appendChild(app.view);
app.view.onpointerenter = () => {
    app.view.style.cursor = 'none';
}
app.view.onpointerleave = () => {
    app.view.style.cursor = 'default';
}