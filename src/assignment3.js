import * as THREE from 'three'
import * as Tone from 'tone'

// setup
const NUM_CHANNELS = 32;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
var cubeGroup = new THREE.Group();
scene.add(cubeGroup);

for (var i = 0; i < NUM_CHANNELS; i++) {
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x += i - NUM_CHANNELS / 2;
    cubeGroup.add(cube);
}


//var fmOsc = new Tone.FMOscillator("Ab3", "sine", "square").toMaster().start();

var phaser = new Tone.Phaser({
    "frequency": 15,
    "octaves": 5,
    "baseFrequency": 1000
}).toMaster();

var synth = new Tone.FMSynth().connect(phaser);
// create an array of notes to be played
const notes = [
    "D3","D3","D4",null,"A3",null,null,"Ab3",null,"G3",null,"F3",null,"D3","F3","G3",
    "C3","C3","D4",null,"A3",null,null,"Ab3",null,"G3",null,"F3",null,"D3","F3","G3",
    "B2","B2","D4",null,"A3",null,null,"Ab3",null,"G3",null,"F3",null,"D3","F3","G3",
    "A#2","A#2","D4",null,"A3",null,null,"Ab3",null,"G3",null,"F3",null,"D3","F3","G3"
];

// create a new sequence with the synth and notes
const synthPart = new Tone.Sequence(
    function (time, note) {
        synth.triggerAttackRelease(note, "10hz", time);
    },
    notes,
    "16n"
);

var fft = new Tone.FFT(NUM_CHANNELS);
synth.connect(fft);
//fmOsc.connect(fft);
synthPart.start();
Tone.Transport.start();
// in update
function animate() {
    requestAnimationFrame(animate);
    //raycaster.setFromCamera(mouse, camera);
    var samples = fft.getValue();
    renderer.render(scene, camera);
    for (var i in samples) {
        //cubeGroup.children[i].scale.y = samples[i] / 10;
        cubeGroup.children[i].scale.y = THREE.Math.mapLinear(samples[i],-100,10,0,20);
    }
}

animate();