const canvas = document.querySelector ('canvas');
const ctx    = canvas.getContext ('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.imageSmoothingEnabled = false

// function
const scene = new Scenario

for (let i=0; i < 2048; i++) {
    let line = new Line ();
    line.z = i * scene.segL;
    scene.lines.push (line);
}

let N = scene.lines.length;
let pos = 1;

let player= {
    X : 0,
    Y : 1536,
}

input.handler = function () {

    if (input.key.RIGHT) {
        if (player.X <= 2048*2) player.X+=64;
    } else if (input.key.LEFT) {
        if (player.X >=  -2048*2) player.X-=64;
    }

    if (input.key.UP) {
        if (player.Y <= 4096*2) player.Y+=64;
    } else if (input.key.DOWN) {
        if (player.Y >= 768) player.Y-=64;
    }
}

let lap = 0;
let dist = 256

let range = 8192

const objetos = []
for (let i=0; i < N; i++) {
    let nuvem = new Object3D ({
        pos : {
            x: Math.round (Math.random () * range*8 - range*4),
            y: Math.round (Math.random () * range*4),
            z: Math.round (Math.random () * N * scene.segL)
        },
        width : 64,
        height: 64,
        color : 'rgba(255,255,255,0.5)',
        imgSrc: 'res/nuvem.png'
    })

    objetos.push (nuvem)
}

for (let i=0; i < N; i++) {
    let parede = new Object3D ({
        pos : {
            // x: (i % 2) ? -scene.roadW * 1.5 : scene.roadW * 1.25 ,
            x: Math.round (Math.random () * range*8 - range*4),
            y: 2048*1.5,
            z: i * 2 * scene.segL
        },
        width : 240,
        height: 440,
        // color : 'rgba(255,255,255,0.5)',
        imgSrc: 'res/pedra2.png'
    })

    objetos.push (parede)
}

objetos.sort ((a,b) => {
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

    let startPos = scene.update (dist, player, ctx, canvas)

    items = 0


    objetos.forEach (obj => {
        if (obj.pos.z > scene.cam.Z && obj.pos.z <= (startPos + dist) * scene.segL) {
            obj.project (scene.cam)
            obj.draw (ctx)
            items++
        }
    })

    ctx.drawImage (cockpit, 0, 0, canvas.width, cockpit.height *1.75 )
    ctx.drawImage (mira, canvas.width/2 - mira.width/2, canvas.height/2 - mira.height/2, mira.width, mira.height)

    HUD ();

}

renderer ();

function HUD () {
    ctx.fillStyle = "#3a3";
    ctx.font = '20px VT323'
    ctx.fillText (`itens: ${items}`, 100, 530)
    ctx.fillText (`altura: ${player.Y}px`, 100, 560)
    // ctx.fillText (`itens: ${items}`, 100, 400)
}
