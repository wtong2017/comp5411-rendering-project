var mouse = new THREE.Vector2();

// Set up a raycaster
var raycaster = new THREE.Raycaster();
// var originalColor = null;
var selectedObject = null;
var message = document.getElementById('message');
var selectMessage = 'You are picking object ';
var noSelectMessage = 'Nothing'

function onMouseDown( event ) {
	switch ( event.button ) {
		case 0: // left
			// update the picking ray with the camera and mouse position
			raycaster.setFromCamera( mouse, camera );
			// calculate objects intersecting the picking ray
			var intersects = raycaster.intersectObjects( scene.children, true ); // Allow recursion
			if (intersects.length > 0) {
				for (let i = 0; i < intersects.length; i++) {
					var object = intersects[i].object;
					if (object.name != 'container') {
						selectedObject = object;
						message.textContent = selectMessage + selectedObject.name;
						break;
					}
				}
			}
			break;
		case 1: // middle
			break;
		case 2: // right
			// Unselect the selected object
			if (selectedObject) {
				selectedObject = null;
			}
			message.textContent = noSelectMessage;
			break;
	}
}

window.addEventListener( 'mousedown', onMouseDown, false );
// window.addEventListener( 'mousemove', onMouseMove, false );