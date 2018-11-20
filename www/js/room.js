function buildRoom(scene, floorWidth, floorHeight, wallHeight, thickness) {
    // Floor 
    var bottom = new Physijs.BoxMesh(
      new THREE.CubeGeometry( floorWidth, thickness, floorHeight ),
      new THREE.MeshPhongMaterial({ color: 0x000000 }),
      0
    );
  
    // Cover
    var top = new Physijs.BoxMesh(
      new THREE.CubeGeometry( floorWidth, thickness, floorHeight ),
      new THREE.MeshPhongMaterial({ color: 0x000000 }),
      0
    ); 
  
    // Walls
    var front = new Physijs.BoxMesh(
      new THREE.CubeGeometry( floorWidth, thickness, wallHeight ),
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
      0
    );
    var back = new Physijs.BoxMesh(
      new THREE.CubeGeometry( floorWidth, thickness, wallHeight ),
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
      0
    );
    var right = new Physijs.BoxMesh(
      new THREE.CubeGeometry( wallHeight, thickness, floorHeight ),
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
      0
    );
    var left = new Physijs.BoxMesh(
      new THREE.CubeGeometry( wallHeight, thickness, floorHeight ),
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
      0
    );
    front.rotation.x += Math.PI/2;
    back.rotation.x += Math.PI/2;
    right.rotation.z += Math.PI/2;
    left.rotation.z += Math.PI/2;
    
    bottom.position.y -= (wallHeight + thickness)/2;
    top.position.y += (wallHeight + thickness)/2;
    front.position.z += (floorHeight + thickness)/2;
    back.position.z -= (floorHeight + thickness)/2;
    right.position.x += (floorWidth + thickness)/2;
    left.position.x -= (floorWidth + thickness)/2;
  
    scene.add( bottom );
    scene.add( top );
    scene.add( front );
    scene.add( back);
    scene.add( right );
    scene.add( left );
    return [bottom, top, front, back, right, left]
  }