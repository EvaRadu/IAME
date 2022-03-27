import Sphere from "./Sphere.js";
import SuperBall from "./SuperBall.js";

let canvas;
let engine;
let scene;
let superball;
let otherBallsMesh;
let villainBallsMesh;
let ground;
let remainingBalls = 80;
let touchedBalls = 0;
let inputStates = {};
let bool = false;
var textblock;
let isPlaying = true;
let startButton;
let restartButton;
let boolOnRestartButton = false;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();


    // modify some default settings (i.e pointer events to prevent cursor to go 
    // out of the game window)
    modifySettings();

    superball = scene.getMeshByName("heroSuperball");
    startButton = createButtonLetsPlay();

    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); 
            if (bool) {
                if ((isPlaying) && (bool)) {
                    superball.move();
                    superball.jump();
                    //scene.render();
                }
                else {
                    var textblockWL = WinOrLose();
                    reStartButton = reStartButton();
                    //scene = createScene(); 
                    //startButton = createButtonLetsPlay();
     
                    //scene.render();
                }
            }
            scene.render();
            
    });
    
}

function erase() {
    scene.dispose();
    superball.dispose();
    otherBallsMesh = null;
    villainBallsMesh = null;
    remainingBalls = 80;
    touchedBalls = 0;
    inputStates = {};
    bool = false;
    isPlaying = false;
}

function createButtonLetsPlay() {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "LET'S PLAY !");
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "pink";
    button1.onPointerUpObservable.add(function() {
        button1.dispose();
        bool = true;
        createTimer(5); 
    });
    advancedTexture.addControl(button1);
    return button1;
}

function WinOrLose() {
    var advancedTextureGameOver = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GAME OVER");
    textblock = new BABYLON.GUI.TextBlock();           
    if (remainingBalls <= otherBallsMesh.length/2) {
        textblock.text = "Congrats : you win !";
    } else {
        textblock.text = "Mwahaha : you lost !";
    }
    textblock.fontSize = 24;
    textblock.top = 200;
    textblock.left = 200;
    textblock.color = "black";
    advancedTextureGameOver.addControl(textblock);
    return textblock;
}

function reStartButton() {

    var advancedTextureRestart = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("RestartUI");

    var buttonReStart = BABYLON.GUI.Button.CreateSimpleButton("but2", "Another Round ?");
    buttonReStart.width = "150px"
    buttonReStart.height = "40px";
    buttonReStart.color = "white";
    buttonReStart.cornerRadius = 20;
    buttonReStart.background = "purple";
    buttonReStart.onPointerUpObservable.add(function() { 
        buttonReStart.dispose();
        textblock.dispose();
        erase();
        scene = createScene();
        startButton = createButtonLetsPlay();}
        );
    advancedTextureRestart.addControl(buttonReStart);
    return reStartButton;

}

function createTimer(i) { // i seconds
    // GUI
    var advancedTextureTime = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UITime");

    var textBlock = new BABYLON.GUI.TextBlock("text", new String(i) + " seconds");   

    advancedTextureTime.addControl(textBlock);

    isPlaying = true;
    var timer = window.setInterval(() => {
        i--;
        textBlock.text = new String(i) + " seconds";
        if (i <= 0) {
            isPlaying = false;
            window.clearInterval(timer);
            textBlock.dispose();
            advancedTextureTime.dispose();
        }
    }, 1000)
    return timer;
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);

    let freeCamera = createFreeCamera(scene);

    scene.enablePhysics();

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("score");
    textblock = new BABYLON.GUI.TextBlock();
    textblock.text = "Remaining balls : " + remainingBalls;
    textblock.fontSize = 24;
    textblock.top = -275;
    textblock.left = 410;
    textblock.color = "black";
    advancedTexture.addControl(textblock);

    superball = createSuperBall(scene);

    let otherBalls = createBalls(remainingBalls,scene);
    let villainBalls = createVillains(remainingBalls/2, scene);

    let followCamera = createFollowCamera(scene, superball);
    scene.activeCamera = followCamera;
  
    createLights(scene);
    createSky(scene);

    superball.physicsImpostor = new BABYLON.PhysicsImpostor(superball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1,move:true,friction:0.8, restitution: 0.2 }, scene);
    
   return scene;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:0, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap2.jpg', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/sol/sol11.jpg");
        groundMaterial.diffuseTexture.uScale = 100;
        groundMaterial.diffuseTexture.vScale = 100;
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    }
    return ground;
}

function createSky(scene){
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:3000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('images/skybox2/skybox', scene);
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
    let superballMesh = new BABYLON.MeshBuilder.CreateSphere("heroSuperball", {diameter: 7, segments: 64}, scene);
    let superball = new SuperBall(superballMesh,1,0.2,scene, null);
    
    superballMesh.move = () => {
       
        /*
        if (superballMesh.rotationQuaternion.y > 2) {
            superballMesh.rotationQuaternion.z = 0;
            superballMesh.rotationQuaternion.y = -2;
        } */

        //console.log("x " + superballMesh.rotationQuaternion.x + " y " + superballMesh.rotationQuaternion.y + " z " + superballMesh.rotationQuaternion.z);
        //console.log(superballMesh.rotation.y);
        if(inputStates.up) {
            superballMesh.moveWithCollisions(superballMesh.frontVector.multiplyByFloats(superballMesh.speed, superballMesh.speed, superballMesh.speed));

            //superballMesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,4));
            //superballMesh.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(superballMesh.speed, 0, 0, 0));


            detectCollision(scene);

        }    
        if(inputStates.down) {
            superballMesh.moveWithCollisions(superballMesh.frontVector.multiplyByFloats(-superballMesh.speed, -superballMesh.speed, -superballMesh.speed));
            
            //superballMesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,-4));
            //superballMesh.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(-superballMesh.speed, 0, 0, 0));

            detectCollision(scene);

        }  
        if(inputStates.left) {
            superballMesh.rotation.y -= 0.02;
            superballMesh.frontVector = new BABYLON.Vector3(Math.sin(superballMesh.rotation.y), 0, Math.cos(superballMesh.rotation.y));
           
           /*
            superballMesh.rotationQuaternion.y -= 0.02;
            superballMesh.rotationQuaternion.x = Math.sin(superballMesh.rotationQuaternion.y);
            superballMesh.rotationQuaternion.z = Math.cos(superballMesh.rotationQuaternion.y);
            //superballMesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0 -1), Math.PI / 6);

            superballMesh.frontVector = new BABYLON.Vector3( Math.sin(superballMesh.rotationQuaternion.y),0, Math.cos(superballMesh.rotationQuaternion.y));
        */
        }    
        if(inputStates.right) {
            superballMesh.rotation.y += 0.02;
            superballMesh.frontVector = new BABYLON.Vector3(Math.sin(superballMesh.rotation.y), 0, Math.cos(superballMesh.rotation.y));
            
            /*
            superballMesh.rotationQuaternion.y += 0.02;
            superballMesh.rotationQuaternion.x = Math.sin(superballMesh.rotationQuaternion.y);
            superballMesh.rotationQuaternion.z = Math.cos(superballMesh.rotationQuaternion.y);

            //superballMesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0, -1), -Math.PI / 6);

            superballMesh.frontVector = new BABYLON.Vector3( Math.sin(superballMesh.rotationQuaternion.y),0, Math.cos(superballMesh.rotationQuaternion.y));
      */
        }

        superball.updateParticles();
    }
   


    
/*
    if (superballMesh.intersectsMesh(ground, true)) {
        superballMesh.canJump = true;
    }
    else{
        superballMesh.canJump = false;
    }
    */

    superballMesh.canJump = true;
    superballMesh.jumpAfter = 2; // in seconds

    superballMesh.jump = function(){

        if(!inputStates.space) {
            return;
        }

        if(!superballMesh.canJump){ 
            //console.log("notjump2");
            return ; 
        }

        else{
            console.log("jump");

        superballMesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 17, 1), superballMesh.getAbsolutePosition());

        superballMesh.canJump = false;
        
        setTimeout(() => {
            superballMesh.canJump = true;
        }, 1000 * superballMesh.jumpAfter)

  
        
        
        //console.log("jump");
    }
    detectCollision(scene);

    
    
    }
 
    return superballMesh;
}

function createBalls(nbBall,scene){
    let spheresMesh = [];
    let spheres = [];
    for(let i = 0; i < nbBall; i++) {
        spheresMesh[i] = BABYLON.MeshBuilder.CreateSphere("mySphere" +i, {diameter: 7, segments: 64}, scene);
        spheresMesh[i].physicsImpostor = new BABYLON.PhysicsImpostor(spheresMesh[i], BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.01, restitution: 0.2 }, scene);

        spheres[i] = new Sphere(spheresMesh[i],i,0.2,scene, "images/spheres/white.jpg");
    }
    otherBallsMesh = spheresMesh;
    return spheres;
}

function createVillains(nbBall,scene){
    let spheresMesh = [];
    let spheres = [];
    for(let i = 0; i < nbBall; i++) {
        spheresMesh[i] = BABYLON.MeshBuilder.CreateSphere("villain" +i, {diameter: 7, segments: 64}, scene);
        spheresMesh[i].physicsImpostor = new BABYLON.PhysicsImpostor(spheresMesh[i], BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.01, restitution: 0.2 }, scene);
        //sphereMesh[i].diffuseTexture = new BABYLON.Texture("images/spheres/snow.jpg", this.scene);

        spheres[i] = new Sphere(spheresMesh[i],i,0.2,scene, "images/spheres/snow.jpg");
    }
    villainBallsMesh = spheresMesh;
    return spheres;
}

function detectCollision(scene){
    
    let player = scene.getMeshByName("heroSuperball");

    for(let i = 0; i < otherBallsMesh.length ; i++){
        let ball =  otherBallsMesh[i];

        if(player.intersectsMesh(ball)){

            player.material = ball.material;
            otherBallsMesh.splice(i,1);  
            ball.dispose();
            remainingBalls--;
            touchedBalls++;

            if (player.speed<10) {
                player.speed += 0.1;
            }
            //console.log("Balles restantes : " + remainingBalls);
            //console.log("Balles touchées : " + touchedBalls);
            textblock.text = "Remaining balls : " + remainingBalls;


        }
    }

    for(let i = 0; i < villainBallsMesh.length ; i++){
        let ball =  villainBallsMesh[i];

        if(player.intersectsMesh(ball)){

            //player.material = ball.material;
            touchedBalls--;
            
            player.speed = 1;

            //console.log("MALUS");


           
        }
    }
       
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


