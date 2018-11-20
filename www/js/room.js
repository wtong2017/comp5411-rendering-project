class Window {
    constructor(width, height, position) {
        this.height = height;
        this.width = width;
        this.pos = position;
    }
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

function buildWall(width, height, thickness, pos, rot, color, windows) {
    var wall = buildFloor(width, height, thickness, [0, 0, 0], [0, 0, 0], color);
    var wallCsg = THREE.CSG.fromMesh(wall);

    // Subtract window
    for (let i = 0; i < windows.length; i++) {
        var window = buildFloor(windows[i].width, windows[i].height, thickness, [0, 0, 0], [0, 0, 0], color);
        window.position.set( windows[i].pos[0], windows[i].pos[1], windows[i].pos[2] );
        
        var windowCsg = THREE.CSG.fromMesh(window);
        wallCsg = wallCsg.subtract(windowCsg);
    }

    var resultMesh = THREE.CSG.toPhysiMesh(wallCsg, wall.material, 0)
    resultMesh.rotation.set( rot[0], rot[1], rot[2] );
    resultMesh.position.set( pos[0], pos[1], pos[2] );
    return resultMesh;
}

function buildRoom(scene, floorWidth, floorHeight, wallHeight, thickness) {
    // Floor 
    var bottom = buildFloor(floorWidth, floorHeight, thickness, [0, -(wallHeight + thickness)/2, 0], [0, 0, 0], 0x000000);
  
    // Cover
    var top = buildFloor(floorWidth, floorHeight, thickness, [0, (wallHeight + thickness)/2, 0], [0, 0, 0], 0x000000);
  
    // Walls
    var doorHeight = 15
    var frontDoors = [new Window(10, doorHeight, [0, 0, -(wallHeight-doorHeight)/2])]; // NOTE: Since the floor is originally horizontal, we need to modify the z axis for the position of height
    frontDoors.push(new Window(10, 10, [-20, 0, 0])); // Add a window
    frontDoors.push(new Window(10, 10, [20, 0, 0])); // Add a window
    var front = buildWall(floorWidth, wallHeight, thickness, [0, 0, (floorHeight + thickness)/2], [-Math.PI / 2, 0, 0], 0xffffff, frontDoors);
    var backWindows = [];
    var numOfWindow = 2;
    for (let i = 0; i < numOfWindow; i++) {
        var windowPos = [0, 0, 0];
        windowPos[0] = 0 - floorWidth/2 + floorWidth/(numOfWindow+1)*(i+1);
        backWindows.push(new Window(10, 10, windowPos));
    }
    var back = buildWall(floorWidth, wallHeight, thickness, [0, 0, -(floorHeight + thickness)/2], [Math.PI / 2, 0, 0], 0xffffff, backWindows);
    var right = buildWall(wallHeight, floorHeight, thickness, [(floorWidth + thickness)/2, 0, 0], [0, 0, Math.PI / 2], 0xffffff, [new Window(10, 10, [0,0,0])]);
    var left = buildWall(wallHeight, floorHeight, thickness, [-(floorWidth + thickness)/2, 0, 0], [0, 0, Math.PI / 2], 0xffffff, [new Window(10, 10, [0,0,0])]);
  
    scene.add( bottom );
    scene.add( top );
    scene.add( front );
    scene.add( back );
    scene.add( right );
    scene.add( left );
    return [bottom, top, front, back, right, left]
}