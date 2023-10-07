class Game {

    constructor() {
        this.tour = false;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.pawnContainer = [];
        this.renderer.setClearColor(0x0066ff);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.timer = 30;
        this.final
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);

        this.camera.position.set(0, 100, 100)
        this.camera.lookAt(this.scene.position);

        this.materialWhite = new THREE.MeshBasicMaterial({
            //color: 0xffffff,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('textures/boardWhite.png'),
        });

        this.materialBlack = new THREE.MeshBasicMaterial({
            //color: 0x000000,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('textures/boardBlack.png')
        });

        this.chosenPawn = { chosen: false, i: 0, j: 0 }
        this.chosenBox = { x: 0, j: 0 }
        // this.materialPawnWhite = new THREE.MeshBasicMaterial({
        //     color: 0xffff66,
        //     side: THREE.DoubleSide,
        //     map: new THREE.TextureLoader().load('textures/boardWhite.png'),
        // });



        this.szachownica = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ];

        const axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)

        this.pionki = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];
        this.render() // wywołanie metody render

        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()
        window.addEventListener("mousedown", (e) => {
            this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            let intersects = this.raycaster.intersectObjects(this.scene.children);
            if (intersects.length > 0) {
                if (this.tour) {
                    console.log(intersects[0].object);
                    if (intersects[0].object.thing == "pawn") {
                        if (playerType == intersects[0].object.pawnType) {
                            if (!this.chosenPawn.chosen) {
                                this.chosenPawn.chosen = true;
                                this.chosenPawn.x = intersects[0].object.x
                                this.chosenPawn.y = intersects[0].object.y
                                intersects[0].object.material.color = new THREE.Color(0xff3333)
                                console.log("działa");
                                console.log(intersects[0].object.material.color);
                            }
                            else if (this.chosenPawn.x == intersects[0].object.x && this.chosenPawn.y == intersects[0].object.y) {
                                this.chosenPawn.chosen = false;
                                if (playerType == "white") intersects[0].object.material.color = new THREE.Color(0xffff66)
                                else intersects[0].object.material.color = new THREE.Color(0x000000)
                            }
                        }
                    }
                    if (intersects[0].object.black && this.chosenPawn.chosen) {
                        this.pawnContainer.forEach(element => {
                            if (element.x == this.chosenPawn.x && element.y == this.chosenPawn.y) {
                                this.final = element
                            }
                        });
                        this.pionki[this.chosenPawn.x][this.chosenPawn.y] = 0
                        if (playerType == "white") this.pionki[intersects[0].object.x][intersects[0].object.y] = 1
                        else this.pionki[intersects[0].object.x][intersects[0].object.y] = 2
                        this.final.position.set(5 + 5 * intersects[0].object.y, 6, 5 + 5 * intersects[0].object.x)
                        this.chosenPawn.chosen = false
                        console.log(this.scene.children.length);
                        io().emit("sendBoard", {
                            board: this.pionki
                        })
                    }
                }
            }
        });

    }


    board = () => {

        for (let i = 0; i < this.szachownica.length; i++) {
            for (let j = 0; j < this.szachownica[i].length; j++) {
                const square = this.szachownica[i][j];
                if (square == 1) {
                    const block = new Item(i, j, false)
                    block.position.set(5 + 5 * j, 5, 5 + 5 * i)
                    this.scene.add(block)
                }
                if (square == 0) {
                    //cube = new THREE.Mesh(geometry, this.materialBlack);
                    const block = new Item(i, j, true)
                    block.material.color.setHex("0x4b4b4b")
                    block.position.set(5 + 5 * j, 5, 5 + 5 * i)
                    this.scene.add(block)
                }
            }
        }


        console.log(this.scene);
    }

    set = () => {
        for (let i = 0; i < this.szachownica.length; i++) {
            for (let j = 0; j < this.szachownica[i].length; j++) {
                const square = this.pionki[i][j];
                if (square == 1) {
                    const item = new Pionek("0xffff66", i, j, "white")
                    new TWEEN.Tween(item.position)
                        .to({ x: 5 + 5 * j, y: 6, z: 5 + 5 * i }, 500)
                        .easing(TWEEN.Easing.Bounce.Out)
                        .start();
                    //item.position.set(5 + 5 * j, 6, 5 + 5 * i)
                    item.material.color.setHex("0xffff66")
                    this.scene.add(item)
                    this.pawnContainer.push(item)
                    // pawn = new THREE.Mesh(geometryPawn, this.materialPawnWhite);
                    // pawn.position.set(5 + 5 * j, 6, 5 + 5 * i)
                }
                if (square == 2) {
                    const item = new Pionek("0x808080", i, j, "black")
                    item.material.color.setHex("0x808080")
                    new TWEEN.Tween(item.position)
                        .to({ x: 5 + 5 * j, y: 6, z: 5 + 5 * i }, 500)
                        .easing(TWEEN.Easing.Bounce.Out)
                        .start();
                    //item.position.set(5 + 5 * j, 6, 5 + 5 * i)
                    this.scene.add(item)
                    this.pawnContainer.push(item)
                    // pawn = new THREE.Mesh(geometryPawn, this.materialPawnBlack);
                }
                //this.scene.add(pawn)

            }
        }

        console.log(this.scene);
    }

    cameraPosition = (playerColor) => {
        if (playerColor == "white") this.camera.position.set(20, 65, 75)
        else if (playerColor == "black") { this.camera.position.set(20, 45, -30); this.camera.lookAt(20, 20, 0) }
    }

    timerr = setInterval(() => {
        document.getElementById("timer").innerHTML = `${this.timer} sec`
        this.timer--;
        if (this.tour && this.timer == 0) io().emit("timeLost", {
            playerType: playerType
        })
    }, 1000);

    render = () => {
        TWEEN.update();
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        console.log("render leci")
    }

}