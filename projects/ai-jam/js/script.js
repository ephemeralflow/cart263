/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

// The Facemesh face detector
let facemesh;
// This will store the image we drop onto the canvas
let img;

// For tracking whether Facemesh is ready or not
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

    // Start Facemesh
    objectDetector = ml5.objectDetector(`yolo`, modelLoaded);
}

/**
Loads the dropped file (assumes it's an image) into an HTML img
element and then runs Facemesh on the image
*/
function gotImageFile(file) {
    // Create an img element from the dropped file
    // (including alt text)
    img = createImg(file.data, `User image`);
    // Set its size so that Facemesh doesn't freak out
    // There may be some issues around mismatching dimensions here
    img.size(width, height);
    // Hide it because we don't want the HTML element visible
    img.hide();
}

/**
Called when Facemesh is ready, tells Facemesh what to do when
it detects a face
*/
function modelLoaded() {
    // We can switch states now
    state = STATE.DETECTING;
    // Tell Facemesh what to do when it gets a face
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

/**
Tells the user we're loading Facemesh
*/
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

    // Go through all the noses and display them
    for (let nose of noseData.noses) {
        push();
        textSize(48);
        textAlign(CENTER, CENTER);
        text(`👃`, nose.x, nose.y);
        pop();
    }
}

function conversation() {
    push()
    fill(255, 0, 100)
    rect(100, 100, 100, 100)

    pop()
}