import Sphere from "./Sphere.js";

export default class sphereMesh extends Sphere {
    constructor(sphereMesh, id, scaling, scene){
        super(sphereMesh,id,scaling,scene);
        sphereMesh.position.x = 0;
        sphereMesh.position.y = 5;     
        sphereMesh.position.z = 0;
        sphereMesh.speed = 1;
        sphereMesh.frontVector = new BABYLON.Vector3(0, 0, 1);

        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

        // Where the particles come from
        particleSystem.emitter = BABYLON.Vector3.Zero(); // the starting location

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.84, 0.17, 0.36);
        particleSystem.color2 = new BABYLON.Color4(0.2, 1, 0.91, 0.56);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        // Emission rate
        particleSystem.emitRate = 1000;


        /******* Emission Space ********/
        particleSystem.createSphereEmitter(2);


        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;


        sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(sphereMesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 6000, restitution: 0.9 }, scene);

        /*particleSystem.physicsImpostor = new BABYLON.PhysicsImpostor(particleSystem, BABYLON.PhysicsImpostor.ParticleImpostor, {mass:10, restitution : 0.9}, scene)

        let joint = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.LockJoint, {});

        sphereMesh.physicsImpostor.addJoint(particleSystem.physicsImpostor, joint);
        */
        // Start the particle system
        particleSystem.start();

        
    }
  
}

