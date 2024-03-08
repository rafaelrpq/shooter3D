const input = {
    key : {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false,

        PAGE_UP: false,
        PAGE_DW: false,
    },

    kbListener : (e) => {
        let state = (e.type === 'keydown')
        input.inputParser (e.key, state)
    },

    touchListener : (e) => {
        navigator.vibrate (10)
        e.preventDefault();

        let state = e.type === 'touchstart';
        let button = null;

        if (e.target.tagName.toLowerCase() === 'button') {
            button = e.target;
            input.inputParser (button.getAttribute ('data-value'), state)
        }
    },

    inputParser : (handle, state) => {
        switch (handle) {
            case 'ArrowUp' :
                input.key.UP = state
                break;
            case 'ArrowDown' :
                input.key.DOWN = state
                break;
            case 'ArrowLeft' :
                input.key.LEFT = state
                break;
            case 'ArrowRight' :
                input.key.RIGHT = state
                break;

            case 'x' :
                input.key.BTN_X = state
                break;
            case 'c' :
                input.key.BTN_C = state
                break;
            case 's' :
                input.key.BTN_S = state
                break;
            case 'd' :
                input.key.BTN_D = state
                break;

            case 'Enter' :
                input.key.ENTER = state
                break;
        }
    },

    handler : null,
};
