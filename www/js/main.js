'use strict';
// configure physijs
Physijs.scripts.worker = '/js/lib/physi/physijs_worker.js';
Physijs.scripts.ammo = '../ammo/ammo.js'; // latest ammo.js is not working, we have to use the ammo.js provided in physijs examples

// set the scene size
var WIDTH = window.innerWidth,
HEIGHT = window.innerHeight;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);
camera.rotation.order = "YXZ"; // Rotation along y-axis will be correct, other will be wrong

var scene = new Physijs.Scene;

scene.background = new THREE.Color(0xbfbfbf);

// add the camera to the scene
scene.add(camera);

// set a default position for the camera
// not doing this somehow messes up shadow rendering
camera.position.z = 10;

// set up the sphere vars
// lower 'segment' and 'ring' values will increase performance
var radius = 5,
segments = 6,
rings = 6;

// create the sphere's material
var sphereMaterial =
new THREE.MeshLambertMaterial(
{
color: 0xD43001
});

// Create a ball with sphere geometry
var ball = new THREE.Mesh(
    new THREE.SphereGeometry(radius,
    segments,
    rings),
    sphereMaterial);

// add the sphere to the scene
scene.add(ball);

// instantiate a loader
var loader = new THREE.OBJLoader();

// load a resource
loader.load(
	// resource URL
	'objs/table.obj',
	// called when resource is loaded
	function ( object ) {
    object.scale.set(.05, .05, .05);
    var bbox = new THREE.Box3().setFromObject(object);
    var x = bbox.max.x-bbox.min.x;
    var y = bbox.max.y-bbox.min.y;
    var z = bbox.max.z-bbox.min.z;
    var box_container = new Physijs.BoxMesh(
        new THREE.CubeGeometry( x, y, z ),
        // new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
        // Uncomment the next line to see the wireframe of the container shape
        new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 })
    );

    box_container.add(object);
    box_container.position.y = 5
    box_container.position.x = 10
    scene.add(box_container);
		// scene.add( object );
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

loader.load(
	// resource URL
	'objs/table.obj',
	// called when resource is loaded
	function ( object ) {
    object.scale.set(.05, .05, .05);
    var bbox = new THREE.Box3().setFromObject(object);
    var x = bbox.max.x-bbox.min.x;
    var y = bbox.max.y-bbox.min.y;
    var z = bbox.max.z-bbox.min.z;
    var box_container = new Physijs.BoxMesh(
        new THREE.CubeGeometry( x, y, z ),
        // new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
        // Uncomment the next line to see the wireframe of the container shape
        new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 })
    );

    box_container.add(object);
    box_container.position.y = 0
    scene.add(box_container);
		// scene.add( object );
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

// // Box
// var box = new Physijs.BoxMesh(
//     new THREE.CubeGeometry( 5, 5, 5 ),
//     new THREE.MeshBasicMaterial({ color: 0x888888 }),
// );
// box.position.y = 5;
// scene.add( box );

// create a point light
var pointLight = new THREE.PointLight(0xF8D898);

// set its position
pointLight.position.x = -20;
pointLight.position.y = 0;
pointLight.position.z = 0;
pointLight.intensity = 1;
pointLight.distance = 100;

// add to the scene
scene.add(pointLight);

// AmbientLight
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add(light);

buildRoom(scene, 100, 30, 10, 1);

function buildRoom(scene, floorWidth, floorHeight, wallHeight, thickness) {
  // Floor 
  var bottom = new Physijs.BoxMesh(
    new THREE.CubeGeometry( floorWidth, thickness, floorHeight ),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
    0
  );

  // Cover
  var top = new Physijs.BoxMesh(
    new THREE.CubeGeometry( floorWidth, thickness, floorHeight ),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
    0
  ); 

  // Walls
  var front = new Physijs.BoxMesh(
    new THREE.CubeGeometry( floorWidth, thickness, wallHeight ),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    0
  );
  var back = new Physijs.BoxMesh(
    new THREE.CubeGeometry( floorWidth, thickness, wallHeight ),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    0
  );
  var right = new Physijs.BoxMesh(
    new THREE.CubeGeometry( wallHeight, thickness, floorHeight ),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    0
  );
  var left = new Physijs.BoxMesh(
    new THREE.CubeGeometry( wallHeight, thickness, floorHeight ),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
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

function setup()
{
  draw();
}

// Control
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

function draw()
{  
    scene.simulate(); // run physics

    // draw THREE.JS scene
    renderer.render(scene, camera);

    controls.update();
    // loop the draw() function
    requestAnimationFrame(draw);

}
