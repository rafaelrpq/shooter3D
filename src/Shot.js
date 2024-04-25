class Shot extends Object3D {
    constructor ({pos, width, height, color = 'red', imgSrc = false}) {
        super ({pos, width, height, color, imgSrc});
        navigator.vibration (50);
    }

    move () {
        this.pos.z += 256;
    }
}
