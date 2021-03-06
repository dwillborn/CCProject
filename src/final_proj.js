import * as THREE from 'three'
import * as Tone from 'tone'

//new sketch: generate a bunch of objects that are affected by the mouse
//where if the mouse is hovering over it, the object sinks and disappears

var container = document.getElementById("container");
var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var score = 0;

document.getElementById('score').innerHTML = score;
// var texture = new THREE.Texture();
// texture.image = new THREE.TextureLoader().load('/textures/water.png')
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set(4, 4);

var bgSynth = new Tone.FMSynth().toMaster();
bgSynth.envelope.release = 8;
bgSynth.envelope.decay = 4;
var bgSynth1 = new Tone.FMSynth().toMaster();
bgSynth1.envelope.release = 8;
bgSynth1.envelope.decay = 4;
var bgSynth2 = new Tone.FMSynth().toMaster();
bgSynth2.envelope.release = 8;
bgSynth2.envelope.decay = 4;

const bgNotes = [
    "E3", null, "G3", null, "D3", null, "F3", null, "C3", null, "C3", null, "C3", null, "D3", null
]
const bgNotes1 = [
    "G3", null, "C4", null, "G3", null, "B3", null, "F3", null, "G3", null, "F3", null, "G3", null
]
const bgNotes2 = [
    "C4", null, "E4", null, "B3", null, "D4", null, "A3", null, "E3", null, "A3", null, "B3", null
]

var currNote = "E3"

const bgPart = new Tone.Sequence(
    function (time, note) {
        bgSynth.triggerAttackRelease(note, "10hz", time);
    },
    bgNotes,
    "1n"
).start();

const bgPart1 = new Tone.Sequence(
    function (time, note) {
        bgSynth1.triggerAttackRelease(note, "10hz", time);
    },
    bgNotes1,
    "1n"
).start();

const bgPart2 = new Tone.Sequence(
    function (time, note) {
        if (note != null)
            currNote = note;
        bgSynth2.triggerAttackRelease(note, "10hz", time);
    },
    bgNotes2,
    "1n"
).start();


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
synth.volume.value = -10;
const objNotes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3"];

var badSound = new Tone.PluckSynth().toMaster();


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
var material2 = new THREE.MeshStandardMaterial({ color: 0xff0000, side: 0 });
var material3 = new THREE.MeshStandardMaterial({ color: 0xffff00, side: 0 });
var material4 = new THREE.MeshStandardMaterial({ color: 0xffffff, side: 0 });
var material5 = new THREE.MeshStandardMaterial({ color: 0xff6600, side: 0 });
var material6 = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: 0 });
var material7 = new THREE.MeshStandardMaterial({ color: 0x6600ff, side: 0 });
var material8 = new THREE.MeshStandardMaterial({ color: 0x000000, side: 0 });
var planeMats = [material, material2, material3, material5, material6, material7];

var plane = new THREE.Mesh(geometry, material);
plane.velocity = new THREE.Vector3(0, 0, 0);
plane.receiveShadow = true;
plane.rotateX(-Math.PI / 2);
scene.add(plane);

var plane2 = new THREE.Mesh(geometry, material);
plane2.position.y = -1;
plane2.velocity = new THREE.Vector3(0, 0, 0);
plane2.receiveShadow = false;
plane2.rotateX(-Math.PI / 2);

var bgeometry = new THREE.OctahedronGeometry();
var bmaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 });
var bmaterial2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
var bmaterial3 = new THREE.MeshStandardMaterial({ color: 0x6600ff });
var bmaterial4 = new THREE.MeshStandardMaterial({ color: 0x000000 });
var bmaterial5 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
var bmaterial6 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
var bmaterial7 = new THREE.MeshStandardMaterial({ color: 0xffff00 });
var bmaterial8 = new THREE.MeshStandardMaterial({ color: 0xffffff });
var ballMats = [bmaterial, bmaterial2, bmaterial3, bmaterial5, bmaterial6, bmaterial7];
var ballGroup = new THREE.Group();
//var badBalls = new THREE.Group();
scene.add(ballGroup);

var clock = new THREE.Clock()
var counter = 0;

var light = new THREE.DirectionalLight();
light.position.set(0, 20, 0);
light.lookAt(new THREE.Vector3(0, 0, 0));
light.castShadow = true;
scene.add(light);
console.log(light);

light.shadow.bias = -0.001;
light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;    // default
light.shadow.camera.far = 500;     // default
light.shadow.camera.left = -20;    // default
light.shadow.camera.right = 20;     // default
light.shadow.camera.top = -20;    // default
light.shadow.camera.bottom = 20;     // default

var numBalls = 15;
var ballcount = numBalls;
var numBad = 5;
function spawnBalls() {
    for (var i = 0; i < numBalls; i++) {
        var ball = new THREE.Mesh(bgeometry, ballMats[counter % 6]);
        ball.position.x += THREE.Math.randFloat(-10, 10);
        ball.position.y += 2;
        ball.position.z += THREE.Math.randFloat(-12, 8);
        ball.velocity = new THREE.Vector3(0, 0, 0);
        ball.rvelocity = new THREE.Vector3(0, 0.05, 0);
        ball.castShadow = true;
        ball.receiveShadow = true;
        ballGroup.add(ball);
    }
    for (var i = 0; i < numBad; i++) {
        var ball = new THREE.Mesh(bgeometry, bmaterial4);
        ball.position.x += THREE.Math.randFloat(-10, 10);
        ball.position.y += 2;
        ball.position.z += THREE.Math.randFloat(-12, 8);
        ball.velocity = new THREE.Vector3(0, 0, 0);
        ball.rvelocity = new THREE.Vector3(0, 0.05, 0);
        ball.castShadow = true;
        ball.receiveShadow = true;
        ballGroup.add(ball);
    }
}

spawnBalls();

function respawnAll() {
    plane2.material = plane.material;
    scene.add(plane2);

    plane.position.y = 12.75;
    plane.material = planeMats[counter % 6];
    plane.velocity = new THREE.Vector3(0, 0.5, 0);

    
    ballGroup.children.forEach(function (ball) {
        if(ball.material.color.getHex() == 0x000000)
            ballGroup.remove(ball);
    });
   

    for (var i = 0; i < numBalls; i++) {
        var ball = new THREE.Mesh(bgeometry, ballMats[counter % 6]);
        ball.position.x += THREE.Math.randFloat(-10, 10);
        ball.position.y += 14.75;
        ball.position.z += THREE.Math.randFloat(-12, 8);
        ball.velocity = new THREE.Vector3(0, 0.5, 0);
        ball.rvelocity = new THREE.Vector3(0, 0.05, 0);
        ball.castShadow = true;
        ball.receiveShadow = true;
        ballGroup.add(ball);
    }
    for (var i = 0; i < numBad; i++) {
        var ball = new THREE.Mesh(bgeometry, bmaterial4);
        ball.position.x += THREE.Math.randFloat(-10, 10);
        ball.position.y += 14.75;
        ball.position.z += THREE.Math.randFloat(-12, 8);
        ball.velocity = new THREE.Vector3(0, 0.5, 0);
        ball.rvelocity = new THREE.Vector3(0, 0.05, 0);
        ball.castShadow = true;
        ball.receiveShadow = true;
        ballGroup.add(ball);
    }

    ballcount = numBalls;
}

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
    for (var i = 0; i < touches.length; i++) {
        checkSphere(touches[i]);
    }
}

//var compareColor = new THREE.Color(0x000000);

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
            if (selectedObject.material.color.getHex() == 0x000000) {
                //play sour note
                badSound.triggerAttackRelease("C3","8n");
                score -= 300;
                document.getElementById('score').innerHTML = score;
            }
            else {
                synth.triggerAttackRelease(currNote, "16n");
                score += 100;
                document.getElementById('score').innerHTML = score;
            }
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
for (var i = 0; i < vertices.length; i++) {
    console.log(vertices[i].y)
}

Tone.Transport.start();

function animate() {

    var time = clock.getElapsedTime()

    light.position.x = Math.sin(time / 10) * 10
    light.position.z = Math.cos(time / 10) * 10
    light.lookAt(new THREE.Vector3(0, 0, 0))

    var vertices = geometry.vertices;
    for (var i = 0; i < vertices.length; i++) {
        vertices[i].z = Math.sin(time + vertices[i].x);
    }
    renderer.render(scene, camera);

    ballGroup.children.forEach(function (ball) {
        ball.rotation.y += ball.rvelocity.y;
    });

    if (plane.velocity.y > 0) {
        plane.position.y -= plane.velocity.y;
        plane.velocity.y -= 0.01;
        ballGroup.children.forEach(function (ball) {
            if (ball.velocity.y > 0) {
                ball.position.y -= ball.velocity.y;
                ball.velocity.y -= 0.01;
            }
        });
    }
    else {
        if (plane.position.y < 0 || plane.velocity.y != 0) {
            plane.position.y = 0;
            plane.velocity.y = 0;
            ballGroup.children.forEach(function (ball) {
                ball.position.y = 2;
                ball.velocity.y = 0;
            });
        }
        else {
            ballGroup.children.forEach(function (ball) {
                ball.position.y -= ball.velocity.y;
                if (ball.position.y < -4) {
                    ballGroup.remove(ball);
                    if (ball.material.color.getHex() != 0x000000) {
                        //play sour note
                        ballcount--;
                    }
                    console.log(ballGroup.children.length);
                }
            });
        }

    }

    if (plane.position.y <= 2 && plane2 in scene.children) {
        scene.remove(plane2);
        //plane2.material = planeMats(plane.material);
    }
    // if( plane.position.y <= 0){
    //     plane.position.y = 0;
    //     plane.velocity.y = 0;
    //     ballGroup.children.forEach(function (ball) {
    //         ball.position.y = 2;
    //         ball.velocity.y = 0;
    //     });
    // }

    geometry.verticesNeedUpdate = true;
    //raycaster.setFromCamera(mouse, camera);
    // ballGroup.children.forEach(function (ball) {
    //     ball.position.y -= ball.velocity.y;
    //     if (ball.position.y < -4) {
    //         ballGroup.remove(ball);
    //         console.log(ballGroup.children.length);
    //     }
    // });
    if (ballcount == 0) {
        counter++;
        respawnAll();
    }
    requestAnimationFrame(animate);
}

animate();