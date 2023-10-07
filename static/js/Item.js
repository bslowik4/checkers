class Item extends THREE.Mesh {
    constructor(x, y, black) {
        let geometry = new THREE.BoxGeometry(5, 1, 5);
        let materialWhite = new THREE.MeshBasicMaterial({
            //color: 0xffffff,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('textures/boardBlack.png'),
        });
        super(geometry, materialWhite)

        this.x = x
        this.y = y
        this.black = black
        this.thing = "square"
    }
}