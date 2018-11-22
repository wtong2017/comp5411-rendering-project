var mouse = new THREE.Vector2();

// Set up a raycaster
var raycaster = new THREE.Raycaster();

function onMouseDown( event ) {
	switch ( event.button ) {
		case 0: // left
			// update the picking ray with the camera and mouse position
			raycaster.setFromCamera( mouse, camera );
			// calculate objects intersecting the picking ray
			var intersects = raycaster.intersectObjects( scene.children );
			intersects[0].object.material.color.set( 0xff0000 ); // First intersect object
			// for ( var i = 0; i < intersects.length; i++ ) {
			//   intersects[ i ].object.material.color.set( 0xff0000 );
			// }  
			break;
		case 1: // middle
			break;
		case 2: // right
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