import * as THREE from 'three'
import * as Tone from 'tone'

//new sketch: generate a bunch of objects that are affected by the mouse
//where if the mouse is hovering over it, the object sinks and disappears

var container = document.getElementById("container");
var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();


var phaser = new Tone.Phaser({
    "frequency": 15,
    "octaves": 5,
    "baseFrequency": 1000
}).toMaster();

var synth = new Tone.FMSynth().connect(phaser);
const notes = ["C3","D3","E3","F3","G3","A3","B3"];


var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
camera.position.y = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

var geometry = new THREE.PlaneGeometry(10 * window.innerWidth, 10 * window.innerHeight);
var material = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
var plane = new THREE.Mesh(geometry, material);
plane.rotateX(Math.PI / 2);
scene.add(plane);

var bgeometry = new THREE.SphereGeometry();
var bmaterial = new THREE.MeshBasicMaterial({ color: 0x00aaaa });
var ballGroup = new THREE.Group();
scene.add(ballGroup);

var numBalls = 15;
function spawnBalls() {
    for (var i = 0; i < numBalls; i++) {
        var ball = new THREE.Mesh(bgeometry, bmaterial);
        ball.position.x += THREE.Math.randFloat(-10, 10);
        ball.position.z += THREE.Math.randFloat(-12, 8);
        ball.velocity = new THREE.Vector3(0, 0, 0);
        ballGroup.add(ball);
    }
}

spawnBalls();

var selectedObject = null;
container.addEventListener("mousemove", function (event) {
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
            synth.triggerAttackRelease(notes[Math.floor(Math.random()*notes.length)], "8n");
        }
    }
});

var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector3();
function getIntersects(x, y) {
    x = (x / window.innerWidth) * 2 - 1;
    y = - (y / window.innerHeight) * 2 + 1;
    mouseVector.set(x, y, 0.5);
    raycaster.setFromCamera(mouseVector, camera);
    return raycaster.intersectObject(ballGroup,true);
}

function animate() {
    //raycaster.setFromCamera(mouse, camera);
    renderer.render(scene, camera);
    ballGroup.children.forEach(function (ball) {
        ball.position.y -= ball.velocity.y;
        if( ball.position.y < -4 ){
            ballGroup.remove(ball);
            console.log(ballGroup.children.length);
        }
    });
    if(ballGroup.children.length == 0){
        spawnBalls();
    }
    requestAnimationFrame(animate);
}

animate();