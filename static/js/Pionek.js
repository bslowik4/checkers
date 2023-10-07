class Pionek extends THREE.Mesh {

    constructor(color, x, y, pawnType) {
        const geometry = new THREE.CylinderGeometry(2, 2, 1);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('textures/pawn.png'),
        });
        super(geometry, material)
        this.color = color
        this.pawnType = pawnType
        this.x = x
        this.y = y
        this.thing = "pawn"
    }


}
