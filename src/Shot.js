class Shot extends Object3D {
    constructor ({pos, width, height, color = 'red', imgSrc = false}) {
        super ({pos, width, height, color, imgSrc});
    }

    move () {
        this.pos.z += 256;
    }
}
