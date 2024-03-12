const canvas = document.querySelector ('canvas');
const ctx    = canvas.getContext ('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.imageSmoothingEnabled = false

let range = 8192

const scene = new Scenario

for (let i=0; i < 1024; i++) {
    let line = new Line ();
    line.z = i * scene.segL;


    if (i % 16 === 0) {
        let pedra = new Object3D ({
            pos : {
                // x: (i % 2) ? -scene.roadW * 1.5 : scene.roadW * 1.25 ,
                x: Math.round (Math.random () * range*8 - range*4),
                y: 2048*1.5,
                z: i * scene.segL
            },
            width : 240,
            height: 440,
            // color : 'rgba(255,255,255,0.5)',
            imgSrc: 'res/pedra2.png'
        })

        let nuvem = new Object3D ({
            pos : {
                x: Math.round (Math.random () * range*8 - range*4),
                y: Math.round (Math.random () * range*4 + 8192),
                z: i * scene.segL
            },
            width : Math.random () * 768 + 64,
            height: Math.random () * 128 + 64,
            color : 'rgba(255,255,255,0.5)',
            imgSrc: 'res/nuvem.png'
        })

        line.sprite.push (pedra)
        line.sprite.push (nuvem)
    }
    scene.lines.push (line);
}

let N = scene.lines.length;
let pos = 1;

let player= {
    X : 0,
    Y : 4096,
    vel: 256,
}

input.handler = function () {
    if (input.key.RIGHT) {
        if (player.X < scene.width) player.X+=player.vel;
    } else if (input.key.LEFT) {
        if (player.X >  -scene.width) player.X-=player.vel;
    }

    if (input.key.UP) {
        if (player.Y < 8192*2) player.Y+=player.vel;
    } else if (input.key.DOWN) {
        if (player.Y > 2048) player.Y-=player.vel;
    }

    if (input.key.BTN_S) {
        player.vel = 640
    } else if (input.key.BTN_X) {
        player.vel = 128
    } else {
        player.vel = 256
    }
}

let lap = 0;
let dist = 512


const objetos = []

// for (let i=0; i < N; i+=4) {
//     let nuvem = new Object3D ({
//         pos : {
//             x: Math.round (Math.random () * range*8 - range*4),
//             y: Math.round (Math.random () * range*4),
//             z: Math.round (Math.random () * i * scene.segL)
//         },
//         width : Math.random () * 768 + 64,
//         height: Math.random () * 128 + 64,
//         color : 'rgba(255,255,255,0.5)',
//         imgSrc: 'res/nuvem.png'
//     })

//     objetos.push (nuvem)
// }

for (let i=0; i < N; i+=4) {
    let pedra = new Object3D ({
        pos : {
            // x: (i % 2) ? -scene.roadW * 1.5 : scene.roadW * 1.25 ,
            x: Math.round (Math.random () * range*8 - range*4),
            y: 2048*1.5,
            z: i * scene.segL
        },
        width : 240,
        height: 440,
        // color : 'rgba(255,255,255,0.5)',
        imgSrc: 'res/pedra2.png'
    })

    objetos.push (pedra)
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

    // objetos.forEach (obj => {
    //     if (obj.pos.z > scene.cam.Z && obj.pos.z <= (startPos + dist) * scene.segL) {
    //         obj.project (scene.cam)
    //         obj.draw (ctx)
    //         items++
    //     }
    // })

    ctx.drawImage (cockpit, 0, 0, canvas.width, cockpit.height *1.75 )
    ctx.drawImage (mira, canvas.width/2 - mira.width/2, canvas.height/2 - mira.height/2, mira.width, mira.height)



    HUD ();

}

renderer ();

function HUD () {
    ctx.fillStyle = "#3a3";
    ctx.font = '20px VT323'
    // ctx.fillText (`objetos: ${items}`, 100, 530)
    // ctx.fillText (`pos: ${scene.pos/scene.segL}`, 100, 560)
    ctx.fillText (`Movimentação`, 100, 530)
    ctx.fillText (`Setas direcionais`, 100, 560)

    // ctx.fillText (`X: ${player.X}px`, 730, 530)
    // ctx.fillText (`Y: ${player.Y}px`, 730, 560)
    ctx.fillText (`S: acelerar`, 730, 530)
    ctx.fillText (`X: frear`, 730, 560)


}
