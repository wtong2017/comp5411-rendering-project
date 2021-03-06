class Window {
    constructor(width, height, thickness, position) {
        this.height = height;
        this.width = width;
        this.thickness = thickness
        this.pos = position;
        this.mesh = null
    }
    createMesh(material) {
        var mesh = new Physijs.BoxMesh(
            new THREE.CubeGeometry( this.width, this.thickness, this.height),
            material,
            0
        );
        this.mesh = mesh;
    }
    getMesh() {
        if (this.mesh == null)
            return null;
        return this.mesh;
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
    var allMesh = [];

    var wall = buildFloor(width, height, thickness, [0, 0, 0], [0, 0, 0], color);
    var wallCsg = THREE.CSG.fromMesh(wall);

    // Subtract window
    for (let i = 0; i < windows.length; i++) {
        var window = buildFloor(windows[i].width, windows[i].height, thickness, [0, 0, 0], [0, 0, 0], color);
        var windowMesh = windows[i].getMesh();
        if (windowMesh) {
            windowMesh.position.set( windows[i].pos[0], windows[i].pos[1], windows[i].pos[2] );
            allMesh.push(windowMesh);
        }
        window.position.set( windows[i].pos[0], windows[i].pos[1], windows[i].pos[2] );
        
        var windowCsg = THREE.CSG.fromMesh(window);
        wallCsg = wallCsg.subtract(windowCsg);
    }

    var resultMesh = THREE.CSG.toPhysiMesh(wallCsg, wall.material, 0)
    // allMesh.push(resultMesh);
    // allMesh.forEach(element => {
    //     element.rotation.set( rot[0], rot[1], rot[2] );
    //     element.position.set( pos[0], pos[1], pos[2] );
    // });
    windows.forEach(element => {
        windowMesh = element.getMesh()
        if (windowMesh)
            resultMesh.add(windowMesh);
    });

    resultMesh.rotation.set( rot[0], rot[1], rot[2] );
    resultMesh.position.set( pos[0], pos[1], pos[2] );
    // return allMesh;
    return resultMesh;
}

function buildRoom(scene, floorWidth, floorHeight, wallHeight, thickness, pos) {
    // Floor 
    var bottom = buildFloor(floorWidth, floorHeight, thickness, pos, [0, 0, 0], 0xffffff);
  
    // Cover
    var top = buildFloor(floorWidth, floorHeight, thickness, [pos[0], pos[1] + wallHeight + thickness, pos[2]], [0, 0, 0], 0xffffff);
  
    // Walls
    var doorHeight = 15
    var doorSpotLight = createSpotLight([pos[0], pos[1] + (wallHeight + thickness + doorHeight)/2, pos[2]+(floorHeight - thickness)/2 + 2], 1, 50, true); // hardcode 2 as the width of the light object
    scene.add(doorSpotLight);
    var frontDoors = [new Window(10, doorHeight, thickness, [0, 0, -(wallHeight-doorHeight)/2])]; // NOTE: Since the floor is originally horizontal, we need to modify the z axis for the position of height
    var window = new Window(10, 10, thickness/4, [-20, 0, 0]);
    window.createMesh(new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3}))
    frontDoors.push(window); // Add a window
    window = new Window(10, 10, thickness/4, [20, 0, 0]);
    window.createMesh(new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3}))
    frontDoors.push(window); // Add a window
    var front = buildWall(floorWidth, wallHeight, thickness, [pos[0], pos[1] + (wallHeight + thickness)/2, pos[2]+(floorHeight - thickness)/2], [-Math.PI / 2, 0, 0], 0xffffff, frontDoors);
    window = new Window(10, 10, thickness/4, [-floorWidth/2 + floorWidth/3, 0, 0]);
    window.createMesh(new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3}))
    var backWindows = [window];
    backWindows.push(new Window(10, doorHeight, thickness, [pos[0]+(floorWidth-50)/2, 0, (wallHeight-doorHeight)/2])) // add a door
    // var numOfWindow = 2;
    // for (let i = 0; i < numOfWindow; i++) {
    //     var windowPos = [0, 0, 0];
    //     windowPos[0] = 0 - floorWidth/2 + floorWidth/(numOfWindow+1)*(i+1);
    //     var window = new Window(10, 10, thickness/4, windowPos);
    //     window.createMesh(new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3}))
    //     backWindows.push(window);
    // }
    var back = buildWall(floorWidth, wallHeight, thickness, [pos[0], pos[1] + (wallHeight + thickness)/2, pos[2]-(floorHeight - thickness)/2], [Math.PI / 2, 0, 0], 0xffffff, backWindows);
    window = new Window(10, 10, thickness/4, [0, 0, 0]);
    window.createMesh(new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3}))
    var right = buildWall(wallHeight, floorHeight-thickness*2, thickness, [pos[0]+(floorWidth - thickness)/2, pos[1]+ (wallHeight + thickness)/2, pos[2]], [0, 0, Math.PI / 2], 0xffffff, [window]);
    window = new Window(10, 10, thickness/4, [0, 0, 0]);
    window.createMesh(new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3}))
    var left = buildWall(wallHeight, floorHeight-thickness*2, thickness, [pos[0]-(floorWidth - thickness)/2, pos[1]+ (wallHeight + thickness)/2, pos[2]], [0, 0, Math.PI / 2], 0xffffff, [window]);
  
    bottom.receiveShadow = true;
    bottom.castShadow = true; 
    top.receiveShadow = true;
    top.castShadow = true; 
    front.receiveShadow = true;
    front.castShadow = true; 
    back.receiveShadow = true;
    back.castShadow = true; 
    right.receiveShadow = true;
    right.castShadow = true; 
    left.receiveShadow = true;
    left.castShadow = true; 

    bottom.name = 'bottom';
    top.name = 'top';
    front.name = 'front';
    back.name = 'back';
    right.name = 'right';
    left.name = 'left';

    // TODO: merge all components together, otherwise the light will appear between walls
    resultComponents = [bottom, top, front, back, right, left];
    
    smallRoomComponents = buildSmallRoom(50, 50, wallHeight, thickness, [pos[0]+(floorWidth-50)/2,pos[1],pos[2]-(floorHeight+50)/2]);
    smallRoomComponents.forEach(component => {
        resultComponents.push(component)
    });

    
    var lightBulb = createPointLight([pos[0]+20, wallHeight+pos[1]+thickness/2, pos[2]], 1, 50, true);
    scene.add(lightBulb);
    var lightBulb2 = createPointLight([pos[0]-20, wallHeight+pos[1]+thickness/2, pos[2]], 1, 50, true);
    scene.add(lightBulb2);
    var lightBulb3 = createPointLight([pos[0], wallHeight+pos[1]+thickness/2, pos[2]+20], 1, 50, true);
    scene.add(lightBulb3);
    var lightBulb4 = createPointLight([pos[0], wallHeight+pos[1]+thickness/2, pos[2]-20], 1, 50, true);
    scene.add(lightBulb4);

    return resultComponents;
}


function buildSmallRoom(floorWidth, floorHeight, wallHeight, thickness, pos) {
    // Floor 
    var bottom = buildFloor(floorWidth, floorHeight, thickness, pos, [0, 0, 0], 0xffffff);
  
    // Cover
    var top = buildFloor(floorWidth, floorHeight, thickness, [pos[0], pos[1] + wallHeight + thickness, pos[2]], [0, 0, 0], 0xffffff);
  
    // Walls
    var doorHeight = 15
    var frontDoors = [new Window(10, doorHeight, thickness, [0, 0, -(wallHeight-doorHeight)/2])]; // NOTE: Since the floor is originally horizontal, we need to modify the z axis for the position of height
    var front = buildWall(floorWidth, wallHeight, thickness, [pos[0], pos[1] + (wallHeight + thickness)/2, pos[2]+(floorHeight - thickness)/2], [-Math.PI / 2, 0, 0], 0xffffff, frontDoors);
    var backWindows = [];
    var numOfWindow = 1;
    for (let i = 0; i < numOfWindow; i++) {
        var windowPos = [0, 0, 0];
        windowPos[0] = 0 - floorWidth/2 + floorWidth/(numOfWindow+1)*(i+1);
        var window = new Window(10, 10, thickness/4, windowPos);
        window.createMesh(new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3}));
        backWindows.push(window);
    }
    var back = buildWall(floorWidth, wallHeight, thickness, [pos[0], pos[1] + (wallHeight + thickness)/2, pos[2]-(floorHeight - thickness)/2], [Math.PI / 2, 0, 0], 0xffffff, backWindows);
    var window = new Window(10, 10, thickness/4, [0, 0, 0]);
    window.createMesh(new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3}))
    var right = buildWall(wallHeight, floorHeight-thickness*2, thickness, [pos[0]+(floorWidth - thickness)/2, pos[1]+ (wallHeight + thickness)/2, pos[2]], [0, 0, Math.PI / 2], 0xffffff, [window]);
    window = new Window(10, 10, thickness/4, [0, 0, 0]);
    window.createMesh(new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3}))
    var left = buildWall(wallHeight, floorHeight-thickness*2, thickness, [pos[0]-(floorWidth - thickness)/2, pos[1]+ (wallHeight + thickness)/2, pos[2]], [0, 0, Math.PI / 2], 0xffffff, [window]);
  
    bottom.receiveShadow = true;
    bottom.castShadow = true; 
    top.receiveShadow = true;
    top.castShadow = true; 
    front.receiveShadow = true;
    front.castShadow = true; 
    back.receiveShadow = true;
    back.castShadow = true; 
    right.receiveShadow = true;
    right.castShadow = true; 
    left.receiveShadow = true;
    left.castShadow = true;

    var lightBulb = createPointLight([pos[0], wallHeight+pos[1]+thickness/2, pos[2]], 1, 50, true);
    scene.add(lightBulb);

    return [bottom, top, front, back, right, left]
}