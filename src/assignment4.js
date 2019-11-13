import * as THREE from 'three'
import * as Tone from 'tone'

//new sketch: generate a bunch of objects that are affected by the mouse
//where if the mouse is hovering over it, the object sinks and disappears

var container = document.getElementById("container");
var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
camera.rotateX(Math.PI / 2);
camera.lookAt(new THREE.Vector3(0,0,0));

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

var geometry = new THREE.PlaneGeometry(10 * window.innerWidth, 10 * window.innerHeight);
var material = new THREE.MeshBasicMaterial({ color: 0x0ff000, side: THREE.DoubleSide });
var plane = new THREE.Mesh(geometry, material);
plane.rotateX(Math.PI / 2);
scene.add(plane);

var bgeometry = new THREE.SphereGeometry();
var bmaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
var ballGroup = new THREE.Group();
scene.add(ballGroup);

var numBalls = 15;
function spawnBalls(){
    for(var i=0; i<numBalls; i++){
        var ball = new THREE.Mesh(bgeometry,bmaterial);
        ball.position.x += THREE.Math.randFloat(-10,10);
        ball.position.z += THREE.Math.randFloat(-10,10);
        ballGroup.add(ball);
    }
}

spawnBalls();

function animate() {
    requestAnimationFrame(animate);
    //raycaster.setFromCamera(mouse, camera);
    renderer.render(scene, camera);
}

animate();