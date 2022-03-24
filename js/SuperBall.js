import Sphere from "./Sphere.js";

export default class sphereMesh extends Sphere {
    constructor(sphereMesh, id, scaling, scene){
        super(sphereMesh,id,scaling,scene);
        sphereMesh.position.x = 0;
        sphereMesh.position.y = 5;     
        sphereMesh.position.z = 0;
        sphereMesh.speed = 1;
        sphereMesh.frontVector = new BABYLON.Vector3(0, 0, 1);
    }

   
  
}

