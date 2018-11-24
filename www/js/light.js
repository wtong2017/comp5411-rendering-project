function createDirectionalLight(pos, needHelper) {
    // Sun
    // create directional light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.castShadow = true;
    directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 1024*2;
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
        scene.add( helper );
    }
    return directionalLight;
}

function createPointLight(pos, intensity, needHelper) {
    // create a point light
    var pointLight = new THREE.PointLight(0xF8D898);
    pointLight.intensity = intensity;
    pointLight.distance = 100;
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;  // default: 512; higher better
    pointLight.shadow.mapSize.height = 1024; // default: 512; higher better
    pointLight.position.set(pos[0], pos[1], pos[2]);

    if (needHelper) {
        var helper = new THREE.CameraHelper( pointLight.shadow.camera );
        scene.add( helper );
    }
    return pointLight;
}