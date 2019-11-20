import * as THREE from 'three'
import * as Tone from 'tone'

//new sketch: generate a bunch of objects that are affected by the mouse
//where if the mouse is hovering over it, the object sinks and disappears

var container = document.getElementById("container");
var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function startAudio() {
    Tone.start();
    container.removeEventListener("mousedown", startAudio);
    container.removeEventListener("touchstart", startAudio);
}
container.addEventListener("mousedown", startAudio);
container.addEventListener("touchstart", startAudio);

var phaser = new Tone.Phaser({
    "frequency": 15,
    "octaves": 5,
    "baseFrequency": 1000
}).toMaster();

var synth = new Tone.FMSynth().connect(phaser);
const notes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3"];


var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
camera.position.y = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

container.appendChild(renderer.domElement);

var geometry = new THREE.PlaneGeometry(10 * window.innerWidth, 10 * window.innerHeight);
var material = new THREE.MeshStandardMaterial({ color: 0x0000ff, side: 0 });
var plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
plane.rotateX(-Math.PI / 2);
scene.add(plane);

var bgeometry = new THREE.SphereGeometry(1,20,20);
var bmaterial = new THREE.MeshToonMaterial({ color: 0x00aaaa });
var ballGroup = new THREE.Group();
scene.add(ballGroup);

var clock = new THREE.Clock()

var light = new THREE.DirectionalLight();
light.position.set(0,20,0);
light.lookAt(new THREE.Vector3(0, 0, 0));
light.castShadow = true;
scene.add(light);
console.log(light);

light.shadow.bias = -0.001;
light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;    // default
light.shadow.camera.far = 500;     // default
light.shadow.camera.left =-20;    // default
light.shadow.camera.right = 20;     // default
light.shadow.camera.top = -20;    // default
light.shadow.camera.bottom = 20;     // default

var numBalls = 15;
function spawnBalls() {
    for (var i = 0; i < numBalls; i++) {
        var ball = new THREE.Mesh(bgeometry, bmaterial);
        ball.position.x += THREE.Math.randFloat(-10, 10);
        ball.position.y += 2;
        ball.position.z += THREE.Math.randFloat(-12, 8);
        ball.velocity = new THREE.Vector3(0, 0, 0);
        ball.castShadow = true;
        ball.receiveShadow = true;
        ballGroup.add(ball);
    }
}

spawnBalls();

var selectedObject = null;
container.addEventListener("mousemove", checkSphere);
container.addEventListener("touchmove", handleTouchMove);
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleTouchMove(event) {
    var touches = event.changedTouches;
    for ( var i = 0; i < touches.length; i++){
        checkSphere(touches[i]);
    }
}

function checkSphere(event) {
    event.preventDefault();
    if (selectedObject) {
        selectedObject = null;
    }
    var intersects = getIntersects(event.layerX, event.layerY);
    if (intersects.length > 0) {
        var res = intersects.filter(function (res) {
            return res && res.object;
        })[0];
        if (res && res.object && res.object.velocity.y == 0) {
            selectedObject = res.object;
            selectedObject.velocity.y = 0.05;
            synth.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], "8n");
        }
    }
}

var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector3();
function getIntersects(x, y) {
    x = (x / window.innerWidth) * 2 - 1;
    y = - (y / window.innerHeight) * 2 + 1;
    mouseVector.set(x, y, 0.5);
    raycaster.setFromCamera(mouseVector, camera);
    return raycaster.intersectObject(ballGroup, true);
}
var vertices = geometry.vertices;
    for (var i = 0; i < vertices.length; i++){
        console.log(vertices[i].y)
    }
function animate() {

    var time = clock.getElapsedTime()

    light.position.x = Math.sin(time) * 10
    light.position.z = Math.cos(time) * 10
    light.lookAt(new THREE.Vector3(0,0,0))

    var vertices = geometry.vertices;
    for (var i = 0; i < vertices.length; i++){
        vertices[i].z = Math.sin(time+vertices[i].x);
    }

    geometry.verticesNeedUpdate = true;
    //raycaster.setFromCamera(mouse, camera);
    renderer.render(scene, camera);
    ballGroup.children.forEach(function (ball) {
        ball.position.y -= ball.velocity.y;
        if (ball.position.y < -4) {
            ballGroup.remove(ball);
            console.log(ballGroup.children.length);
        }
    });
    if (ballGroup.children.length == 0) {
        spawnBalls();
    }
    requestAnimationFrame(animate);
}

animate();