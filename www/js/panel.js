// For selecting object
// Color
var colorpicker = document.getElementById("color");
colorpicker.addEventListener( 'change',  ( e ) => {
    selectedObject.traverse( function ( child ) {
        if (child instanceof THREE.Mesh && child.name!='container') {
            child.material.color.set( event.target.value );
        }
    } );
}, false  );
// Rotation
var turnLeftButton = document.getElementById("turnLeft");
var turnRightButton = document.getElementById("turnRight");
turnLeftButton.addEventListener("click", (e) => {
    selectedObject.rotation.y -= Math.PI/180;
    selectedObject.__dirtyRotation = true;
});
turnRightButton.addEventListener("click", (e) => {
    selectedObject.rotation.y += Math.PI/180;
    selectedObject.__dirtyRotation = true;
});


// For adding new objects
var newObj = document.getElementById('newObj');
var addButton = document.getElementById('add');
addButton.addEventListener("click", (e) => {
    switch (newObj.value) {
        case 'cube':
            console.log('add cube');
            addCube();
            break;
        case 'sphere':
            console.log('add sphere');
            break;
        default:
            break;
    }
});

// For debug
var debugCheckbox = document.getElementById("debug");
var helpers = []; // An array to keep all helper for debug

debugCheckbox.addEventListener( 'change',  ( e ) => {

    e.preventDefault();
    
    helpers.forEach(helper => {
        helper.visible = !helper.visible;        
    });

}, false  );