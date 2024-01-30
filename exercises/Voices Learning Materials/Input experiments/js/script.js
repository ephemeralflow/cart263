/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

const speechRecognizer = new p5.SpeechRec();
let currentSpeech = "?";

let lightsAreOn = false;

/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
    createCanvas(500, 500)

    speechRecognizer.onResult = handleSpeechInput;
    speechRecognizer.continuous = true;
    speechRecognizer.start();
}


/**
Description of draw()
*/
function draw() {
    background(0)

    if (lightsAreOn) {
        background(255);
    }

    // textAlign(CENTER, CENTER)
    // textSize(24)
    // text("say that you love me", width / 2, height / 3);

    // text(currentSpeech, width / 2, height / 2)

}

function handleSpeechInput() {
    //currentSpeech = speechRecognizer.resultString;

    //if user says one thing machine reacts another
    // if (speechRecognizer.resultString === "I love you") {
    //     currentSpeech = "You're damn right you do"
    // } else {
    //     currentSpeech = ":'("
    // }

    console.log(speechRecognizer.resultString)
    if (speechRecognizer.resultString.toLowerCase() === "turn the lights on") {
        lightsAreOn = true
    } else if (speechRecognizer.resultString.toLowerCase() === "turn the lights off") {
        lightsAreOn = false
    }
}
