'use strict';
// configure physijs
Physijs.scripts.worker = '/js/lib/physi/physijs_worker.js';
Physijs.scripts.ammo = '../ammo/ammo.js'; // latest ammo.js is not working, we have to use the ammo.js provided in physijs examples

// set the scene size
var WIDTH = 640,
HEIGHT = 360;

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
var c = document.getElementById("canvas");
c.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

var scene = new Physijs.Scene;

// add the camera to the scene
scene.add(camera);

// set a default position for the camera
// not doing this somehow messes up shadow rendering
camera.position.z = 20;

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

// Box
var box = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 5, 5, 5 ),
    new THREE.MeshBasicMaterial({ color: 0x888888 }),
);
box.position.y = 5;
scene.add( box );

var floor = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 10, 1, 10 ),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    0
);
floor.position.y = -5;
scene.add( floor );

// create a point light
var pointLight = new THREE.PointLight(0xF8D898);

// set its position
pointLight.position.x = -1000;
pointLight.position.y = 0;
pointLight.position.z = 1000;
pointLight.intensity = 2.9;
pointLight.distance = 10000;

// add to the scene
scene.add(pointLight);

function setup()
{
  draw();
}

function draw()
{  
    scene.simulate(); // run physics

    // draw THREE.JS scene
    renderer.render(scene, camera);

    // loop the draw() function
    requestAnimationFrame(draw);
}