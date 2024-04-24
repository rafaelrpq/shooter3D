const canvas = document.querySelector ('canvas');
const ctx    = canvas.getContext ('2d');

canvas.width  = 1024;
canvas.height = 576;

ctx.imageSmoothingEnabled = false;

let height = 1536;
const cam = {
    X : 0,
    Y : height,
    Z : 0,
    D : 1,
};

const scene = new Scenario ({});

for (let i=0; i < scene.total; i++) {
    let line = new Line ();
    line.z = i * 256;

    if (i%8 === 0) {
        let obj = new Object3D ({
            pos : {
                x: Math.random () * scene.width * 2  - scene.width,
                y: 8 * 220,
                z: i * 256,
            },
            width : 120,
            height: 220,

            imgSrc: 'res/pedra2.png'

        })

        line.sprite.push (obj)
    }

    line.sprite.push (
        new Object3D ({
            pos : {
                x: Math.random () * 8192 * 12 - 8192 * 4,
                y: Math.random () * 8192 * 2 + 2048,
                z: (i+scene.limit) * 256,
            },
            width : 16,
            height: 16,
            color : `white`,
        })
    )

    scene.lines.push (line);
}

function pause () {
    if (game.running) {
        cancelAnimationFrame (game.frame);
        let msg = "= EM PAUSA =";
        ctx.font = 'bold 32px Roboto Mono'
        ctx.fillStyle = 'black'
        ctx.textAlign = textAlign.CENTER;
        ctx.fillText (msg, (canvas.width/2) + 4, (canvas.height/2) + 4);
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

    if (input.key.DOWN) {
        cam.Y = (cam.Y < limits.TOP) ? cam.Y + vel : limits.TOP;
    } else if (input.key.UP) {
        cam.Y = (cam.Y > limits.BOTTOM) ? cam.Y - vel : limits.BOTTOM;
    } else {
        cam.Y+=0;
    }

    if (input.key.LEFT) {
        cam.X = (cam.X > limits.LEFT) ? cam.X - vel : limits.LEFT;
    } else if (input.key.RIGHT) {
        cam.X = (cam.X < limits.RIGHT) ? cam.X + vel : limits.RIGHT;
    } else {
        cam.X+=0;
    }

    if (cam.Y < limits.TOP){
        cam.Y += 32 * input.axis.y;
    } else {
        cam.Y = limits.TOP
    }

    if (cam.Y > limits.BOTTOM){
        cam.Y +=  32 * input.axis.y;
    } else {
        cam.Y = limits.BOTTOM
    }

    if (cam.X < limits.RIGHT){
        cam.X +=  32 * input.axis.x;
    } else {
        cam.X = limits.RIGHT
    }

    if (cam.X > limits.LEFT){
        cam.X +=  32 * input.axis.x;
    } else {
        cam.X = limits.LEFT
    }


    if (input.button.S) {
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
    ctx.font = '32px Roboto Mono'
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
    ctx.fillText ('├   D  : '+ input.button.D.toString().padStart (5,' '), x, 20+y*10);
    ctx.fillText ('├   X  : '+ input.button.X.toString().padStart (5,' '), x, 20+y*11);
    ctx.fillText ('├   S  : '+ input.button.S.toString().padStart (5,' '), x, 20+y*12);
    ctx.fillText ('├   C  : '+ input.button.C.toString().padStart (5,' '), x, 20+y*13);
    ctx.fillText ('└START : '+ input.button.START.toString().padStart (5,' '), x, 20+y*14);
}

function camDebug (x,y,align = textAlign.LEFT) {
    ctx.fillStyle = "#fff";
    ctx.font = '32px Roboto Mono'
    ctx.textAlign = align;
    ctx.fillText ('cam', x, y);
    ctx.fillText ('├ x : '+ cam.X.toString().padStart (6,' '), x, y*2);
    ctx.fillText ('├ y : '+ cam.Y.toString().padStart (6,' '), x, y*3);
    ctx.fillText ('└ z : '+ cam.Z.toString().padStart (6,' '), x, y*4);
}

function debug () {
    camDebug (770, 30,);
    joystickDebug (20,30);
}


let img = new Image ();
img.src = 'res/tomcat.png';

let mira = new Image ();
mira.src = 'res/mira.png';

const game = {
    running : true,
    frame : 0,
}

function render () {
    game.frame = requestAnimationFrame (render);
    ctx.clearRect (0, 0, canvas.width, canvas.height);

    input.handler ();
    scene.update (canvas, cam);

    shots.update (scene, cam, ctx);

    ctx.drawImage (mira, canvas.width/2 - mira.width / 2, canvas.height/2 - mira.height / 2, mira.width, mira.height);
    ctx.save ();
    if (cam.Y <= 800) {
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = (cam.Y - 535) / 15;
        ctx.shadowOffsetX = cam.X / 50;
        ctx.shadowOffsetY = cam.Y - 535 ;
    }
    ctx.drawImage (img, canvas.width/2 - img.width * 2, 70 + canvas.height/2 - img.height * 2, img.width*4, img.height*4);
    ctx.restore ();

    debug ();
}

render ();
