import chalk from "chalk";
import { Server, Namespace, Socket } from "socket.io";
import express from "express";
import { createServer } from "http";

const port = 3290;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use('/', express.static('dist'));

var member_num = 0;
var cursors = [
    'blue',
    'green',
    'red',
    'yellow',
    'cyan',
    'orange',
    'pink',
    'purple',
];
var cursor_list = {};

io.on('connection', (socket) => {
    var name = '';
    var current_cursor = cursors[member_num];
    var id = socket.id;
    socket.on('auth', (data) => {
        name = data.name;
        member_num += 1;
        current_cursor = cursors[member_num];
        console.log('===');
        console.log(current_cursor);
        console.log(member_num);
        console.log(cursors[member_num]);
        socket.emit('authBack', {
            member_num,
            current_cursor,
            name,
            id
        });
        io.emit('playerJoin', {
            name,
            tid: id,
            tcurrent_cursor: current_cursor,
            cursor_list
        });
    });
    socket.on('mouseMove', (data) => {
        io.emit('mouseMove', data);
    });
    socket.on('cursorFetchBack', ({ sid, scursor }) => {
        cursor_list[sid] = scursor;
    });
    socket.on('disconnect', () => {
        // member_num -= 1;
        io.emit('playerLeave', {
            name,
            id
        });
    });
});

server.listen(port, () => {
    console.log(chalk.green(`server is running at http://localhost:${port}`));
});