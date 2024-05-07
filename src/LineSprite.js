class LineSprite {
    constructor ({pos, imgSrc}) {
        this.pos = {
            x : pos.x,
            y : pos.y,
        }

        this.X = 0
        this.Y = 0
        this.W = 0
        this.H = 0

        this.img = new Image ();
        this.img.src = imgSrc
    }

    project (line, width) {
        this.X = line.X + line.scale * this.pos.x * width/2;
        this.Y = line.Y + 4;
        
        this.W  = this.img.width * line.W / 266;
        this.H  = this.img.height * line.W / 266;

        this.X += this.W * this.pos.x //offsetX
        this.Y += this.H * (-1);    //this.Y
    }

    draw (ctx) {
        ctx.drawImage (this.img, this.X, this.Y, this.W, this.H);
    }
}
