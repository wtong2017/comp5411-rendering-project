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
// renderer.shadowMapCullFace = THREE.CullFaceBack;
// renderer.shadowMapCullFrontFaces = false;

// attach the render-supplied DOM element
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

var scene = new Physijs.Scene;

// var cubeCamera = new THREE.CubeCamera(0.1, 1000, 256);
// scene.add(cubeCamera);

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

// Load custom objects
loadObjects();

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

// set its position
ball.position.x = -20;
ball.position.y = 5;
ball.position.z = 0;
ball.receiveShadow = true;
ball.castShadow = true;
// add the sphere to the scene
scene.add(ball);

// Lighting
var sun = createDirectionalLight([0, 1000, 0], true);
var pivotPoint = new THREE.Object3D();
pivotPoint.add(sun);
scene.add(pivotPoint);

// AmbientLight
var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add(ambientLight);

// Ground
var ground = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 1500, 1, 1500 ),
    new THREE.MeshPhongMaterial({ color: 0x888888 }),
    0
);
ground.receiveShadow = true;
ground.castShadow = true;
scene.add( ground );

// Room
// scene, floorWidth, floorHeight, wallHeight, thickness, position
var roomComponents = buildRoom(scene, 100, 100, 20, 1, [0,1,0]);
roomComponents.forEach(component => {
  scene.add(component);
});

// Control
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

// Drag control
var dragableObjects = [];
// scene.children.forEach(object => {
//   if (object.name == 'container')
//     dragableObjects.push(object);
// }); // This won't work because the container objects are loaded after this line of code. Therefore, we need to add it to the array when the object is loaded above.
var dragControls = new THREE.DragControls( dragableObjects, camera, renderer.domElement );

function rotateAround(pivotPoint, speed) {
  pivotPoint.rotation.x += speed;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setup()
{
  draw();
  window.onresize = onWindowResize;
}

function draw()
{  
  stats.begin();
  scene.simulate(); // run physics
  // cubeCamera.update( renderer, scene );

  rotateAround(pivotPoint, 0.005);
  
  // draw THREE.JS scene
  renderer.render(scene, camera);
  stats.end();
  
  controls.update();
  
  // loop the draw() function
  requestAnimationFrame(draw);
}
