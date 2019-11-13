import * as THREE from 'three'
import * as Tone from 'tone'
import { Geometry, MOUSE, Vector3, FloatType } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

var container = document.getElementById("container");
var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
//const controls = new OrbitControls(camera,container);

// create a new synth
const synth = new Tone.MembraneSynth().toMaster();

var geometry = new THREE.PlaneGeometry(10 * window.innerWidth, 10 * window.innerHeight);
var material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
var plane = new THREE.Mesh(geometry, material);
plane.visible = false;
scene.add(plane);

var geometry2 = new THREE.PlaneGeometry(100,100);
var material2 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide});
var plane2 = new THREE.Mesh(geometry2,material2);
plane2.rotateX(Math.PI / 2);
plane2.position.y -= 12;
scene.add(plane2);

var cubeGroup = new THREE.Group();
scene.add(cubeGroup);
//var cubes = [];
var cgeometry = new THREE.BoxGeometry(1, 1, 1);
//var cmaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

function spawnCube(x, y, z) {

    var cmaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        side: THREE.DoubleSide
    });

    var cube = new THREE.Mesh(cgeometry, cmaterial);
    cube.position.set(x, y, z);
    cube.scale.multiplyScalar(THREE.Math.randFloat(0.1, 1));
    cube.velocity = new THREE.Vector3(
        THREE.Math.randFloat(-1, 1),
        THREE.Math.randFloat(-1, 1),
        THREE.Math.randFloat(-1, 1)
    ).multiplyScalar(0.1);
    cube.rvelocity = new THREE.Vector3(
        THREE.Math.randFloat(-1, 1),
        THREE.Math.randFloat(-1, 1),
        THREE.Math.randFloat(-1, 1)
    ).multiplyScalar(0.05);
    cube.spawnTime = new Date();
    //cubes.push(cube);
    cubeGroup.add(cube);
    //console.log(cubes);
}

var MOUSEDOWN = false;
container.addEventListener("mousedown", function () {
    MOUSEDOWN = true;
});

container.addEventListener("mouseup", function () {
    MOUSEDOWN = false;
});

container.addEventListener("mousemove", function (e) {

    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    if (MOUSEDOWN) {
        raycaster.setFromCamera(mouse, camera);

        plane.visible = true;
        var intersects = raycaster.intersectObject(plane);
        plane.visible = false;

        var point = intersects[0].point;
        spawnCube(point.x, point.y, point.z);
    }
});

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/*document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}*/

function animate() {
    requestAnimationFrame(animate);
    //raycaster.setFromCamera(mouse, camera);
    renderer.render(scene, camera);
    cubeGroup.children.forEach(function (cube) {
        //cube.position.y -= 0.01;
        cube.position.add(cube.velocity);
        cube.rotation.x += cube.rvelocity.x;
        cube.rotation.y += cube.rvelocity.y;
        cube.rotation.z += cube.rvelocity.z;
        cube.velocity.y -= 0.01;
        if (cube.position.y <= plane2.position.y) {
            cube.position.y = plane2.position.y + 0.00001;
            cube.velocity.y *= -0.8;
            //cubeGroup.remove(cube);
            if (cube.position.x < 0) {
                if (cube.position.z < 0) {
                    synth.triggerAttackRelease("C2", "8n");
                }
                else {
                    synth.triggerAttackRelease("E2", "8n");
                }
            }
            else {
                if (cube.position.z < 0) {
                    synth.triggerAttackRelease("G2", "8n");
                }
                else {
                    synth.triggerAttackRelease("C3", "8n");
                }
            }
            
        }
        var currTime = new Date();
        if ((currTime - cube.spawnTime) / 1000 > 5) {
            cubeGroup.remove(cube);
            console.log(cubeGroup.children.length);
        }
    });
}

animate();