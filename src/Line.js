class Line {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.scale = 0;
        this.curve = 0;

        this.spriteX = 0;

        this.sprite = null;
    }

    project (cam, width, canvas) {
        this.scale = cam.D/(this.z - cam.Z);
        this.X = (1 + this.scale * (this.x - cam.X)) * canvas.width/2;
        this.Y = (1 - this.scale * (this.y - cam.Y)) * canvas.height/2;
        this.W = this.scale * width * canvas.width/2;
    }

    drawSprite (ctx, width) {
        if (this.sprite === null) {
            return ;
        }

        let destX = this.X + this.scale * this.spriteX * width/2;
        let destY = this.Y + 4;
        let destW  = this.sprite.width * this.W / 266;
        let destH  = this.sprite.height * this.W / 266;

        destX += destW * this.spriteX; //offsetX
        destY += destH * (-1);    //offsetY

        ctx.drawImage (this.sprite, destX, destY, destW, destH)
    }
}
