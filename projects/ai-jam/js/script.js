/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

// This will store the image we drop onto the canvas
let img;

// changing the state to when it finished loading
const STATE = {
    STARTUP: `STARTUP`,
    DETECTING: `DETECTING`
};
let state = STATE.STARTUP;

/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
    // Create our canvas and store it in a variable
    let canvas = createCanvas(640, 480);
    // Tell the canvas to call gotImageFile() when the user drops
    // a file onto it
    canvas.drop(gotImageFile);

    objectDetector = ml5.objectDetector(`yolo`, modelLoaded);
}

/**
Loads the dropped file (assumes it's an image) into an HTML img
element and then runs Facemesh on the image
*/
function gotImageFile(file) {
    img = createImg(file.data, `User image`);
    img.size(width, height);
    img.hide();
}

function modelLoaded() {
    // switch state to detect
    state = STATE.DETECTING;
    objectDetector.detect(img, gotResult);
}

function gotResult(err, results) {
    if (err) {
        console.log(err);
    }
    console.log(results)
    objects = results;
}

/**
Description of draw()
*/
function draw() {
    switch (state) {
        case STATE.STARTUP:
            startup();
            break;
        case STATE.DETECTING:
            detecting();
            break;
    }

    conversation()
}

function startup() {
    background(0);

    push();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text(`Loading...`, width / 2, height / 2);
    pop();
}

/**
Shows the canvas or current image and current nose
*/
function detecting() {
    background(200, 127, 120);

    // If the user has dropped an image, show it
    if (img) {
        image(img, 0, 0, width, height);
    }
}

function conversation() {
    push()
    fill(255, 0, 100)
    rect(100, 100, 100, 100)

    pop()
}