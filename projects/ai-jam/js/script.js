/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
https://cocodataset.org/#explore
THE COCOSSD DATABASE TO KNOW WHAT IT CAN DETECT BECAUSE FLOWERS AINT ONE OF THEM
*/

"use strict";

// Current state of program
let state = `loading`; // loading, running
// This will store the image we drop onto the canvas
let img;
// The name of our model
let modelName = `CocoSsd`;
// ObjectDetector object (using the name of the model for clarify)
let cocossd;
// // The current set of predictions made by CocoSsd once it's running
// let predictions = undefined;

// The emoji mapping
let emojis = undefined;

//image name of NPC
let char;

let scene = 0;

let predictions = [];
let objects = ["rose"];

/**
Description of preload
*/
function preload() {
    emojis = loadJSON(`cocossd-emoji-mapping.json`);
    char = loadImage('assets/images/image(1).png');
}


/**
Description of setup
*/
function setup() {
    let canvas = createCanvas(500, 500);

    // Tell the canvas to call gotImageFile() when the user drops
    // a file onto it
    canvas.drop(gotImageFile);

    // Create out object detector
    cocossd = ml5.objectDetector('cocossd', modelReady);
}

function modelReady() {
    state = `running`;
}

/**
Loads the dropped file (assumes it's an image) into an HTML img
element and then runs object detection on the image
*/
function gotImageFile(file) {
    // Don't take the image file if the model isn't ready
    if (state !== `running`) {
        return;
    }

    // Create an img element from the dropped file
    // (including alt text)
    img = createImg(file.data, `User image`, ``, imageReady);
    // Hide it because we don't want the HTML element visible
    img.hide();
}

/**
Called when the image is actually ready
*/
function imageReady() {
    // There may be some issues around mismatching dimensions here
    img.size(width, AUTO);
    // Ask CocoSsd to detect objects, calls gotResults
    // if it finds something
    cocossd.detect(img, gotResults);
}

/**
Called when CocoSsd has detected at least one object in the video feed
*/
function gotResults(err, results) {
    // If there's an error, report it
    if (err) {
        console.error(err);
    }
    // Otherwise, save the results into our predictions array
    else {
        predictions = results;
    }
}

/**
Handles the two states of the program: loading, running
*/
function draw() {
    if (state === `loading`) {
        loading();
    }
    else if (state === `running`) {
        running();
    }
}

/**
Displays a simple loading screen with the loading model's name
*/
function loading() {
    background(255);

    push();
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(`Loading ${modelName}...`, width / 2, height / 2);
    pop();
}

/**
If there are currently objects detected it displays them as emoji
*/
function running() {
    background(0);
    characterTalk()
    console.log(predictions)

    if (predictions) {

        // If so run through the array of predictions
        for (let i = 0; i < predictions.length; i++) {
            // Get the object predicted
            let object = predictions[i];

            // Display it on the canvas
            // displayObject(object);

            if (predictions[i].label == "rose" && predictions[i].confidence > 0.5) {
                scene = 1;
            }

            if (predictions[i].label !== "rose" && predictions[i].confidence < 0.5) {
                scene = 2;
            }
        }
    }


}

// /**
// Provided with a detected object it draws an emoji representation of that object at its position.
// */
// function displayObject(object) {
//     // Get the emoji for this object label (from the JSON)
//     let emoji = emojis[object.label];

//     // There are a couple of objects I couldn't find good emoji for, so check first
//     if (emoji) {
//         push();
//         textAlign(CENTER, CENTER);
//         // Set the text size based on the height
//         // to scale
//         textSize(object.height);
//         // A little transparency for overlapping objects
//         fill(0, 200);
//         // Display the emoji in the centre of the detected object
//         text(emoji, object.x + object.width / 2, object.y + object.height / 2);
//         pop();
//     }
// }

function characterTalk() {
    push()
    imageMode(CENTER)
    image(char, 250, 250, 200, 200)
    fill(255)
    text(scenes[scene].text, 100, 100, 100, 100);
    pop()
}
