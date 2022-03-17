let canvas;
let engine;
let scene;
let camera;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);

    scene = createScene();

    let sphere = scene.getMeshByName("mySphere");
    let vitesseZ = 1;

    // main animation loop 60 times/s
    engine.runRenderLoop(() => {
        /*sphere.position.z += vitesseZ;
        sphere.position.y = Math.random()*2;
        if((sphere.position.z >= 10) || (sphere.position.z <= 0)){
            vitesseZ = -vitesseZ;
        }
        */
        scene.render(); // render = dessine
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    
    // background
    scene.clearColor = new BABYLON.Color3(1, 0, 1);
    // Create some objects 
    // params = number of horizontal "stripes", diameter...
    let sphere = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 2, segments: 32}, scene);
    sphere.position.y = 1; // la position de la spehere (par defaut, position = (0,0,0))
    //sphere.position.z = 10; 

    let sphere2 = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 2, segments: 32}, scene);
    sphere2.position.y = 5; 

    let sphere3 = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 2, segments: 32}, scene);
    sphere3.position.y = 10;


    // a plane
    let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 60, height: 60}, scene);
    //console.log(ground.name);

    // on crée une caméra
     camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 50, -10), scene);
   // This targets the camera to scene origin
   camera.setTarget(BABYLON.Vector3.Zero()); // Vector = x,y,z 
   //camera.rotation.y = 0.3;
   camera.attachControl(canvas); // pour pouvoir déplacer avec les fléches et la souris
   
   // on crée une lumière
    let light = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.2;
    // color of the light
    light.diffuse = new BABYLON.Color3(1, 1, 1);


    let light2 = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(80, 0, 1), scene);
    light2.intensity = 0.9;
    // color of the light
    light2.diffuse = new BABYLON.Color3(1,390, 200);

   
    return scene;
}

// un écouter pour resize la fenêtre
window.addEventListener("resize", () => {
    engine.resize()
})