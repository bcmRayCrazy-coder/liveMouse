import chalk from "chalk";
import { Server, Namespace, Socket } from "socket.io";
import express from "express";
import { createServer } from "http";

const port = 3290;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use('/', express.static('dist'));

io.on('connection', (socket) => {
    var name = '';
    socket.on('auth', (data) => {
        name = data.name;
        socket.emit('authBack', true);
        socket.emit('playerJoin', {
            name,
        });
    });
    socket.on('mouseMove', (data) => {
        io.emit('mouseMove', data);
    });
});

server.listen(port, () => {
    console.log(chalk.green(`server is running at http://localhost:${port}`));
});