class Line {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.scale = 0;
        this.curve = 0;

        this.spriteX = 0;

        this.spriteList = [];
    }

    project (cam, width, canvas) {
        this.scale = cam.D/(this.z - cam.Z);
        this.X = (1 + this.scale * (this.x - cam.X)) * canvas.width/2;
        this.Y = (1 - this.scale * (this.y - cam.Y)) * canvas.height/2;
        this.W = this.scale * width * canvas.width/2;
    }

    drawSprite (ctx, width) {
        if (this.spriteList.length === 0) {
            // console.log ('sem sprite')
            return ;
        }

        this.spriteList.forEach (sprite => {
            sprite.project (this, width);
            sprite.draw (ctx);
            // console.log ('sprite desenhado') 
        });
    }
}
