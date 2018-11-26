// For selecting object color
var colorpicker = document.getElementById("color");
colorpicker.addEventListener( 'change',  ( e ) => {

    e.preventDefault();
    
    if (selectedObject)
        selectedObject.material.color.set( event.target.value );

}, false  );


// For debug
var debugCheckbox = document.getElementById("debug");
var helpers = []; // An array to keep all helper for debug

debugCheckbox.addEventListener( 'change',  ( e ) => {

    e.preventDefault();
    
    helpers.forEach(helper => {
        helper.visible = !helper.visible;        
    });

}, false  );