require('dotenv').config();
const app = require('express')();
const PORT = process.env.PORT;
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
    socket.on('updateScore', (score, gameId) => {
        updatePlayerScore(socket, score, gameId);
    });
});

function handleUserJoined(socket, gameId, username) {
    socket.username = username;
    // Send signal to joing socket of users who are already in the lobby
    io.in(gameId).clients((error, clients) => {
        console.log(clients);
        let sockets = io.sockets.sockets;
        clients.forEach(client => {
            socket.emit('userJoined', sockets[client].username);
        });
    });

    // Finally allow the socket to join the game
    socket.join(gameId, () => {
        console.log(username +' joined game: ' + gameId);
        socket.to(gameId).emit('userJoined', username);
    });
}

function startGame(gameId) {
    console.log('game started ' + gameId);
    io.in(gameId).emit('startGame');
}

function updatePlayerScore(socket, score, gameId) {
    console.log(score, gameId);
    io.in(gameId).emit('playerScoreUpdated', socket.username, score);
}

server.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
