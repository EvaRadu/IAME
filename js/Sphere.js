export default class Sphere {
    constructor(sphereMesh, id, scaling, scene) {
        this.sphereMesh = sphereMesh;
        this.id = id;
        this.scene = scene;
        this.scaling = scaling;

        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial" , scene);
        sphereMaterial.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMaterial.reflectivityColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMaterial.reflectionColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMaterial.albedoColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMesh.material = sphereMaterial;
        
            
        sphereMesh.Sphere = this;

        //this.sphereMesh.scaling = new BABYLON.Vector3(0.2  , 0.2, 0.2);
        sphereMesh.position.x = Math.floor(Math.random()*(500-(-500)+1)+(-500));
        sphereMesh.position.z = Math.floor(Math.random()*(500-(-500)+1)+(-500));
        sphereMesh.position.y = 4;

        sphereMesh.checkCollisions = true;
        //sphereMesh.showBoundingBox = true;

      
    }

    changeColor(){
        sphereMaterial.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMaterial.reflectivityColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMaterial.reflectionColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMaterial.albedoColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMesh.material = sphereMaterial;

    }


    
}