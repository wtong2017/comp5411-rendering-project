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

var deleteButton = document.getElementById("delete");
deleteButton.addEventListener("click", (e) => {
    var toBeDeleted = selectedObject;
    var index = dragableObjects.findIndex(x => x == selectedObject);
    if (index != undefined)
        dragableObjects.splice( index, 1 );
    selectedObject = null;
    scene.remove(toBeDeleted);
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
            addSphere();
            break;
        default:
            break;
    }
});

// Light panel
var lightPanel = document.getElementById("lights");
var shadowMapPower = document.getElementById("shadowMapPower");
shadowMapPower.addEventListener('change', function(e) {
    shadowMap = Math.pow(2, this.value);
    updateShadowMap();
});
function updateLightPanel() {
    var newId = lights.length-1;

    newChild = '<label for=light"'+newId+'">Light '+newId+'</label><input type="range" id="light'+newId+'" name="light'+newId+'" min="0" max="1" value="1" step="0.01"><br>'
    lightPanel.insertAdjacentHTML('beforeend', newChild);

    document.addEventListener('change',function(e){
        if(e.target && e.target.id == 'light'+newId){
            lights[newId].intensity = e.target.value;
        }
    });
}

// For debug
var debugCheckbox = document.getElementById("debug");
var helpers = []; // An array to keep all helper for debug

debugCheckbox.addEventListener( 'change',  ( e ) => {

    e.preventDefault();
    
    helpers.forEach(helper => {
        helper.visible = !helper.visible;        
    });

}, false  );