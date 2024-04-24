class Object3D {
    constructor ({pos, width, height, color = 'red', imgSrc = false}) {
        this.pos = {
            x: pos.x,
            y: pos.y,
            z: pos.z,
        };

        this.curve = 0

        this.width = width;
        this.height= height;
        this.color = color;

        if (imgSrc) {
            this.image = new Image ()
            this.image.src = imgSrc
        }
    }

    project (cam) {
        this.scale =  cam.D/(this.pos.z - cam.Z);
        this.X = (1 + this.scale * (this.pos.x - cam.X)) * canvas.width/2;
        this.Y = (1 - this.scale * (this.pos.y - cam.Y)) * canvas.height/2;
    }

    draw (ctx) {
        if (this.image) {
            ctx.drawImage (this.image, this.X, this.Y, this.width * this.scale * canvas.width * 2.25, this.height * this.scale * canvas.height * 4)
            return;
        }
        ctx.fillStyle = this.color
        ctx.fillRect (this.X, this.Y, this.width * this.scale * canvas.width * 2.25, this.height * this.scale * canvas.height * 4)
    }
}
