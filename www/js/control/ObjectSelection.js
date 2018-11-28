var mouse = new THREE.Vector2();

// Set up a raycaster
var raycaster = new THREE.Raycaster();
// var originalColor = null;
var selectedObject = null;
var picking = false;
var message = document.getElementById('message');
var selectedObjPanel = document.getElementById('selectedObj');
var selectMessage = 'You are picking object ';
var noSelectMessage = 'Nothing';

function onMouseDown( event ) {
	switch ( event.button ) {
		case 0: // left
			picking = true;
			// update the picking ray with the camera and mouse position
			raycaster.setFromCamera( mouse, camera );
			// calculate objects intersecting the picking ray
			// var intersects = raycaster.intersectObjects( scene.children, true ); // Allow recursion
			var intersects = raycaster.intersectObjects( scene.children );
			if (intersects.length > 0) {
				// for (let i = 0; i < intersects.length; i++) {
					var object = intersects[0].object; // First intersect object
					// if (object.name != 'container') {
						selectedObject = object;
						message.textContent = selectMessage + selectedObject.name;
						// selectedObjPanel.style.display = 'block';
						// break;
					// }
				// }
			}
			break;
		case 1: // middle
			break;
		case 2: // right
			// Unselect the selected object
			if (selectedObject) {
				selectedObject = null;
				// selectedObjPanel.style.display = 'none';
			}
			message.textContent = noSelectMessage;
			break;
	}
}

// function onMouseMove( event ) {
// 	if (picking) {
// 		console.log('moving');

// 	}
// }

// function onMouseUp( event ) {
// 	picking = false;
// }

window.addEventListener( 'mousedown', onMouseDown, false );
// window.addEventListener( 'mousemove', onMouseMove, false );
// window.addEventListener( 'mouseup', onMouseUp, false );