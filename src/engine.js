const canvas = document.querySelector ('canvas');
const ctx    = canvas.getContext ('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false;

document.addEventListener ('contextmenu', e => {
    e.preventDefault ();
    e.stopPropagation()
    e.stopImmediatePropagation();
}, {'passive' : false});

let height = 1536;
const cam = {
    X : 0,
    Y : height,
    Z : 0,
    D : 1,
};

const effect = new Audio ('');

const scene = new Scenario ({total: 256});

for (let i=0; i < scene.total; i++) {
    let line = new Line ();
    line.z = i * scene.segL;
    if (i > 80 && i < 100) {
        line.curve = 24;
    }

    if (i > 150 && i < 180) {
        line.curve = -24;
    }



    if (i%8 === 0) {
        let sprite = new Image ()
        sprite.src = 'res/sprites/pedra2.png'
        line.sprite = sprite;
        line.spriteX = 11;
    }
    //     let obj = new Object3D ({
    //         pos : {
    //             // x: Math.random () * scene.width * 2  - scene.width,
    //             x: scene.width,
    //             y: 8 * 220,
    //             z: i * 256,
    //         },
    //         width : 120,
    //         height: 220,

    //         imgSrc: 'res/sprites/pedra2.png'

    //     })

    //     line.sprite.push (obj)
    // }

    // line.sprite.push (
    //     new Object3D ({
    //         pos : {
    //             x: Math.random () * 8192 * 12 - 8192 * 4,
    //             y: Math.random () * 8192 * 2 + 2048,
    //             z: (i+scene.limit) * 256,
    //         },
    //         width : 16,
    //         height: 16,
    //         color : `white`,
    //     })
    // )

    scene.lines.push (line);
}

function pause () {
    if (game.running) {
        cancelAnimationFrame (game.frame);
        let msg = "= EM PAUSA =";
        ctx.font = '40px VT323'
        ctx.fillStyle = 'black'
        ctx.textAlign = textAlign.CENTER;
        ctx.fillText (msg, (canvas.width/2) + 2, (canvas.height/2) + 2);
        ctx.fillStyle = 'white'
        ctx.fillText (msg, (canvas.width/2), (canvas.height/2));
        game.running = false
    } else {
        render ();
        game.running = true
    }
}

input.handler = function () {
    vel = 64;

    const limits = {
        TOP    : 8192,
        BOTTOM : 680,
        LEFT   : -4096,
        RIGHT  : 4096,
    };

    if (input.key.UP) {
        player.Y = (player.Y < limits.TOP) ? player.Y + vel : limits.TOP;
    } else if (input.key.DOWN) {
        player.Y = (player.Y > limits.BOTTOM) ? player.Y - vel : limits.BOTTOM;
    } else {
        player.Y+=0;
    }

    if (input.key.LEFT) {
        player.X = (player.X > limits.LEFT) ? player.X - vel : limits.LEFT;
    } else if (input.key.RIGHT) {
        player.X = (player.X < limits.RIGHT) ? player.X + vel : limits.RIGHT;
    } else {
        player.X+=0;
    }

    if (player.Y < limits.TOP){
        player.Y += 32 * input.axis.y;
    } else {
        player.Y = limits.TOP
    }

    if (player.Y > limits.BOTTOM){
        player.Y +=  32 * input.axis.y;
    } else {
        player.Y = limits.BOTTOM
    }

    if (player.X < limits.RIGHT){
        player.X +=  32 * input.axis.x;
    } else {
        player.X = limits.RIGHT
    }

    if (player.X > limits.LEFT){
        player.X +=  32 * input.axis.x;
    } else {
        player.X = limits.LEFT
    }


    if (input.button.S) {
        if (effect.src !== 'res/audio/shot.mp3') {
            effect.src = 'res/audio/shot.mp3'
        }
        shots.list.push (
            new Shot ({
                pos : {
                    x: cam.X - 4,
                    y: cam.Y - 4,
                    z: cam.Z,
                },

                width : 2,
                height: 2,
                color : 'red',
            })
        );
        input.button.S = false;
        effect.play().then(() => {
            console.log('Áudio reproduzido com sucesso!');
        }).catch(error => {
            console.error('Erro ao reproduzir áudio:', error);
        }).finally (
            console.log ('finalizado')
        );
    }

    if (input.button.D) {
        game.debug = !game.debug;
        input.button.D = false;
    }
    
    if (input.button.X) {
        scene.vel = 64;
    } else {
        scene.vel = 32
    }

}



let shots = {
    list : [],
    update : (scene, cam, ctx) => {
        shots.list.forEach (shot => {
            shot.move ();
            shot.project (cam);
            shot.draw (ctx);
            if (shot.pos.z > cam.Z + scene.limit * scene.segL) {
                shots.list.pop (shot);
            }
        })
    }
};


const textAlign = {
    LEFT   : 'left',
    CENTER : 'center',
    RIGHT  : 'right',
}

function joystickDebug (x,y,align = textAlign.LEFT) {
    ctx.fillStyle = "#fff";
    ctx.font = '32px VT323'
    ctx.textAlign = align;
    ctx.fillText ('joystick', x, y);
    ctx.fillText ('├ x : '+ input.axis.x.toFixed(2).toString().padStart(5,' '), x, y*2);
    ctx.fillText ('└ y : '+ input.axis.y.toFixed(2).toString().padStart(5,' '), x, y*3);


    ctx.fillText ('keys', x, 10+y*4);
    ctx.fillText ('├  UP  : '+ input.key.UP.toString().padStart (5,' '), x, 10+y*5);
    ctx.fillText ('├ DOWN : '+ input.key.DOWN.toString().padStart (5,' '), x, 10+y*6);
    ctx.fillText ('├ LEFT : '+ input.key.LEFT.toString().padStart (5,' '), x, 10+y*7);
    ctx.fillText ('└RIGHT : '+ input.key.RIGHT.toString().padStart (5,' '), x, 10+y*8);

    ctx.fillText ('buttons', x, 20+y*9);
    ctx.fillText ('├  D   : '+ input.button.D.toString().padStart (5,' '), x, 20+y*10);
    ctx.fillText ('├  X   : '+ input.button.X.toString().padStart (5,' '), x, 20+y*11);
    ctx.fillText ('├  S   : '+ input.button.S.toString().padStart (5,' '), x, 20+y*12);
    ctx.fillText ('├  C   : '+ input.button.C.toString().padStart (5,' '), x, 20+y*13);
    ctx.fillText ('└START : '+ input.button.START.toString().padStart (5,' '), x, 20+y*14);
}

function camDebug (x,y,align = textAlign.LEFT) {
    ctx.fillStyle = "#fff";
    ctx.font = '32px VT323'
    ctx.textAlign = align;
    ctx.fillText ('cam', x, y);
    ctx.fillText ('├ x : '+ cam.X.toString().padStart (6,' '), x, y*2);
    ctx.fillText ('├ y : '+ cam.Y.toString().padStart (6,' '), x, y*3);
    ctx.fillText ('└ z : '+ cam.Z.toString().padStart (6,' '), x, y*4);
}

function debug () {
    camDebug (canvas.width - 200, 30,);
    joystickDebug (20,30);
}

let mira = new Image ();
mira.src = 'res/sprites/mira.png';

const game = {
    running : true,
    frame   : 0,
    debug   : false,
}

const player = new Player (canvas);

function render () {
    game.frame = requestAnimationFrame (render);
    ctx.clearRect (0, 0, canvas.width, canvas.height);

    const grad=ctx.createLinearGradient(0,0,0,canvas.height/1.2);
    grad.addColorStop(0, "darkblue");
    grad.addColorStop(1, "purple");

    // Fill rectangle with gradient
    ctx.fillStyle = grad;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    input.handler ();
    scene.update (canvas, cam, player);

    shots.update (scene, cam, ctx);

    ctx.drawImage (mira, canvas.width/2 - mira.width / 2, canvas.height/2 - mira.height / 2, mira.width, mira.height);

    // ctx.save ();
    // if (cam.Y <= 800) {
    //     ctx.shadowColor = 'rgba(0,0,0,0.4)';
    //     ctx.shadowBlur = (cam.Y - 535) / 15;
    //     ctx.shadowOffsetX = cam.X / 50;
    //     ctx.shadowOffsetY = cam.Y - 535 ;
    // }
    // ctx.restore ();
    player.draw (input.axis);

    if (game.debug)  debug ();
}
render ();
