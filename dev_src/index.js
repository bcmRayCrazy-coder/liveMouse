import { Application } from 'pixi.js';
import io from 'socket.io';

function setState(text) {
    console.log(text);
    document.querySelector('#state').innerHTML = text;
}

setState('连接服务器...');
const socket = io();

const app = new Application({
    width: 256,
    height: 256,
    antialias: true,
    transparent: false,
    resolution: 1,
});
document.body.appendChild(app.view);