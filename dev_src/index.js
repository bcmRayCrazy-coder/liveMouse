import { Application, Graphics, Loader, Sprite } from 'pixi.js';
import { io } from "./lib/socket.io.esm.min.js";

function setState(text) {
    console.log(text);
    document.querySelector('#state').innerHTML = text;
}

function draw(x, y) {
    borderline.drawCircle(x, y, 20);
    app.stage.addChild(borderline);
}

setState('加载材质');
var texture_colors = [
    'blue',
    'green',
    'red',
    'yellow',
    'cyan',
    'orange',
    'pink',
    'purple',
]

function loadColorTexture(i, loader, max, init) {
    // var color = texture_colors[i];
    setState(`加载 ${texture_colors[i]}`);
    console.log(loader);
    loader
        .add(texture_colors[i], `./img/cursor_${texture_colors[i]}.png`)
        .load(() => {
            if (i < max - 1) {
                loadColorTexture(i + 1, loader, max, init);
            } else {
                setState('加载完成');
                init();
            }
        });
}



// 初始化socket
setState('连接服务器...');
const socket = io();

var loader = new Loader();
var my_cursor = new Sprite();
var id = '';
var cursors = {};

loadColorTexture(0, loader, texture_colors.length, () => {
    socket.emit('auth', {
        name: prompt('请输入你的名字'),
    });
});


socket.on('authBack', ({ current_cursor }) => {
    setState('连接成功');
    id = socket.id;
    // loader
    //     .add('cursor', './img/cursor_' + current_cursor + '.png')
    //     .load(() => {
    //         let cursor_texture = loader.resources.cursor.texture;
    //         my_cursor = new Sprite(cursor_texture);
    //         app.stage.addChild(my_cursor);
    //         cursors[id] = my_cursor;
    //     });

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
        id,
    });
}
socket.on('mouseMove', ({ x, y, id }) => {
    // draw(x, y);
    // my_cursor.x = x;
    // my_cursor.y = y;
    cursors[id].x = x;
    cursors[id].y = y;
});
socket.on('playerJoin', ({ name, tid, tcurrent_cursor }) => {
    // console.log(tid);
    console.log(tcurrent_cursor);
    // loader
    //     .add(tcurrent_cursor, './img/cursor_' + tcurrent_cursor + '.png')
    //     .load(() => {
    cursors[tid] = new Sprite(loader.resources[tcurrent_cursor].texture);
    console.log(cursors);
    app.stage.addChild(cursors[tid]);
    // });
    // }
    setState(`${name}加入了房间`);
});
socket.on('playerLeave', ({ name }) => {
    setState(`${name}离开了房间`);
});
socket.on('cursorFetchBack', ({ sid, scursor: { x, y, texture } }) => {
    for (const key in cursors) {
        if (Object.hasOwnProperty.call(cursors, key)) {
            app.stage.removeChild(cursors[sid]);
        }
    }
    cursors[sid] = new Sprite(loader.resources[texture].texture);
    for (const key in cursors) {
        if (Object.hasOwnProperty.call(cursors, key)) {
            app.stage.addChild(cursors[sid]);
        }
    }
    cursors[sid].x = x;
    cursors[sid].y = y;
});
setInterval(() => {
    var mcursor = cursors[id];
    console.log(mcursor);
    socket.emit("cursorFetchBack", {
        sid: id,
        scursor: {
            x: mcursor.x,
            y: mcursor.y,
            texture: mcursor.texture.textureCacheIds[0]
        }
    });
}, 5000);