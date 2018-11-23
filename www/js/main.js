'use strict';
// configure physijs
Physijs.scripts.worker = '/js/lib/physi/physijs_worker.js';
Physijs.scripts.ammo = '../ammo/ammo.js'; // latest ammo.js is not working, we have to use the ammo.js provided in physijs examples

// set up stats
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

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
var renderer = new THREE.WebGLRenderer({antialias: true});

// start the renderer
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMapEnabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
// renderer.shadowMap.renderReverseSided = false;

// attach the render-supplied DOM element
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);
camera.rotation.order = "YXZ"; // Rotation along y-axis will be correct, other will be wrong

var scene = new Physijs.Scene;

// skybox
var path = "skybox/ThickCloudsWater/ThickCloudsWater";
var format = '.png';
var urls = [
  path + 'Right2048' + format, path + 'Left2048' + format,
  path + 'Up2048' + format, path + 'Down2048' + format,
  path + 'Back2048' + format, path + 'Front2048' + format
];
var reflectionCube = new THREE.CubeTextureLoader().load( urls );
reflectionCube.format = THREE.RGBFormat;

scene.background = reflectionCube;

// add the camera to the scene
// scene.add(camera);

// set a default position for the camera
// not doing this somehow messes up shadow rendering
// camera.position.z = 10;

// instantiate a loader
var loader = new THREE.OBJLoader();

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
    object.traverse( function ( child ) { // Solve shadow problem: https://stackoverflow.com/questions/15906248/three-js-objloader-obj-model-not-casting-shadows
      if ( child instanceof THREE.Mesh ) {
          // child.material.map = texture;
          child.castShadow = true;
      }
    } );
    box_container.add(object);
    box_container.position.x = 10
    box_container.position.y = 5
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

// set up the sphere vars
// lower 'segment' and 'ring' values will increase performance
var radius = .5,
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

// Create a ball with sphere geometry
var lightBall = new THREE.Mesh(
  new THREE.SphereGeometry(radius,
  segments,
  rings),
  sphereMaterial);

// create a point light
var pointLight = new THREE.PointLight(0xF8D898);
pointLight.intensity = 1;
pointLight.distance = 100;
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;  // default: 512; higher better
pointLight.shadow.mapSize.height = 1024; // default: 512; higher better

lightBall.add(pointLight)
lightBall.position.y = 8;
scene.add(lightBall)

// set its position
ball.position.x = -20;
ball.position.y = 5;
ball.position.z = 0;
ball.receiveShadow = true;
ball.castShadow = true;
// add the sphere to the scene
scene.add(ball);

// Sun
var lightBall2 = new THREE.Mesh(
  new THREE.SphereGeometry(radius,
  segments,
  rings),
  sphereMaterial);
// create a point light
var sun = new THREE.PointLight(0xF8D898);
sun.intensity = 1;
sun.distance = 1000;
sun.castShadow = true;
// create center
var pivotPoint = new THREE.Object3D();
lightBall2.add(sun)
lightBall2.position.y = 100;
pivotPoint.add(lightBall2);

function rotateAround(pivotPoint, speed) {
  pivotPoint.rotation.x += speed;
}
scene.add(pivotPoint);

// AmbientLight
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add(light);

// Ground
var ground = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 800, 1, 800 ),
    new THREE.MeshPhongMaterial({ color: 0x888888 }),
    0
);
// ground.position.y = -11;
ground.receiveShadow = true;
scene.add( ground );
// scene, floorWidth, floorHeight, wallHeight, thickness
var room = buildRoom(scene, 100, 100, 20, 1, [0,1,0]);
scene.add(room);

function setup()
{
  draw();
}

// Control
// var controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.enablePan = false;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
var aim = document.getElementById('aim');
instructions.addEventListener( 'click', function () {
  controls.lock();
}, false );

var controls = new THREE.PointerLockControls(camera, 10);
controls.addEventListener( 'lock', function () {
  instructions.style.display = 'none';
  blocker.style.display = 'none';
  aim.style.display = 'block';
} );
controls.addEventListener( 'unlock', function () {
  blocker.style.display = 'block';
  instructions.style.display = '';
  aim.style.display = 'none';
} );
scene.add( controls.getObject() );

function draw()
{  
  stats.begin();
  scene.simulate(); // run physics

  rotateAround(pivotPoint, 0.005);
  
  // draw THREE.JS scene
  renderer.render(scene, camera);
  stats.end();
  
  controls.update();
  
  // loop the draw() function
  requestAnimationFrame(draw);
}
