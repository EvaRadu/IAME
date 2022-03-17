let canvas;
let engine;
let scene;
let camera;

window.onload = startGame;

function startGame() {

    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);

    scene = createScene();

    //main animation loop 60 times/s
    engine.runRenderLoop(() => {
        /*sphere.position.z += vitesseZ;
        sphere.position.y = Math.random()*2;
        if((sphere.position.z >= 10) || (sphere.position.z <= 0)){
            vitesseZ = -vitesseZ;*/
        
        
        scene.render(); // render = dessine
    } 
)};

function createScene() {
    let scene = new BABYLON.Scene(engine);
    
    /**** Set camera and light *****/
    let camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 20, -10),scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas);
    let light = new BABYLON.HemisphericLight("mylight", new BABYLON.Vector3(1, 1, 0));

    let box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.y = 0.5;
    const ground = createGround(scene);
    var sky = createSky(scene);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);

    return scene;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100, onReady: onGroundCreated};
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/sol.jpg");
        ground.material = groundMaterial;
    }
    return ground;
}

function createSky(scene) {
    // Skybox
    //skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/ciel.png", scene);
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;	
    return skybox;
}

// un écouter pour resize la fenêtre
window.addEventListener("resize", () => {
    engine.resize()
})/**/