function createDirectionalLight(pos, needHelper) {
    // Sun
    // create directional light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.castShadow = true;
    directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 1024; // 1024*2
    directionalLight.position.set(pos[0], pos[1], pos[2]);
    // control the shadow
    var d = 100;
    directionalLight.shadowCameraLeft = -d;
    directionalLight.shadowCameraRight = d;
    directionalLight.shadowCameraTop = d;
    directionalLight.shadowCameraBottom = -d;
    directionalLight.shadowCameraFar = 2000;
    directionalLight.shadowBias = -0.0001;
    // show the light
    if (needHelper) {
        var helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        helper.visible = false;
        helpers.push(helper);
        scene.add( helper );
    }
    return directionalLight;
}

function createPointLight(pos, intensity, distance, needHelper) {
    // create a point light
    var pointLight = new THREE.PointLight(0xF8D898);
    pointLight.intensity = intensity;
    pointLight.distance = distance;
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;  // default: 512; higher better
    pointLight.shadow.mapSize.height = 1024; // default: 512; higher better
    pointLight.position.set(pos[0], pos[1], pos[2]);
    

    // add light model
    obj_loader = new THREE.OBJLoader();
    obj_loader.load(
        // resource URL
        'objs/Dani.obj',
        // called when resource is loaded
        function ( object ) {
            finishedCount++;
            updateProgress();

            object.scale.set(.005, .005, .005);
            object.position.set(pos[0], pos[1] + 0.4, pos[2]);

            object.traverse( function ( child ) { // Solve shadow problem: https://stackoverflow.com/questions/15906248/three-js-objloader-obj-model-not-casting-shadows
            if ( child instanceof THREE.Mesh ) {
                child.material = new THREE.MeshPhongMaterial({ color: 0x404040 });
                // child.castShadow = true;
                // child.receiveShadow = true;

            }
            } );
            scene.add( object );
        },
        // called when loading is in progresses
        function ( xhr ) {
    
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        }
    );



    if (needHelper) {
        var helper = new THREE.CameraHelper( pointLight.shadow.camera );
        helper.visible = false;
        helpers.push(helper);
        scene.add( helper );
    }
    return pointLight;
}