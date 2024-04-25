class Player {
    constructor (canvas) {
        this.width  = 80;
        this.height = 56;

        this.pos = {
            x : canvas.width/2 - this.width/2,
            y : 90 + canvas.height/2 - this.height/2,
        };

        this.img = new Image ();
        this.img.src = 'res/tomcat.png';
    }

    draw (axis) {
        let x = 160;
        let y = 56;
        ctx.drawImage (
            this.img,
            Math.round (axis.x * 2) * 80 + x , Math.round (-axis.y) * 56 + y,
            this.width, this.height,
            this.pos.x - this.width*1.5, this.pos.y - this.height * 2,
            this.width*4, this.height*4
        );
    }
}
