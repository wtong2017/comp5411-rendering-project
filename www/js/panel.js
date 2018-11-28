// Create GUI using library
var gui = new dat.GUI({name: 'Control Panel'});

// Object
var objectPanel = gui.addFolder('Object Panel');
// Add object
var addObj = objectPanel.addFolder('Add basic object');
var addObjController = {
    "Add cube": addCube,
    "Add sphere": addSphere,
}
addObj.add(addObjController, "Add cube");
addObj.add(addObjController, "Add sphere");
// Selected object
var selectedObjPanel = objectPanel.addFolder('Selected Object Panel');
var selectedObjController = {
    Color: '#ffffff', // CSS string
    Rotation: 0, // in degree
    Delete: deleteObj,
}
function deleteObj() {
    if (selectedObject) {
        var toBeDeleted = selectedObject;
        var index = dragableObjects.findIndex(x => x == selectedObject);
        if (index != undefined)
            dragableObjects.splice( index, 1 );
        selectedObject = null;
        message.textContent = noSelectMessage;
        scene.remove(toBeDeleted);
    }
}
selectedObjPanel.addColor(selectedObjController, 'Color').onChange((value) => {
    var colorValue = value.replace( '#','0x' );
    if (selectedObject) {
        selectedObject.traverse( function ( child ) {
            if (child instanceof THREE.Mesh && child.name!='container') {
                child.material.color.set( parseInt(colorValue, 16) );
            }
        } );
    }
});
selectedObjPanel.add(selectedObjController, 'Rotation', -90, 90, 1).onChange((value) => {
    if (selectedObject) {
        selectedObject.rotation.y = value * Math.PI/180;
        selectedObject.__dirtyRotation = true;
    }
});
selectedObjPanel.add(selectedObjController, 'Delete')

// Light
var lightPanel = gui.addFolder('Light Panel');
var lightSources = lightPanel.addFolder('Light Sources');
function updateLightPanel() {
    var newId = lights.length-1;

    var label = lights[newId].name ? lights[newId].name : 'Light'+newId;
    var guiObj = {intensity: 1}

    var oneLightPanel = lightSources.addFolder(label);
    oneLightPanel.add(guiObj, 'intensity', 0, 1, 0.01).onChange((value) => {
        // console.log(value);

        lights[newId].intensity = value;
    });
}
var shadow = lightPanel.addFolder('Shadow');
var shadowContorl = {"Map power": 7}
shadow.add(shadowContorl, 'Map power', 6, 11, 1).onChange((value) => {
    shadowMap = Math.pow(2, value);
    updateShadowMap();
});
// Debug
var helpers = [];
lightPanel.add({"Helper": false}, 'Helper').onChange((value) => {
    helpers.forEach(helper => {
        helper.visible = value;        
    });
});