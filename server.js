const express = require("express")
const app = express()
const PORT = 3000;
const http = require('http');
const path = require("path")
const server = http.createServer(app);
const { Server } = require("socket.io");
const socketio = new Server(server);
app.use(express.json())
app.use(express.static('static'))

let users = []

app.get("/", function (req, res) {
    res.send("/index.html");
})


socketio.on('connection', (client) => {
    console.log("klient się podłączył z id = ", client.id)
    // client.on("disconnect", (reason) => {
    //     socketio.broadcast.emit("gameOver")
    // })
    // client.id - unikalna nazwa klienta generowana przez socket.io
    client.on("addUser", (data) => {
        if (users.length == 0) {
            users.push(data.userName)
            socketio.emit("playerType", { playerType: "white" });
        }
        else if (users.length == 1) {
            users.push(data.userName)

            async function test() { socketio.emit("playerType", { playerType: "black" }); }
            async function test2() {
                await test()
                socketio.emit("gameStart", { gameStart: "true" });
            }
            test2()
        }
        else { socketio.emit("tooManyPlayers", { error: "too many players" }); }
    })
    client.on("sendBoard", (data) => {
        socketio.emit("serverBoard", { serverBoard: data.board })
    })
    client.on("timeLost", (data) => {
        socketio.emit("GameOver", { playerType: data.playerType })
    })
});



server.listen(3000, () => {
    console.log('server listening on 3000');
});