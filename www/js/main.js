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



//////////////////////////////////////////////////////////////////////////////////////////////
// load objs
//////////////////////////////////////////////////////////////////////////////////////////////
// instantiate a loader
var obj_loader = new THREE.OBJLoader();
var tex_loader = new THREE.TextureLoader();

obj_loader.load(
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
          child.receiveShadow = true;
      }
    } );
    box_container.add(object);
    box_container.position.x = 10;
    box_container.position.y = 5;
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

// load diningtable
obj_loader.load(
	// resource URL
	'objs/dining-table.obj/diningtable.obj',
	// called when resource is loaded
	function ( object ) {

    // add texture

    object.scale.set(.07, .07, .07);
    var box = new THREE.BoxHelper( object, 0xffffff );
    box.geometry.computeBoundingBox();

    var bbox = box.geometry.boundingBox;
    var x = bbox.max.x-bbox.min.x;
    var y = bbox.max.y-bbox.min.y;
    var z = bbox.max.z-bbox.min.z;
    
    var bsphere = box.geometry.boundingSphere; // Repositiob
    object.position.x -= bsphere.center.x;
    object.position.y -= bsphere.center.y;
    object.position.z -= bsphere.center.z;

    var box_container = new Physijs.BoxMesh(
      new THREE.CubeGeometry( x, y, z ),
      // new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
      // Uncomment the next line to see the wireframe of the container shape
      new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 })
    );

    var texture = tex_loader.load('objs/dining-table.obj/texture.jpg');

    object.traverse( function ( child ) { // Solve shadow problem: https://stackoverflow.com/questions/15906248/three-js-objloader-obj-model-not-casting-shadows
      if ( child instanceof THREE.Mesh ) {
          // child.material.map = texture;
          child.castShadow = true;
          child.receiveShadow = true;
          // load texture
          child.material.map = texture;
          child.material.bumpMap = texture;
      }
    } );

    box_container.add(object);
    box_container.position.x = -10;
    box_container.position.y = 5;
    scene.add(box_container);
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

// load bed
new THREE.MTLLoader().setPath( 'objs/bed1/')
.load('Bed08.mtl', function(materials){
    materials.preload();

    new THREE.OBJLoader()
    .setMaterials(materials)
    .setPath('objs/bed1/')
    .load('Bed08.obj', function(object){
        object.scale.set(0.0075, 0.0075, 0.0075);
        // object.position.set(15, 2, -96 );

        var box = new THREE.BoxHelper( object, 0xffffff );
        box.geometry.computeBoundingBox();
    
        var bbox = box.geometry.boundingBox;
        var x = bbox.max.x-bbox.min.x;
        var y = bbox.max.y-bbox.min.y;
        var z = bbox.max.z-bbox.min.z;
        
        var bsphere = box.geometry.boundingSphere; // Repositiob
        object.position.x -= bsphere.center.x;
        object.position.y -= bsphere.center.y;
        object.position.z -= bsphere.center.z;

        var box_container = new Physijs.BoxMesh(
          new THREE.CubeGeometry( x, y, z ),
          // new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
          // Uncomment the next line to see the wireframe of the container shape
          new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 })
        );

        var texture = tex_loader.load('objs/bed1/texutre/M209-06.jpg');

        object.traverse(function(child) {
            if (child instanceof THREE.Mesh){
              child.castShadow = true;
              child.receiveShadow = true;

              child.material.map = texture;
            }
        });

        box_container.add(object);
        box_container.position.set(22, 5, -85 );
        scene.add(box_container);
    }, undefined, undefined);
});

// load desk
new THREE.MTLLoader().setPath( 'objs/MilesDeskWithFileObj/')
.load('MilesDeskWithFile.mtl', function(materials){
    materials.preload();

    new THREE.OBJLoader()
    .setMaterials(materials)
    .setPath('objs/MilesDeskWithFileObj/')
    .load('MilesDeskWithFile.obj', function(object){

      object.scale.set(0.1, 0.1, 0.1);
      

      var box = new THREE.BoxHelper( object, 0xffffff );
      box.geometry.computeBoundingBox();
  
      var bbox = box.geometry.boundingBox;
      var x = bbox.max.x-bbox.min.x;
      var y = bbox.max.y-bbox.min.y;
      var z = bbox.max.z-bbox.min.z;
      
      var bsphere = box.geometry.boundingSphere; // Repositiob
      object.position.x -= bsphere.center.x;
      object.position.y -= bsphere.center.y;
      object.position.z -= bsphere.center.z;

      var box_container = new Physijs.BoxMesh(
        new THREE.CubeGeometry( x, y, z ),
        // new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
        // Uncomment the next line to see the wireframe of the container shape
        new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 })
      );

        var texture = tex_loader.load('objs/MilesDeskWithFileObj/MilesDeskWithFile_Diffuce.jpg');
        var spec = tex_loader.load('objs/MilesDeskWithFileObj/MilesDeskWithFile_SPEC.jpg');
        var bump = tex_loader.load('objs/MilesDeskWithFileObj/MilesDeskWithFileNrmMap_Normal_Bump.jpg');

        object.traverse(function(child) {
            if (child instanceof THREE.Mesh){
                child.material.map = texture;
                child.material.specularMap = spec;
                child.material.bumpMap = bump;
            }
        });
        box_container.add(object);
        box_container.position.set(10, 5, -15 );
        scene.add(box_container);
    }, undefined, undefined);
});


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

function rotateAround(pivotPoint, speed) {
  pivotPoint.rotation.x += speed;
}

function setup()
{
  draw();
}

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
