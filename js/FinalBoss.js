import Sphere from "./Sphere.js";

/**
 *  Class for the final boss
 */
export default class FinalBoss extends Sphere {
    constructor(finalBossMesh, id, scaling, scene, texture){
        super(finalBossMesh,id,scaling,scene,texture);
        finalBossMesh.position.x = 70;
        //finalBossMesh.position.y = 5;     
        finalBossMesh.position.z = 70;
        finalBossMesh.speed = 4;
        finalBossMesh.frontVector = new BABYLON.Vector3(0, 0, 1);
        finalBossMesh.physicsImpostor = new BABYLON.PhysicsImpostor(finalBossMesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.2 }, scene);
        //finalBossMesh.showBoundingBox = true;

    }
    

    }

