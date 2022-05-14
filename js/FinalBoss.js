import Sphere from "./Sphere.js";

export default class FinalBoss extends Sphere {
    constructor(finalBossMesh, id, scaling, scene, texture){
        super(finalBossMesh,id,scaling,scene,texture);
        finalBossMesh.position.x = 70;
        //finalBossMesh.position.y = 5;     
        finalBossMesh.position.z = 70;
        finalBossMesh.speed = 4;
        finalBossMesh.frontVector = new BABYLON.Vector3(0, 0, 1);
        finalBossMesh.physicsImpostor = new BABYLON.PhysicsImpostor(finalBossMesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 100000, restitution: 0.2 }, scene);
        //finalBossMesh.showBoundingBox = true;

    }

        
    move(scene) {
        // as move can be called even before the bbox is ready.

        // let's put the FinalBoss at the BBox position. in the rest of this
        // method, we will not move the FinalBoss but the BBox instead
       

        // follow the superball
        let superball = scene.getMeshByName("heroSuperball");
        // let's compute the direction vector that goes from FinalBoss to the superball
        let direction = superball.position.subtract(this.finalBossMesh.position);
        let distance = direction.length(); // we take the vector that is not normalized, not the dir vector
        //console.log(distance);

        let dir = direction.normalize();
        // angle between FinalBoss and superball, to set the new rotation.y of the FinalBoss so that he will look towards the superball
        // make a drawing in the X/Z plan to uderstand....
        let alpha = Math.atan2(-dir.x, -dir.z);
        // If I uncomment this, there are collisions. This is strange ?
        //this.bounder.rotation.y = alpha;

        this.finalBossMesh.rotation.y = alpha;

        // let make the FinalBoss move towards the superball
        // first let's move the bounding box mesh
        if(distance > 10) {
            //a.restart();   
            // Move the bounding box instead of the FinalBoss....
            this.finalBossMesh.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
        }
        else {
            //a.pause();
        }   
    }

    }

