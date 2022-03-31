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
io.on('connection', (socket) => {
    var name = '';
    var current_cursor = cursors[member_num];
    socket.on('auth', (data) => {
        name = data.name;
        member_num += 1;
        socket.emit('authBack', true);
        socket.emit('playerJoin', {
            name,
        });
    });
    socket.on('mouseMove', (data) => {
        io.emit('mouseMove', data);
    });
    socket.on('disconnect', () => {
        member_num -= 1;
        socket.emit('playerLeave', {
            name,
        });
    });
});

server.listen(port, () => {
    console.log(chalk.green(`server is running at http://localhost:${port}`));
});