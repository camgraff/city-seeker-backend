require('dotenv').config();
const app = require('express')();
const PORT = 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server); 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

io.on('connection', socket => {
    socket.on('joinGame', (gameId, username) => {
        handleUserJoined(socket, gameId, username);
    });
    socket.on('startGame', startGame);
});

function handleUserJoined(socket, gameId, username) {
    socket.username = username;
    io.in(gameId).clients((error, clients) => {
        console.log(clients);
        let sockets = io.sockets.sockets;
        clients.forEach(client => {
            socket.emit('userJoined', sockets[client].username);
        });
    });
    socket.join(gameId, () => {
        console.log(username +' joined game: ' + gameId);
        socket.to(gameId).emit('userJoined', username);
    });
}

function startGame(gameId) {
    console.log('game started ' + gameId);
    io.in(gameId).emit('startGame');
}

server.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
