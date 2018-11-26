var debugCheckbox = document.getElementById("debug");
var helpers = []; // An array to keep all helper for debug

debugCheckbox.addEventListener( 'change',  ( e ) => {

    e.preventDefault();
    
    helpers.forEach(helper => {
        helper.visible = !helper.visible;        
    });

}, false  );