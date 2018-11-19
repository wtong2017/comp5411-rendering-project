window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Key = {
  _pressed: {},

  A: 65,
  W: 87,
  D: 68,
  S: 83,
  Q: 81,
  E: 69,
  SPACE: 32,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

function cameraMovement() {
  var turn = 1;
  var speed = .5;
  // up or down
  if (Key.isDown(Key.W)) {
    camera.rotation.x += turn* Math.PI / 180;
  }
  else if (Key.isDown(Key.S)) {
    camera.rotation.x -= turn* Math.PI / 180;
  } 
  // left or right
  if (Key.isDown(Key.A)) {
    camera.rotation.y += turn* Math.PI / 180;
  }
  else if (Key.isDown(Key.D)) {
    camera.rotation.y -= turn* Math.PI / 180;
  }
  // backward or forward
  if (Key.isDown(Key.Q)) {
    
    camera.translateZ(-speed);
  }
  else if (Key.isDown(Key.E)) {
    camera.translateZ(speed);
    
  }
}