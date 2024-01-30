/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

const speechSynthesizer = new p5.Speech();

let showSubtitle = false;
let toSay = "I am in your walls"

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

    //Synthesis settings
    speechSynthesizer.setPitch(0.3);
    speechSynthesizer.setRate(0.5);
    speechSynthesizer.setVoice("Google UK English Male")


    speechSynthesizer.onStart = () => {
        showSubtitle = true;
    };

    speechSynthesizer.onEnd = () => {
        showSubtitle = false;
    };

    console.log(speechSynthesizer.listVoices());
}


/**
Description of draw()
*/
function draw() {
    background(227, 127, 111)

    if (showSubtitle) {
        textSize(30)
        text(toSay, 100, 100)
    }
}

function mousePressed() {
    //Say something
    speechSynthesizer.speak(toSay)
}
