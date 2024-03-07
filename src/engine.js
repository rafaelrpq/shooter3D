const canvas = document.querySelector ('canvas');
const ctx    = canvas.getContext ('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.imageSmoothingEnabled = false

const roadW = 2048*2;
let segL  = 256;
let camD  = 0.5;
// let camD  = 0.84;

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

const lines = [];
let elevation = 0

for (let i=0; i<2048; i++) {
    let line = new Line ();
    line.z = i * segL;
    lines.push (line);
}

let N = lines.length;
let pos = 1;

let playerX = 0;
let playerY = 1536;

input.handler = function () {

    if (input.key.RIGHT) {
        if (playerX <= 2048*2) playerX+=64;
    } else if (input.key.LEFT) {
        if (playerX >=  -2048*2) playerX-=64;
    }

    if (input.key.UP) {
        if (playerY <= 4096*2) playerY+=64;
    } else if (input.key.DOWN) {
        if (playerY >= 768) playerY-=64;
    }
}

let startPos;
let lap = 0;
let dist = 256

let currentBottom, bottomLimit;

let range = 8192

const objList = []
for (let i=0; i < 2048; i++) {
    let obj = new GameObject ({
        pos : {
            x: Math.round (Math.random () * range*8 - range*4),
            y: Math.round (Math.random () * range*4),
            z: Math.round (Math.random () * N * segL)
        },
        width : 64,
        height: 64,
        color : 'rgba(255,255,255,0.5)',
        imgSrc: 'res/nuvem.png'
    })

    objList.push (obj)
}

const paredeList = []
for (let i=0; i < N; i++) {
    let parede = new GameObject ({
        pos : {
            x: (i % 2) ? -roadW * 1.5 : roadW * 1.25 ,
            y: 2048*1.5,
            z: i  * segL
        },
        width : 240,
        height: 440,
        // color : 'rgba(255,255,255,0.5)',
        imgSrc: 'res/pedra2.png'
    })

    paredeList.push (parede)
}

objList.sort ((a,b) => {
    return b.pos.z - a.pos.z;
})


paredeList.sort ((a,b) => {
    return b.pos.z - a.pos.z;
})

let items = 0

let cockpit = new Image ()
cockpit.src = 'res/cockpit.png'

let mira = new Image ()
mira.src = 'res/mira.png'

function renderer () {
    requestAnimationFrame (renderer);
    // ctx.clearRect (0, 0, canvas.width, canvas.height);
    const grd = ctx.createLinearGradient(0,0,0,canvas.width);
    grd.addColorStop(0,"#43a");
    grd.addColorStop(0.5,"#aff");
    ctx.fillStyle = grd
    ctx.fillRect (0, 0, canvas.width, canvas.height);

    input.handler ();

    bottomLimit = canvas.height

    while (pos >= N * segL) pos -= N * segL;
    while (pos < 0) pos +=  N * segL;

    pos += 128

    startPos = parseInt (pos/segL);

    for (let n=startPos; n < startPos + dist; n++) {
        let l = lines [n%N];

        cam = {
            X: parseInt (playerX),
            Y: parseInt ( playerY + lines[startPos].y),
            Z: parseInt (pos - (n >= N ? N*segL : 0))
        }

        l.project (cam)

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

    // objList.forEach (obj => {
    //     if (obj.pos.z > cam.Z && obj.pos.z <= (startPos + dist) * segL) {
    //         obj.project (cam)
    //         obj.draw (ctx)
    //         items++
    //     }
    // })

    paredeList.forEach (obj => {
        if (obj.pos.z > cam.Z && obj.pos.z <= (startPos + dist) * segL) {
            obj.project (cam)
            obj.draw (ctx)
            items++
        }
    })

    ctx.drawImage (cockpit, 0, 0, canvas.width, cockpit.height *1.75 )
    ctx.drawImage (mira, canvas.width/2 - mira.width/2, canvas.height/2 - mira.height/2, mira.width, mira.height)

    HUD ();

}
let faixa = 25

renderer ();

function HUD () {
    ctx.fillStyle = "#3a3";
    ctx.font = '20px VT323'
    ctx.fillText (`itens: ${items}`, 100, 530)
    ctx.fillText (`altura: ${playerY}px`, 100, 560)
    // ctx.fillText (`itens: ${items}`, 100, 400)
}
