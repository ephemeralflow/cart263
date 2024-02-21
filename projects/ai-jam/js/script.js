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
let objects = ["teddy bear", "cat", "dog", "bird", "person"];

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

        // // If so run through the array of predictions
        // for (let i = 0; i < predictions.length; i++) {
        //     // Get the object predicted
        //     let object = predictions[i];

        //     if (object.label == ("dog" || "cat" || "bird") && object.confidence > 0.5) {
        //         scene = 3;
        //     }

        //     if (object.label == "person" && object.confidence > 0.5) {
        //         scene = 4;
        //     }
        // }
        for (let i = 0; i < predictions.length; i++) {
            let object = predictions[i];

            if (scene === 1) {
                if (object.label == ("potted plant" || "vase") && object.confidence > 0.5) {
                    scene = 2;
                }//or vase.........

                if (object.label == "teddy bear" && object.confidence > 0.5) {
                    scene = 3;
                }

                if (object.label !== ("teddy bear" || "potted plant" || "vase") && object.confidence > 0.5) {
                    scene = 4;
                }
            }

            if (scene === 8) {

                if (object.label == ("dog" || "cat" || "bird") && object.confidence > 0.5) {
                    scene = 9;
                }

                if (object.label == ("donut" || "cake") && object.confidence > 0.5) {
                    scene = 10;
                }

                if (object.label == "pizza" && object.confidence > 0.5) {
                    scene = 11;
                }

                if (object.label !== ("dog" || "cat" || "bird" || "donut" || "cake" || "pizza") && object.confidence > 0.5) {
                    scene = 12;
                }
            }


        }



    }
}

function characterTalk() {
    textFont('Courier New');

    push()
    fill(255, 255, 255, 150)
    rectMode(CENTER)
    rect(250, 430, 450, 100)
    pop()
    push()
    imageMode(CENTER)
    image(char, 250, 250, 200, 200)
    fill(0)
    textSize(20)
    text(scenes[scene].text, 50, 400, 430, 100);
    fill(255)
    textSize(15)
    text(scenes[scene].hint, 30, 360, 450, 100)
    pop()

    if (scene === 0) {
        push();
        fill(255, 255, 255, 150);
        rectMode(CENTER);
        strokeWeight(2)
        rect(width / 2, height / 2, 250, 55);
        fill(0)
        textAlign(CENTER)
        textSize(20)
        text("What's wrong?", width / 2, 255)
        pop();
    }

    if (scene === 7) {
        push();
        fill(255, 255, 255, 150);
        rectMode(CENTER);
        strokeWeight(2)
        rect(width / 2, height / 2, 250, 55);
        fill(0)
        textAlign(CENTER)
        textSize(20)
        text("Are you okay?", width / 2, 255)
        pop();
    }

    if (scene === 5 || scene === 6) {
        push()
        fill(0)
        rect(0, 0, 500, 500)
        text(50)
        textAlign(CENTER)
        fill(255)
        text("Some time later...", 250, 250)
        pop()
    }
}

function mousePressed() {

    if (mouseX >= 126 && mouseX <= 374 && mouseY >= 222 && mouseY <= 277 && (scene === 0 || scene === 7)) {
        scene++;
    }

    if (scene === 2 || scene === 3 || scene === 4) {
        scene = 5
    }

    if (scene === 5 || scene === 6) {
        scene++
    }
}
