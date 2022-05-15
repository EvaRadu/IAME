import Sphere from "./Sphere.js";

/**
 *  Class for the superball (player)
 */
export default class sphereMesh extends Sphere {
    constructor(sphereMesh, id, scaling, scene, texture){
        super(sphereMesh,id,scaling,scene,texture);
        sphereMesh.position.x = 0;
        sphereMesh.position.z = 0;
        sphereMesh.frontVector = new BABYLON.Vector3(0, 0, 1);


    }

    /**
     *  Updates the postion of the particles of the superball
     */
    updateParticles(){ 
            // Create a particle system
            var particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene);
    
            //Texture of each particle
            particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", this.scene);
    
            // Where the particles come from
            particleSystem.emitter = this.sphereMesh.position;
    
            // Colors of all particles
            particleSystem.color1 = new BABYLON.Color4(0.84, 0.17, 0.36);
            particleSystem.color2 = new BABYLON.Color4(0.2, 1, 0.91, 0.56);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    
            // Size of each particle (random between...
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.5;
    
            // Life time of each particle (random between...
            particleSystem.minLifeTime = 0.05;
            particleSystem.maxLifeTime = 0.1;
    
            // Emission rate
            particleSystem.emitRate = 1000;
    
    
            /******* Emission Space ********/
            particleSystem.createSphereEmitter(5.5);
    
    
            // Speed
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 7;
            particleSystem.updateSpeed = 0.005;
    
            particleSystem.targetStopDuration = 0.07;
    
            // Start the particle system
            particleSystem.start();
        }
    }

