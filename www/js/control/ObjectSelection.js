var mouse = new THREE.Vector2();

// Set up a raycaster
var raycaster = new THREE.Raycaster();
var originalColor = null;
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
				if (selectedObject != null) {
					console.log(selectedObject)
					console.log(originalColor);
					selectedObject.material.color.set( originalColor ); // Unselect the selected object
				}
				selectedObject = intersects[0].object;
				message.textContent = selectMessage + selectedObject.name;
				// Save the color
				originalColor = selectedObject.material.color.getHex();
				selectedObject.material.color.set( 0xff0000 ); // First intersect object
			}
			// for ( var i = 0; i < intersects.length; i++ ) {
			//   intersects[ i ].object.material.color.set( 0xff0000 );
			// }  
			break;
		case 1: // middle
			break;
		case 2: // right
			// Unselect the selected object
			selectedObject.material.color.set( originalColor ); // Unselect the selected object
			selectedObject = null;
			message.textContent = noSelectMessage;
			break;
	}
}

// function onMouseMove( event ) {
// 	// calculate mouse position in normalized device coordinates
// 	// (-1 to +1) for both components

// 	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
// }

window.addEventListener( 'mousedown', onMouseDown, false );
// window.addEventListener( 'mousemove', onMouseMove, false );