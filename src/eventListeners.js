document.addEventListener ('keydown', input.kbListener);
document.addEventListener ('keyup', input.kbListener);

document.addEventListener ('touchstart', input.touchListener, {'passive' : false})
document.addEventListener ('touchend',   input.touchListener)
