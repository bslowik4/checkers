class Ui {
    constructor() {
        this.userName = document.getElementById("userName").value
    }
}
document.getElementById('submit').onclick = () => {
    net.addUser(this.userName)
}