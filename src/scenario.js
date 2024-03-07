class Scenario {
    constructor () {
        this.roadW = 2048*2;
        this.segL  = 256;
        this.pos = 0

        this.lines = [];

        this.cam = {
            X: 0,
            Y: 0,
            Z: 0,
            D: 0.5,
        }
    }

    drawQuad (ctx, color, x1, y1, w1, x2, y2, w2) {
        ctx.fillStyle = color;
        ctx.beginPath ();
        ctx.moveTo (x1-w1,y1);
        ctx.lineTo (x2-w2,y2)
        ctx.lineTo (x2+w2,y2)
        ctx.lineTo (x1+w1,y1)
        ctx.closePath ();
        ctx.fill ();
    }

    update (dist, player, ctx, canvas) {
        let bottomLimit = canvas.height
        let currentBottom;
        let N = this.lines.length;

        while (this.pos >= N * this.segL/2) this.pos -= N * this.segL/2;
        while (this.pos < 0) this.pos +=  N * this.segL/2;


        this.pos += 128

        // console.log (this.pos, N * this.segL)

        let current = parseInt (this.pos/this.segL)
        let startPos = (current > N ) ? 0: current ;


        // console.log (startPos, current, N)

        for (let n=startPos; n < startPos + dist; n++) {
            let l = this.lines [n%N];

            this.cam = {
                X: parseInt (player.X),
                Y: parseInt ( player.Y + this.lines[startPos].y),
                Z: parseInt (this.pos - (n >= N ? N*this.segL : 0)),
                D: this.cam.D
            }

            l.project (this.cam, this.roadW)

            let grass = (n)%2 ? '#696' : '#8b8';
            let road = (n)%2 ? '#666' : '#707070';

            let p = this.lines [Math.abs (n-1) % N];

            currentBottom = p.Y;
            if ((currentBottom < bottomLimit || p.Y < 0 || l.scale < 0) && this.cam.Y > 0) {
                bottomLimit = currentBottom;
                continue;
            }
            this.drawQuad (ctx, grass, 0, p.Y, canvas.width, 0, l.Y, canvas.width);
            this.drawQuad (ctx, road, p.X, p.Y+1, p.W, l.X, l.Y, l.W);

        }

        return startPos;
    }
}

class Line {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.scale = 0;
        this.curve = 0;
    }

    project (cam, roadW) {
        this.scale = cam.D/(this.z - cam.Z);
        this.X = (1 + this.scale * (this.x - cam.X)) * canvas.width/2;
        this.Y = (1 - this.scale * (this.y - cam.Y)) * canvas.height/2;
        this.W = this.scale * roadW * canvas.width/2;
    }
}


