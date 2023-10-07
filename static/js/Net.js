class Net {

    constructor() {
        this.i = 0
        io().on("serverBoard", (data) => {
            game.timer = 30
            game.scene.children = []
            game.tour = !game.tour
            this.i++
            console.log(this.i);
            game.pionki = data.serverBoard
            game.board()
            game.set()
        })
        io().on("GameOver", (data) => {
            document.body.innerHTML = `${data.playerType} lost by time`
        })
    }

    addUser(userName) {
        playerType = "test";
        io().emit("addUser", {
            userName: userName
        })

        io().on("playerType", (data) => {
            console.log(data)
            document.getElementById("nameInput").style.display = "none"
            if (playerType == "test") playerType = data.playerType
            game.cameraPosition(playerType)
            document.getElementById("await").style.display = "block"
        })
        io().on("tooManyPlayers", (data) => {
            document.body.innerHTML = data.error;
        })
        io().on("gameStart", (data) => {
            console.log(data)
            document.getElementById("await").style.display = "none"
            game.board()
            game.set()
            if (playerType == "white") game.tour = true;
        })
    }


}