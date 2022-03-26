export default class Sphere {
    constructor(sphereMesh, id, scaling, scene, texture) {
        this.sphereMesh = sphereMesh;
        this.id = id;
        this.scene = scene;
        this.scaling = scaling;

        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial" , scene);
        
        //var sphereMaterial = new BABYLON.PBRMaterial("sphereMaterial", this.scene);
        //sphereMaterial.subSurface.isRefractionEnabled = true;

        sphereMaterial.glossiness = 3;
        sphereMaterial.metallic = 5;
        sphereMaterial.roughness = 0.5;    
        sphereMaterial.specularPower = 16;
        
        
        if (texture != null) {
            sphereMaterial.diffuseTexture = new BABYLON.Texture(texture, this.scene); 
        }
        
        //sphereMaterial.diffuseTexture.level = 2;

        sphereMaterial.alpha = Math.random()*(1-0.7+1)+0.7; // niveau de transparence
        
        sphereMaterial.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMaterial.reflectivityColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMaterial.reflectionColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMaterial.albedoColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

        sphereMesh.material = sphereMaterial;
                    
        sphereMesh.Sphere = this;

        //this.sphereMesh.scaling = new BABYLON.Vector3(0.2  , 0.2, 0.2);
        sphereMesh.position.x = Math.floor(Math.random()*(300-(-300)+1)+(-300));
        sphereMesh.position.z = Math.floor(Math.random()*(300-(-300)+1)+(-300));
        sphereMesh.position.y = 4;

        sphereMesh.checkCollisions = true;
        //sphereMesh.showBoundingBox = true;

      
    }



    
}