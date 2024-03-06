const canvas = document.querySelector ('canvas');
const ctx    = canvas.getContext ('2d');

canvas.width = 1024;
canvas.height = 576;

const roadW = 2048;
let segL  = 256;
let camD  = 0.84;

let cam = {
    X: 0,
    Y: 0,
    Z: 0,
}

class Line {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.scale = 0;
        this.curve = 0;
    }

    project (cam) {
        this.scale = camD/(this.z - cam.Z);
        this.X = (1 + this.scale * (- cam.X)) * canvas.width/2;
        this.Y = (1 - this.scale * (- cam.Y)) * canvas.height/2;
        this.W = this.scale * roadW * canvas.width/2;
    }
}


class GameObject {
    constructor ({pos, width, height, color = 'red', imgSrc = false}) {
        this.pos = {
            x: pos.x,
            y: pos.y,
            z: pos.z,
        };

        this.width = width;
        this.height= height;
        this.color = color;

        if (imgSrc) {
            this.image = new Image ()
            this.image.src = imgSrc
        }
    }

    project (cam) {
        this.scale =  camD/(this.pos.z - cam.Z);
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

// class Line {
//     constructor () {
//         this.x = 0;
//         this.y = 0;
//         this.z = 0;

//         this.scale = 0;
//         this.curve = 0;
//     }

//     project (cam) {
//         this.scale = camD/(this.z - cam.Z);
//         this.X = (1 + this.scale * (this.x - cam.X)) * canvas.width/2;
//         this.Y = (1 - this.scale * (this.y - cam.Y)) * canvas.height/2;
//         this.W = this.scale * roadW * canvas.width/2;
//     }
// }

function drawQuad (color, x1, y1, w1, x2, y2, w2) {
    ctx.fillStyle = color;
    ctx.beginPath ();
    ctx.moveTo (x1-w1,y1);
    ctx.lineTo (x2-w2,y2)
    ctx.lineTo (x2+w2,y2)
    ctx.lineTo (x1+w1,y1)
    ctx.closePath ();
    ctx.fill ();
}

// function drawQuad (color, line1, line2) {
//     ctx.fillStyle = color;
//     ctx.beginPath ();
//     ctx.moveTo (line1.x - line1.w,line1.y);
//     ctx.lineTo (line2.x - line2.w,line2.y)
//     ctx.lineTo (line2.x + line2.w,line2.y)
//     ctx.lineTo (line1.x + line1.w,line1.y1)
//     ctx.closePath ();
//     ctx.fill ();
// }

const lines = [];
let elevation = 0

for (let i=0; i<2048; i++) {
    let line = new Line ();
    line.z = i * segL;



    lines.push (line);
}

// lines.reverse ()

let N = lines.length;
let pos = 1;

let playerX = 0;
let playerY = 1536;

input.handler = function () {
    // if (input.key.UP) {
    //     pos+=200;
    // } else if (input.key.DOWN) {
    //     pos-=200;
    // }

    if (input.key.RIGHT) {
        if (playerX < 1536) playerX+=64;
    } else if (input.key.LEFT) {
        if (playerX > -1536) playerX-=64;
    }

    if (input.key.UP) {
        if (playerY < 2048) playerY+=32;
    } else if (input.key.DOWN) {
        if (playerY > 768)  playerY-=32;
    }
}

let startPos;
let lap = 0;
let dist = 256

const img = new Image ();
img.src = 'res/placa2.png';
let currentBottom, bottomLimit;


const objList = []
for (let i=0; i < 2048; i++) {
    objList.push (
        new GameObject ({
            pos : {
                x: Math.round (Math.random () * 4096 - 2048),
                y: Math.round (Math.random () * 2560),
                z: Math.round (Math.random () * N * segL)
            },
            width : 64,
            height: 64,
            color : 'rgba(255,255,255,0.5)',
            imgSrc: 'res/nuvem.png'
        })
    )
}

objList.sort ((a,b) => {
    return b.pos.z - a.pos.z;
})

let items = 0


function renderer () {
    requestAnimationFrame (renderer);
    ctx.clearRect (0, 0, canvas.width, canvas.height);

    // ctx.drawImage (img, 0, -canvas.height/2.5, canvas.width, canvas.height);
    input.handler ();

    bottomLimit = canvas.height

    while (pos >= N * segL) pos -= N * segL;
    while (pos < 0) pos +=  N * segL;
    pos += 128
    var x   = 0;
    var dx  = 0;
    startPos = parseInt (pos/segL);

    let  maxY = -canvas.height;
    // let  maxY = 0;

    for (let n=startPos; n < startPos + dist; n++) {
        let l = lines [n%N];

        cam = {
            X: parseInt (playerX - x),
            Y: parseInt ( playerY + lines[startPos].y),
            Z: parseInt (pos - (n >= N ? N*segL : 0))
        }

        l.project (cam)

        x += dx;
        dx += l.curve;

        if (maxY > l.y) {
            maxY = l.y;
            // continue;
        }
        maxY = l.y

        let grass = (n)%2 ? '#696' : '#8b8';
        let road = (n)%2 ? '#666' : '#707070';

        let p = lines [Math.abs (n-1) % N];

        currentBottom = p.Y;
        if ((currentBottom < bottomLimit || p.Y < 0 || l.scale < 0) && cam. Y > 0) {
            bottomLimit = currentBottom;
            continue;
        }
        drawQuad (grass, 0, p.Y, canvas.width, 0, l.Y, canvas.width);
        drawQuad (road, p.X, p.Y+1, p.W, l.X, l.Y, l.W);


    }
        items = 0
    objList.forEach (obj => {
        if (obj.pos.z > cam.Z && obj.pos.z <= (startPos + dist) * segL) {
            obj.project (cam)
            obj.draw (ctx)
            items++
        }
    })
    HUD ();

}
let faixa = 25

renderer ();

function HUD () {
    ctx.fillStyle = "#333";
    ctx.font = '20px Monospace'
    ctx.fillText (`itens: ${items}`, 40, 40)
}
