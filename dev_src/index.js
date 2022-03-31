import { Application, Graphics } from 'pixi.js';
import { io } from "./lib/socket.io.esm.min.js";

function setState(text) {
    console.log(text);
    document.querySelector('#state').innerHTML = text;
}

function draw(x, y) {
    borderline.drawCircle(x, y, 20);
    app.stage.addChild(borderline);
}

// 初始化socket
setState('连接服务器...');
const socket = io();

socket.emit('auth', {
    name: prompt('请输入你的名字'),
});
socket.on('authBack', () => {
    setState('连接成功');
});

// 初始化画板
const app = new Application({
    width: 1024,
    height: 512,
    antialias: true,
    backgroundAlpha: 1,
    backgroundColor: 0x000000,
    resolution: 1,
});
document.body.appendChild(app.view);

// 初始化画笔
const borderline = new Graphics();
borderline.lineStyle(1, 0xaaaaaa);
borderline.beginFill(0xffffff);

borderline.drawCircle(0, 0, 50);

// 自定义事件
app.view.onpointerenter = () => {
    app.view.style.cursor = 'none';
}
app.view.onpointerleave = () => {
    app.view.style.cursor = 'default';
}
app.view.onmousemove = (e) => {
    var x = e.clientX;
    var y = e.clientY;
    socket.emit('mouseMove', {
        x,
        y,
    });
}
socket.on('mouseMove', ({ x, y }) => {
    draw(x, y);
});
socket.on('playerJoin', ({ name }) => {
    setState(`${name}加入了房间`);
});