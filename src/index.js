import * as THREE from 'three'
import * as Tone from 'tone'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

var container = document.getElementById("container");

function startAudio(){
    Tone.start();
    container.removeEventListener("mousedown",startAudio);
}
container.addEventListener("mousedown",startAudio);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const controls = new OrbitControls(camera,container);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var pingPong = new Tone.PingPongDelay("4n", 0.2).toMaster();
var drum = new Tone.MembraneSynth().connect(pingPong);

setInterval(function (){
    drum.triggerAttackRelease("C4", "32n");
}, 1000);

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
}

animate();

