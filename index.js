const express = require('express');
const app = express();
const port = 3001;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.send('Hello World!'));

io.on('connection', socket => {
    console.log('a user connected');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
