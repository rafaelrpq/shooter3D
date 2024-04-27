const input = {
    key : {
        UP    : false,
        DOWN  : false,
        LEFT  : false,
        RIGHT : false,
    },

    axis : {
        x : 0,
        y : 0,
    },

    button : {
        D: false,
        X: false,
        S: false,
        C: false,
        START: false,
    },

   listener : (e) => {
        let state = (e.type === 'keydown' || e.type === 'touchstart');

        input.parser (e.code, state);
        input.parser (e.target.getAttribute('key'), state);
    },

    parser : (handler, state) => {
        switch (handler) {
            case 'ArrowUp' :
                input.key.UP = state;
                break;
            case 'ArrowDown' :
                input.key.DOWN = state;
                break;
            case 'ArrowLeft' :
                input.key.LEFT = state;
                break;
            case 'ArrowRight' :
                input.key.RIGHT = state;
                break;
            case 'KeyD' :
                input.button.D = state;
                break;
            case 'KeyX' :
                input.button.X = state;
                break;
            case 'KeyS' :
                input.button.S = state;
                break;
            case 'KeyC' :
                input.button.C = state;
                break;
            case 'Enter' :
                input.button.START = state;
                break;
        }
    },

    handler : null,
}

const joystick = document.querySelector ('#joystick');
joystick.addEventListener ('touchstart', e => {

    const touch = e.targetTouches[0];
    const circle = document.querySelector ('#analog.circle');

    let initialX = Math.round (touch.pageX);
    let initialY = Math.round (touch.pageY);

    joystick.addEventListener ('touchmove', e => {
        const drag = e.targetTouches[0];
        input.axis.x = Math.round (drag.pageX) - initialX;
        input.axis.y = -(Math.round (drag.pageY) - initialY);

            input.axis.x = (input.axis.x > 32) ? 32 : input.axis.x;
            input.axis.x = (input.axis.x < -32) ? -32 : input.axis.x;
            input.axis.y = (input.axis.y > 32) ? 32 : input.axis.y;
            input.axis.y = (input.axis.y < -32) ? -32 : input.axis.y;

        // console.log (input.axis.x, input.axis.y);

        joystick.style.transform = `translate3d(${input.axis.x}px, ${-input.axis.y}px, 0)`;

        input.axis.x /=32;
        input.axis.y /=32;
    }, {'passive': false});
}, {'passive': false});

joystick.addEventListener ('touchend', e => {
    input.axis.x = 0;
    input.axis.y = 0;
    joystick.style.transform = `translate3d(0, 0, 0)`;
}, {'passive': false});

const buttons = document.querySelectorAll ('button');
buttons.forEach (button => {
    button.addEventListener ('contextmenu', e => {
        e.preventDefault ();
        e.stopPropagation()
        e.stopImmediatePropagation();
    });

    // button.addEventListener ('touchstart', e => {
    //     e.preventDefault ();
    //     // e.stopPropagation()
    //     // e.stopImmediatePropagation();
    // });
})

document.addEventListener ('keydown', input.listener, {passive: false});
document.addEventListener ('keyup', input.listener, {passive: false});
document.addEventListener ('touchstart', input.listener, {passive: false});
document.addEventListener ('touchend', input.listener, {passive: false});

document.querySelector ('[key=Enter]').addEventListener ('touchstart', (e) => {
    pause ()
}, {'passive' : true});

document.addEventListener ('keydown', e => {
    if (e.key === 'Enter') pause ();
}, {'passive' : false});


document.querySelector ('#off').addEventListener ('touchstart', e => {
    let dialog = document.createElement ('dialog');
    document.body.appendChild (dialog);
    dialog.innerHTML = '<span><p>Deseja encerrar o programa?</p> Seus progresso atual não será salvo.</span>';
    let confirm = document.createElement ('button');
    let cancel  = document.createElement ('button');

    confirm.innerHTML = "Encerrar";
    cancel.innerHTML = "Cancelar";
    
    confirm.addEventListener('touchstart', () => {
        window.close ();
    })
    cancel.addEventListener('touchstart', () => {
        dialog.close ();
        dialog.remove ();
    })

    dialog.appendChild (cancel)
    dialog.appendChild (confirm)
    
    if (game.running) pause ();
    dialog.showModal ();

}, {'passive':true})
