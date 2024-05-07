class Scenario {
    constructor ({total = 128, width = 4096, segL = 256, limit = 64}) {
        this.lines = [];
        this.total = total;
        this.width = width;
        this.segL  = segL;
        this.limit = limit;
        this.pos   = 1;
        this.vel   = 96;
    }

    drawQwad (ctx, color, x1, y1, w1, x2, y2, w2) {
        ctx.fillStyle = color;
        ctx.beginPath ();
        ctx.moveTo (x1-w1,y1);
        ctx.lineTo (x2-w2,y2)
        ctx.lineTo (x2+w2,y2)
        ctx.lineTo (x1+w1,y1)
        ctx.closePath ();
        ctx.fill ();
    }

    update (canvas, cam, player) {
        let ctx = canvas.getContext ('2d');

        let grass = ['#696' , '#8b8']
        // let road =  ['#8b8' ,  '#696'];
        let road =  ['#666' ,  '#707070'];

        while (this.pos >= this.total * 256 ) this.pos -= this.total * this.segL ;
        while (this.pos <= 0) this.pos += this.total * this.segL;

        let start = parseInt (this.pos / this.segL) +1;
        // console.log (start);
        let x = 0;
        let dx = 0;

        let bottomLimit = canvas.height;
        for (let i = start; i < start + this.limit; i++) {
            let line = this.lines[i % this.total];
            let prev = this.lines[(i-1) % this.total];

            cam.X = parseInt (player.X - x);
            cam.Y = parseInt (player.Y) ;
            cam.Z = parseInt (this.pos - (i >= this.total ? this.total * this.segL : 0))

            line.project (cam,this.width, canvas);

            x += dx;
            dx += line.curve;

            let currentBottom = prev.Y;
            if (currentBottom > bottomLimit || prev.Y < 0 || line.scale < 0) {
                bottomLimit = currentBottom;
                continue;
            }

            this.drawQwad (ctx, grass[i%2], 0, prev.Y, canvas.width, 0, line.Y, canvas.width);
            if (this.lines[this.total-2].Y > currentBottom)
                this.drawQwad (ctx, 'white', 0, this.lines[this.total-2].Y, canvas.width, 0, this.lines[this.total-1].Y, canvas.width);
            this.drawQwad (ctx, road[i%2], prev.X, prev.Y+1, prev.W, line.X, line.Y, line.W);
        }

        bottomLimit = canvas.height;
        for (let i = start + this.limit; i > start; i--) {

            // if (this.lines[i % this.total].sprite) {
                let currentBottom = this.lines[i%this.total].Y;

                if (currentBottom > bottomLimit || this.lines[(i-1)%this.total].Y < 0 || this.lines[i%this.total].scale < 0) {
                    bottomLimit = currentBottom;
                    continue;
                }

                cam.Z = parseInt (this.pos - (i >= this.total ? this.total * this.segL : 0))

                let x = 0;
                let dx = 0;

                this.lines[i % this.total].drawSprite (ctx, this.width)
                // this.lines[i % this.total].sprite.forEach (sprite => {
                //     sprite.x = x
                //     sprite.project (cam)
                //     x += dx;
                //     dx += this.lines[i % this.total].curve;
                //     // sprite.draw (ctx)
                // });
            // }
        }

        this.pos+=this.vel;
    }
}
