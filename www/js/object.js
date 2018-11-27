//////////////////////////////////////////////////////////////////////////////////////////////
// load objs
//////////////////////////////////////////////////////////////////////////////////////////////
var numOfObject = 4; // hardcode
var progressText = document.getElementById("progressText");
var finishedCount = 0;
progressText.textContent = finishedCount+"/"+numOfObject;
var progress = document.getElementById("progress");
var loading = document.getElementById("loading");

function updateProgress() {
    progressText.textContent = finishedCount+"/"+numOfObject;
    progress.style.width = finishedCount/numOfObject*100 + '%';
    if (finishedCount == numOfObject)
        loading.style.display = 'none';
}

function loadObjects() {
    // instantiate a loader
    var obj_loader = new THREE.OBJLoader();
    var tex_loader = new THREE.TextureLoader();
    
    obj_loader.load(
        // resource URL
        'objs/table.obj',
        // called when resource is loaded
        function ( object ) {
            finishedCount++;
            updateProgress();

            object.scale.set(.05, .05, .05);
            var bbox = new THREE.Box3().setFromObject(object);
            var x = bbox.max.x-bbox.min.x;
            var y = bbox.max.y-bbox.min.y;
            var z = bbox.max.z-bbox.min.z;
            var box_container = new Physijs.BoxMesh(
                new THREE.CubeGeometry( x, y, z ),
                new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
                // Uncomment the next line to see the wireframe of the container shape
                // new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 })
            );
            box_container.name = "container";
            object.traverse( function ( child ) { // Solve shadow problem: https://stackoverflow.com/questions/15906248/three-js-objloader-obj-model-not-casting-shadows
            if ( child instanceof THREE.Mesh ) {
                child.material = new THREE.MeshPhongMaterial({ color: 0x228B22 });
                child.castShadow = true;
                child.receiveShadow = true;
            }
            } );
            box_container.add(object);
            box_container.position.x = 10;
            box_container.position.y = 5;
            scene.add(box_container);
            dragableObjects.push(box_container);
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
            finishedCount++;
            updateProgress();
            // add texture
        
            object.scale.set(.07, .07, .07);
            var box = new THREE.BoxHelper( object, 0xffffff );
            box.geometry.computeBoundingBox();
        
            var bbox = box.geometry.boundingBox;
            var x = bbox.max.x-bbox.min.x;
            var y = bbox.max.y-bbox.min.y;
            var z = bbox.max.z-bbox.min.z;
            
            var bsphere = box.geometry.boundingSphere; // Reposition
            object.position.x -= bsphere.center.x;
            object.position.y -= bsphere.center.y;
            object.position.z -= bsphere.center.z;

            var box_container = new Physijs.CylinderMesh(
                new THREE.CylinderGeometry( x/2, x/3, y, 32 ), // x/3 is guessing
                // new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 }),
                new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
            );
        
            // var box_container = new Physijs.BoxMesh(
            // new THREE.CubeGeometry( x, y, z ),
            // // new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
            // // Uncomment the next line to see the wireframe of the container shape
            // new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 })
            // );
            box_container.name = "container";
        
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
            dragableObjects.push(box_container);
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
            finishedCount++;
            updateProgress();
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
              new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
              // Uncomment the next line to see the wireframe of the container shape
            //   new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 })
            );
            box_container.name = "container";
    
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
            dragableObjects.push(box_container);
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
            finishedCount++;
            updateProgress();
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
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
            // Uncomment the next line to see the wireframe of the container shape
            // new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 })
            );
            box_container.name = "container";

            var texture = tex_loader.load('objs/MilesDeskWithFileObj/MilesDeskWithFile_Diffuce.jpg');
            var spec = tex_loader.load('objs/MilesDeskWithFileObj/MilesDeskWithFile_SPEC.jpg');
            var bump = tex_loader.load('objs/MilesDeskWithFileObj/MilesDeskWithFileNrmMap_Normal_Bump.jpg');

            object.traverse(function(child) {
                if (child instanceof THREE.Mesh){
                    child.castShadow = true;
                    child.receiveShadow = true;

                    child.material.map = texture;
                    child.material.specularMap = spec;
                    child.material.bumpMap = bump;
                }
            });
            box_container.add(object);
            box_container.position.set(10, 5, -15 );
            scene.add(box_container);
            dragableObjects.push(box_container);
        }, undefined, undefined);
    });
}

// Add basic objects
var dist = 5; // create a object 5 units away from camera
function addCube() {
    var cameraLookAt = controls.getDirection(new THREE.Vector3()).multiplyScalar(dist);
    var spwanPoint = cameraLookAt.add(controls.getObject().position);
    var cube = new Physijs.BoxMesh(
        new THREE.CubeGeometry( 1, 1, 1 ), // default size is 1, 1, 1
        new THREE.MeshPhongMaterial({ color: 0xffffff }) // default color is white
    );
    console.log(spwanPoint);
    cube.position.set(spwanPoint.x, spwanPoint.y, spwanPoint.z);
    scene.add(cube);
    return cube;
}