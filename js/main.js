import Sphere from "./Sphere.js";
import SuperBall from "./SuperBall.js";

let canvas;
let camera;
let engine;
let scene;
let superball;
let otherBallsMesh;
let villainBallsMesh;
let ground;
var music;
let remainingBalls = 20;
let balls = remainingBalls;
let touchedBalls = 0;
let inputStates = {};
let bool = false;
var textblock;
let isPlaying = true;
let startButton;
let restartButton;
let boolOnRestartButton = false;
let lifeHearts = 5;
let liveblock = new BABYLON.GUI.TextBlock();

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    scene.assetsManager.load();



    // modify some default settings (i.e pointer events to prevent cursor to go 
    // out of the game window)
    modifySettings();

    superball = scene.getMeshByName("heroSuperball");
    startButton = createButtonLetsPlay();
    let finalScreen = false;

    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); 
            if (bool) {
                if ((isPlaying) && (bool)) {
                    superball.move();
                    superball.jump();
                    //scene.render();
                    if ((remainingBalls == 0)||(lifeHearts==0)) {
                        isPlaying = false;
                    }
                }
                else {
                    if(finalScreen==false){
                    var textblockWL = WinOrLose();
                    reStartButton = reStartButton();
                    finalScreen = true;
                    }
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
    remainingBalls = 20;
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
        createTimer(90); 
    });
    advancedTexture.addControl(button1);
    return button1;
}

function WinOrLose() {
    const nb = otherBallsMesh.length;
    var advancedTextureGameOver = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GAME OVER");
    textblock = new BABYLON.GUI.TextBlock();           
    if (remainingBalls <= balls/2) {
        textblock.text = "Congrats : you win !";
        scene.assets.winGame.setVolume(0.6);
        scene.assets.winGame.play();
    } else {
        scene.assets.loseGame.setVolume(0.6);
        scene.assets.loseGame.play();
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
        startButton = createButtonLetsPlay();
        });
    advancedTextureRestart.addControl(buttonReStart);
    return reStartButton;

}

function createTimer(i) { // i seconds
    // GUI
    var advancedTextureTime = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UITime");

    var textBlock = new BABYLON.GUI.TextBlock("text", "Remaining time : " + new String(i) + " seconds");
    textBlock.color = "black";
    textBlock.fontSize = 24;   
    textBlock.top = -275;
    textBlock.left = 0;

    advancedTextureTime.addControl(textBlock);

    isPlaying = true;
    var timer = window.setInterval(() => {
        if (isPlaying) {
            i--;
            textBlock.text = "Remaining time : " + new String(i) + " seconds";
            if (i <= 0) {
                isPlaying = false;
                window.clearInterval(timer);
                textBlock.dispose();
                advancedTextureTime.dispose();
            }
        }
    }, 1000)
    return timer;
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();

    createGround(scene);
    scene.assetsManager = configureAssetManager(scene);


    //music = new BABYLON.Sound("backgroundMusic", "sounds/sound1.mp3", scene, null, { loop: true, autoplay: true });

   
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("score");
    textblock = new BABYLON.GUI.TextBlock();
    textblock.text = "Remaining balls : " + remainingBalls;
    textblock.fontSize = 24;
    textblock.top = -275;
    textblock.left = 410;
    textblock.color = "black";
    advancedTexture.addControl(textblock);

    displayLives();
    
    superball = createSuperBall(scene);

    let otherBalls = createBalls(remainingBalls,scene);
    let villainBalls = createVillains(remainingBalls/2, scene);

    let followCamera = createFollowCamera(scene, superball);
    scene.activeCamera = followCamera;
  
    createLights(scene);
    createSky(scene);


    //superball.physicsImpostor = new BABYLON.PhysicsImpostor(superball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1,move:true,friction:0.8, restitution: 0.2 }, scene);
    scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);  
    
    loadSounds(scene);
    return scene;
}


function loadSounds(scene) {
    var assetsManager = scene.assetsManager;
    let binaryTask = assetsManager.addBinaryFileTask(
      "eatBall",
      "sounds/eatBall.wav"
    );
    binaryTask.onSuccess = function (task) {
      scene.assets.eatBall = new BABYLON.Sound(
        "eatBall",
        task.data,
        scene,
        null,
        {
            loop: false,
            spatialSound: true,
            autoplay: false
        }
      );
    };

    binaryTask = assetsManager.addBinaryFileTask(
        "enemy",
        "sounds/enemy.wav"
      );
      binaryTask.onSuccess = function (task) {
        scene.assets.enemy = new BABYLON.Sound(
          "enemy",
          task.data,
          scene,
          null,
          {
              loop: false,
              spatialSound: true,
              autoplay: false
          }
        );
      };

    binaryTask = assetsManager.addBinaryFileTask(
        "winGame",
        "sounds/winGame.wav"
      );
      binaryTask.onSuccess = function (task) {
        scene.assets.winGame = new BABYLON.Sound(
          "winGame",
          task.data,
          scene,
          null,
          {
              loop: false,
              autoplay: false
          }
        );
      };

      binaryTask = assetsManager.addBinaryFileTask(
        "loseGame",
        "sounds/loseGame.wav"
      );
      binaryTask.onSuccess = function (task) {
        scene.assets.loseGame = new BABYLON.Sound(
          "loseGame",
          task.data,
          scene,
          null,
          {
              loop: false,
              autoplay: false
          }
        );
      };

    binaryTask = assetsManager.addBinaryFileTask(
        "permanentMusic",
        "sounds/sound1.mp3"
      );
      binaryTask.onSuccess = function (task) {
        scene.assets.permanentMusic = new BABYLON.Sound(
          "permanentMusic",
          task.data,
          scene,
          null,
          {
            loop: true,
            autoplay: true,
            volume: 0.4
          }
        );
      };
  }

function configureAssetManager(scene) {
    // useful for storing references to assets as properties. i.e scene.assets.cannonsound, etc.
    scene.assets = {};
  
    let assetsManager = new BABYLON.AssetsManager(scene);
  
    assetsManager.onProgress = function (
      remainingCount,
      totalCount,
      lastFinishedTask
    ) {
      engine.loadingUIText =
        "We are loading the scene. " +
        remainingCount +
        " out of " +
        totalCount +
        " items still need to be loaded.";
      console.log(
        "We are loading the scene. " +
          remainingCount +
          " out of " +
          totalCount +
          " items still need to be loaded."
      );
    };
  
    assetsManager.onFinish = function (tasks) {
      engine.runRenderLoop(function () {
        scene.render();
      });
    };
  
    return assetsManager;
  }


function displayLives(){
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("lifeHearts");
    let string = "❤❤❤❤❤";
    liveblock.text = string.substring(0,lifeHearts);
    /*
    for(let i=0; i<lifeHearts; i++){
        liveblock.text += string; 
    }*/
    liveblock.fontSize = 24;
    liveblock.top = -275;
    liveblock.left = -400;
    liveblock.color = "black";
    advancedTexture.addControl(liveblock);
}

function createGround(scene) {
    let width = 2000;
    let height = 2000
    const groundOptions = { width:width, height:height, subdivisions:50, minHeight:0, maxHeight:100, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap2.jpg', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/sol/sol19.jpg");
        groundMaterial.diffuseTexture.uScale = 100;
        groundMaterial.diffuseTexture.vScale = 100;
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
        //ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(
            ground,
            BABYLON.PhysicsImpostor.HeightmapImpostor,
            { mass: 0 },
            scene
          );
    }
    createWalls(scene,width,height)
    return ground;
}

function createSky(scene){
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:2000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('images/skybox2/skybox', scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

	skybox.material = skyboxMaterial;	
    skybox.infiniteDistance = true;
    //skyboxMaterial.disableLighting = true;

    return skybox;
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    //let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
    let light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.9;

    /*light1.diffuse = new BABYLON.Color3(1, 0, 0);
	light1.specular = new BABYLON.Color3(0,1,0);
	light1.groundColor = new BABYLON.Color3(0,0,1);*/
}



function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("superballFollowCamera", new BABYLON.Vector3(0,50,0), scene, target);
    camera.radius = 50; // how far from the object to follow
	camera.heightOffset = 14; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit


    return camera;
}

function createWalls(scene, size1, size2) {
    var faceColors = new Array(6);
    faceColors[0] = (new BABYLON.Color4(0.62, 0.14, 0.14))
    faceColors[1] = (new BABYLON.Color4(0.62, 0.14, 0.14))
    faceColors[2] = (new BABYLON.Color4(0.62, 0.14, 0.14))
    faceColors[3] = (new BABYLON.Color4(0.62, 0.14, 0.14))
    faceColors[4] = (new BABYLON.Color4(0.62, 0.14, 0.14))
    faceColors[5] = (new BABYLON.Color4(0.62, 0.14, 0.14))
    

    var options1 = {
    width: size1,
    height: size2/2 + 500,
    depth: 0.1,
    //faceColors : faceColors
    };

      
    var options2 = {
        width: 0.1,
        height: size2/2 + 500,
        depth: 2*size1,
        //faceColors : faceColors
        };
    
    const box1 = BABYLON.MeshBuilder.CreateBox("box1", options1);
    let box1Material = new BABYLON.StandardMaterial("box1Material", scene);
    box1Material.alpha = 0;
    box1.material = box1Material;
    box1.position = new BABYLON.Vector3(0,100,-(size1/2));
    const boxImpostor1 = new BABYLON.PhysicsImpostor( box1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0}, scene);

    const box2 = BABYLON.MeshBuilder.CreateBox("box2", options1);
    box2.position = new BABYLON.Vector3(0,100,(size1/2));
    let box2Material = new BABYLON.StandardMaterial("box2Material", scene);
    box2Material.alpha = 0;
    box2.material = box2Material;
    const boxImpostor2 = new BABYLON.PhysicsImpostor( box2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0}, scene);
  
    const box3 = BABYLON.MeshBuilder.CreateBox("box3", options2);
    box3.position = new BABYLON.Vector3((size1/2),100,-(size1/2));
    let box3Material = new BABYLON.StandardMaterial("box3Material", scene);
    box3Material.alpha = 0;
    box3.material = box3Material;
    const boxImpostor3 = new BABYLON.PhysicsImpostor( box3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0}, scene);
    
    const box4 = BABYLON.MeshBuilder.CreateBox("box4", options2);
    box4.position = new BABYLON.Vector3(-(size1/2),100,-(size1/2));
    let box4Material = new BABYLON.StandardMaterial("box4Material", scene);
    box4Material.alpha = 0;
    box4.material = box4Material;
    const boxImpostor4 = new BABYLON.PhysicsImpostor( box4, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0}, scene);
}

let zMovement = 5;
function createSuperBall(scene) {
    let superballMesh = new BABYLON.MeshBuilder.CreateSphere("heroSuperball", {diameter: 7, segments: 64}, scene);
    let superball = new SuperBall(superballMesh,1,0.2,scene, null);

    superballMesh.speed = 1;
    superballMesh.frontVector = new BABYLON.Vector3(0, 0, 1);

    superballMesh.move = () => {

        let yMovement = 0;
       
        if (superballMesh.position.y > 2) {
            zMovement = 0;
            yMovement = -2;
        } 

       

        if(inputStates.up) {
            superballMesh.moveWithCollisions(superballMesh.frontVector.multiplyByFloats(superballMesh.speed, superballMesh.speed, superballMesh.speed));
            detectCollision(scene);
        }    
        if(inputStates.down) {
            superballMesh.moveWithCollisions(superballMesh.frontVector.multiplyByFloats(-superballMesh.speed, -superballMesh.speed, -superballMesh.speed));
            detectCollision(scene);
        }    
        if(inputStates.left) {
            superballMesh.rotation.y -= 0.02;
            superballMesh.frontVector = new BABYLON.Vector3(Math.sin(superballMesh.rotation.y), 0, Math.cos(superballMesh.rotation.y));
            detectCollision(scene);
        }    
        if(inputStates.right) {
            superballMesh.rotation.y += 0.02;
            superballMesh.frontVector = new BABYLON.Vector3(Math.sin(superballMesh.rotation.y), 0, Math.cos(superballMesh.rotation.y));
            detectCollision(scene);
        }

        //superballMesh.position = new BABYLON.Vector3(boxMesh.position.x, boxMesh.position.y, boxMesh.position.z);
        superball.updateParticles();

    }


       
    superballMesh.canJump = true;
    superballMesh.isJumping = false;
    superballMesh.jumpAfter = 0.1; // in seconds


    superballMesh.jump = function(){

        console.log(superballMesh.canJump)

        if(!inputStates.space) {
            updatePosition()
            return;
        }

        if(!superballMesh.canJump){ 
            updatePosition()
            //console.log("notjump2");
            return ; 
        }

        else{
           

        //superballMesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 17, 1), superballMesh.getAbsolutePosition());
        let origin = new BABYLON.Vector3(superballMesh.position.x, 1000, superballMesh.position.z);
        let direction = new BABYLON.Vector3(0, -1, 0);
        let ray = new BABYLON.Ray(origin, direction, 10000);  
            
        // compute intersection point with the ground
        let pickInfo = scene.pickWithRay(ray, (mesh) => { return(mesh.name === "gdhm"); });
        let groundHeight = pickInfo.pickedPoint.y;
        if(superballMesh.position.y<=groundHeight+25){
            superballMesh.position.y = superballMesh.position.y + 1;
            superballMesh.isJumping=true;
        }
        //else { superballMesh.canJump=false; }
     
        detectCollision(scene);
     
    }



    setTimeout(() => {
        this.canJump = false;
        console.log("NOW");
      }, 10000 * this.jumpAfter);
    
    setTimeout(()=> {
        this.canJump = true;
        console.log("NOW2")
    }, 18000 * this.jumpAfter)
    }
 
    return superballMesh;
}

function updatePosition(){
    let superballMesh = scene.getMeshByName("heroSuperball");
    let origin = new BABYLON.Vector3(superballMesh.position.x, 1000, superballMesh.position.z);
    let direction = new BABYLON.Vector3(0, -1, 0);
    let ray = new BABYLON.Ray(origin, direction, 10000);  
        
    // compute intersection point with the ground
    let pickInfo = scene.pickWithRay(ray, (mesh) => { return(mesh.name === "gdhm"); });
    let groundHeight = pickInfo.pickedPoint.y;
    if(superballMesh.position.y>=groundHeight+4.5){
        superballMesh.position.y = superballMesh.position.y - 0.5;
    }
    
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
        spheresMesh[i].touched = false;

        spheres[i] = new Sphere(spheresMesh[i],i,0.2,scene, "images/spheres/snow.jpg");
        spheresMesh[i].material.alpha = 1;
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

            if (player.speed<3) {
                player.speed += 0.1;
            }

            //console.log("Balles restantes : " + remainingBalls);
            //console.log("Balles touchées : " + touchedBalls);
            textblock.text = "Remaining balls : " + remainingBalls;
            scene.assets.eatBall.setPosition(player.position);
            scene.assets.eatBall.setVolume(0.6);
            scene.assets.eatBall.play();
     
        }
    }

    for(let i = 0; i < villainBallsMesh.length ; i++){
        let ball =  villainBallsMesh[i];

        if(player.intersectsMesh(ball)){
            
            touchedBalls--;
            if(ball.touched == false){
                lifeHearts--;
                ball.touched = true;
                player.material.diffuseTexture = new BABYLON.Texture("images/spheres/red.jpg", scene);
                player.material.alpha = 1;
                otherBallsMesh.splice(i,1);  
                scene.assets.enemy.setPosition(player.position);
                scene.assets.enemy.setVolume(0.8);
                scene.assets.enemy.play();
            }
            
            //console.log(lifeHearts);
            let string = "❤❤❤❤❤";
            liveblock.text = string.substring(0,lifeHearts);

            //ball.material = temporaryMaterial;


            player.speed = 1;

            setTimeout(() => {
                ball.touched = false;
                villainBallsMesh.push(ball);
                //player.material.diffuseTexture = new BABYLON.Texture("images/spheres/snow.jpg", scene); 
            }, 5000 );
          
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


