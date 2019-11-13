import * as THREE from 'three'
import * as Tone from 'tone'

// setup
var fft = new Tone.FFT(NUM_CHANNELS)
synth.connect(fft)
fmOsc.connect(fft)

// in update
var samples = fft.getValue()