import { state } from "./state";
import { PerspectiveCamera } from "three";
import { EngineEditorCamera } from "./util/EngineEditorCamera";
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { renderer } from "./renderer";
import { Physics } from "./physics";
// import PhysicsSolver from './physics.worker.js';
// import { scene } from "../scenes/partycle01/scene"
import { scene } from "../scenes/networkedTower/scene"

// editor camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(new EngineEditorCamera(camera, renderer.domElement));

// main app render loop
renderer.setAnimationLoop(() =>
{
    // RENDERING
    renderer.render(scene, camera);

    // PHYSICS
    if (!state.isPaused && state.hasPhysics) Physics.updatePhysics();

    // NETWORKING
    if (scene.se != undefined) scene.se.PeerConnection.sync();

    // TRAVERSE UPDATE LOOPS IN SCENE OBJECTS
    scene.traverse(obj => { typeof obj.update === 'function' ? obj.update() : false });
});

window.addEventListener('resize', () =>
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// DOM append
document.querySelector(".app").appendChild(renderer.domElement);

// webxr button
const a = document.querySelector(".app").appendChild(VRButton.createButton(renderer));
a.style.background = "black";