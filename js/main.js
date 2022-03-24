import Sphere from "./Sphere.js";
import SuperBall from "./SuperBall.js";

let canvas;
let engine;
let scene;
let superball;
let inputStates = {};

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    // modify some default settings (i.e pointer events to prevent cursor to go 
    // out of the game window)
    modifySettings();

    let superball = scene.getMeshByName("heroSuperball");

    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); 

        //superball.move();
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);

    let freeCamera = createFreeCamera(scene);

   // let testballMesh = new BABYLON.MeshBuilder.CreateSphere("testBall", {diameter: 7, segments: 64}, scene);
   // let testball = new SuperBall(testballMesh,1,0.2,scene);
  
    let superballMesh = new BABYLON.MeshBuilder.CreateSphere("heroSuperball", {diameter: 7, segments: 64}, scene);
    let superball = new SuperBall(superballMesh,1,0.2,scene);
    //console.log(superball.position.y);
    //let superball = createSuperBall(scene);
    let ohterBalls = createBalls(10,scene);
    // second parameter is the target to follow

    let followCamera = createFollowCamera(scene, superballMesh);
    scene.activeCamera = followCamera;
  
    createLights(scene);

    createSky(scene);

    scene.enablePhysics();
    //scene.enablePhysics(new BABYLON.Vector3(0,-9.8, 0), new BABYLON.CannonJSPlugin());
    //scene.enablePhysics(new BABYLON.Vector3(0, -20, 0), new BABYLON.OimoJSPlugin());

    //superballMesh.physicsImpostor = new BABYLON.PhysicsImpostor(superball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 6000, restitution: 0.9 }, scene);
    //ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.9 }, scene);
   // superball.setPhysicsState({ impostor: BABYLON.PhysicsEngine.SphereImpostor, mass: 1 });
   // ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.9 }, scene);
   return scene;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:0, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/sol.jpg");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
      
    }
    return ground;
}

function createSky(scene){
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:3000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('images/skybox/skybox', scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;	
    return skybox;
}


function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);

}


function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true; 
    // avoid flying with the camera
    camera.applyGravity = true;

    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("superballFollowCamera", target.position, scene, target);

    camera.radius = 50; // how far from the object to follow
	camera.heightOffset = 14; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit

    return camera;
}

let zMovement = 5;
function createSuperBall(scene) {
    let superball = new BABYLON.MeshBuilder.CreateSphere("heroSuperball", {diameter: 7, segments: 64}, scene);
    /*   
    let superballMaterial = new BABYLON.StandardMaterial("superballMaterial", scene);
    superballMaterial.diffuseColor = new BABYLON.Color3.Red;
  

    superballMaterial.emissiveColor = new BABYLON.Color3.Blue;
    superball.material = superballMaterial;
    */

    
    let superballMaterial = new BABYLON.StandardMaterial("superballMaterial" , scene);
    superballMaterial.diffuseTexture = new BABYLON.Texture("images/emoji.png", scene);
    superballMaterial.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    superballMaterial.reflectivityColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    superballMaterial.reflectionColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    superballMaterial.albedoColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    superball.material = superballMaterial;

    superball.showBoundingBox = true;


    // By default the box/superball is in 0, 0, 0, let's change that...
    superball.position.y = 5;
    superball.speed = 1;
    superball.frontVector = new BABYLON.Vector3(0, 0, 1);

    superball.move = () => {
                //superball.position.z += -1; // speed should be in unit/s, and depends on
                                 // deltaTime !

        // if we want to move while taking into account collision detections
        // collision uses by default "ellipsoids"

        let yMovement = 0;
       
        if (superball.position.y > 2) {
            zMovement = 0;
            yMovement = -2;
        } 
        //superball.moveWithCollisions(new BABYLON.Vector3(0, yMovement, zMovement));

        
        if(inputStates.up) {
            //superball.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*superball.speed));
            superball.moveWithCollisions(superball.frontVector.multiplyByFloats(superball.speed, superball.speed, superball.speed));
        }    
        if(inputStates.down) {
            //superball.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*superball.speed));
            superball.moveWithCollisions(superball.frontVector.multiplyByFloats(-superball.speed, -superball.speed, -superball.speed));

        }  
        if(inputStates.left) {
            //superball.moveWithCollisions(new BABYLON.Vector3(-1*superball.speed, 0, 0));
            superball.rotation.y -= 0.02;
            superball.frontVector = new BABYLON.Vector3(Math.sin(superball.rotation.y), 0, Math.cos(superball.rotation.y));
        }    
        if(inputStates.right) {
            //superball.moveWithCollisions(new BABYLON.Vector3(1*superball.speed, 0, 0));
            superball.rotation.y += 0.02;
            superball.frontVector = new BABYLON.Vector3(Math.sin(superball.rotation.y), 0, Math.cos(superball.rotation.y));
        }
    }
 
    // Tentative de jump : 
    superball.jump = function(){
        if(!inputStates.space) return;

       // superball.rotation.z += 1000;
       // superball.frontVector = new BABYLON.Vector3(Math.sin(superball.rotation.z), 0, Math.cos(superball.rotation.z));
    var force_vector = new BABYLON.Vector3(0, 20, 0);        
    superball.applyImpulse(force_vector,superball.position);

    }

    return superball;
}

/*
function createBalls(nbBall,scene){
    let spheres = [];
    let sphereMaterials = [];

    for(let i = 0; i < nbBall; i++) {
        spheres[i] = BABYLON.MeshBuilder.CreateSphere("mySphere" +i, {diameter: 7, segments: 64}, scene);
      
        spheres[i].position.x = Math.floor(Math.random()*(500-0+1)+0);
        spheres[i].position.z = Math.floor(Math.random()*(500-0+1)+0);

        spheres[i].position.y = 5;

        //spheres[i].showBoundingBox = true;

        sphereMaterials[i] = new BABYLON.StandardMaterial("sphereMaterial" + i, scene);
        spheres[i].material = sphereMaterials[i];
        spheres[i].material.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        spheres[i].material.reflectivityColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        spheres[i].material.reflectionColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        spheres[i].material.albedoColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        spheres[i].checkCollisions = true;

        spheres[i].showBoundingBox = true;
    }
    return spheres;

}
*/
function createBalls(nbBall,scene){
    let spheresMesh = [];
    let spheres = [];
    for(let i = 0; i < nbBall; i++) {
        spheresMesh[i] = BABYLON.MeshBuilder.CreateSphere("mySphere" +i, {diameter: 7, segments: 64}, scene);
        spheres[i] = new Sphere(spheresMesh[i],i,0.2,scene);
    }
    return spheres;
}




window.addEventListener("resize", () => {
    engine.resize()
});

function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it
    scene.onPointerDown = () => {
        if(!scene.alreadyLocked) {
            console.log("requesting pointer lock");
            canvas.requestPointerLock();
        } else {
            console.log("Pointer already locked");
        }
    }

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if(element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    })

    // key listeners for the superball
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;
    
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = true;
        }  else if (event.key === " ") {
           inputStates.space = true;
        }
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = false;
        }  else if (event.key === " ") {
           inputStates.space = false;
        }
    }, false);
}


