// For selecting object color
var colorpicker = document.getElementById("color");
colorpicker.addEventListener( 'change',  ( e ) => {

    e.preventDefault();
    
    if (selectedObject)
        selectedObject.material.color.set( event.target.value );

}, false  );

// For adding new objects
var newObj = document.getElementById('newObj');
var addButton = document.getElementById('add');
addButton.addEventListener("click", (e)=>{
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