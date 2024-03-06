const input = {
    key : {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false,

        PAGE_UP: false,
        PAGE_DW: false,
    },

    listener : e => {
        let state = (e.type === 'keydown');
        switch (e.key) {
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

            case 'PageUp' :
                input.key.PAGE_UP = state;
                break;
            case 'PageDown' :
                input.key.PAGE_DW = state;
                break;
        }
    },

    handler : null,
};
