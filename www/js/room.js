function buildRoom(scene, floorWidth, floorHeight, wallHeight, thickness) {
    // Floor 
    var bottom = buildFloor(floorWidth, floorHeight, thickness, [0, -(wallHeight + thickness)/2, 0], [0, 0, 0], 0x000000);
  
    // Cover
    var top = buildFloor(floorWidth, floorHeight, thickness, [0, (wallHeight + thickness)/2, 0], [0, 0, 0], 0x000000);
  
    // Walls
    var front = buildFloor(floorWidth, wallHeight, thickness, [0, 0, (floorHeight + thickness)/2], [Math.PI / 2, 0, 0], 0xffffff);
    var back = buildFloor(floorWidth, wallHeight, thickness, [0, 0, -(floorHeight + thickness)/2], [Math.PI / 2, 0, 0], 0xffffff);
    var right = buildFloor(wallHeight, floorHeight, thickness, [(floorWidth + thickness)/2, 0, 0], [0, 0, Math.PI / 2], 0xffffff);
    var left = buildFloor(wallHeight, floorHeight, thickness, [-(floorWidth + thickness)/2, 0, 0], [0, 0, Math.PI / 2], 0xffffff);
  
    scene.add( bottom );
    scene.add( top );
    scene.add( front );
    scene.add( back );
    scene.add( right );
    scene.add( left );
    return [bottom, top, front, back, right, left]
}

function buildFloor(width, height, thickness, pos, rot, color) {
    var floor = new Physijs.BoxMesh(
        new THREE.CubeGeometry( width, thickness, height ),
        new THREE.MeshPhongMaterial({ color: color }),
        0
    );
    floor.rotation.set( rot[0], rot[1], rot[2] );
    floor.position.set( pos[0], pos[1], pos[2] );
    return floor;
}