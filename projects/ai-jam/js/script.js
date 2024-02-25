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
// ObjectDetector object (using the name of the model for clarify)
let cocossd;

//variable to know at which scene the game is on (mostly for dialogue and to insert parts in certain scenes)
let scene = 0;

//Array to hold what predictions CocoSsd would have
let predictions = [];

//Sprite labels
let elyPensive;
let elySad;
let elySmile;
let elySob;
let elyHappyCry;

//Variable to hold the mood for the endings
let elyMood = 1;

/**
Pre-loading the images used later on
*/
function preload() {
    elyPensive = loadImage('assets/images/pensive.png');
    elySad = loadImage('assets/images/sad.png');
    elySmile = loadImage('assets/images/happy.png');
    elySob = loadImage('assets/images/sob.png');
    elyHappyCry = loadImage('assets/images/happycry.png');
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
    text(`Loading game...`, width / 2, height / 2);
    pop();
}

/**
Not only does it call for the character image and the text, it also makes it that when you insert an image object, to do a following command.
*/
function running() {

    //Sets up the background as well as the character functions
    background(180, 140, 150);
    characterTalk()

    if (predictions) {
        for (let i = 0; i < predictions.length; i++) {
            let object = predictions[i];

            //If the scene is 2, make it that it actually does read what you drag inside the game itself, depending on what you drag in, it will do a different thing such as change the scene to the respective scene/reaction of the character, but also change the mood of the character depending on the object given.
            if (scene === 2) {
                if (["potted plant", "vase"].includes(object.label) && object.confidence > 0.5) {
                    elyMood = elyMood + 0.5;
                    scene = 3;
                }
                else if (["teddy bear"].includes(object.label) && object.confidence > 0.5) {
                    elyMood = elyMood + 0.5;
                    scene = 4;
                }
                else if (!["teddy bear", "potted plant", "vase"].includes(object.label) && object.confidence > 0.5) {
                    elyMood = elyMood - 0.5;
                    scene = 5;
                }
            }

            if (scene === 9) {

                if (["teddy bear"].includes(object.label) && object.confidence > 0.5) {
                    elyMood = elyMood + 0.5;
                    scene = 10;
                }

                if (["dog", "cat", "bird"].includes(object.label) && object.confidence > 0.5) {
                    elyMood = elyMood + 0.5;
                    scene = 11;
                }

                if (["donut", "cake"].includes(object.label) && object.confidence > 0.5) {
                    elyMood = elyMood + 0.5;
                    scene = 12;
                }

                if (["pizza"].includes(object.label) && object.confidence > 0.5) {
                    elyMood = elyMood + 0.5;
                    scene = 13;
                }

                if (!["teddy bear", "dog", "cat", "bird", "donut", "cake", "pizza"].includes(object.label) && object.confidence && object.confidence > 0.5) {
                    elyMood = elyMood - 0.5;
                    scene = 14;
                }
            }
        }
    }

    //Empties the prediction array as to not have an error later on and skip a scene accidentally.
    predictions = [];
}

function characterTalk() {
    //Changes the font of the game
    textFont('Courier New');

    //Displays the cahracter and the text box
    push()
    characterSprite()
    fill(255, 255, 255, 150)
    rectMode(CENTER)
    rect(250, 430, 450, 100)
    pop()

    //Display the text inside the text box, also displays the hint part of the game
    push()
    fill(0)
    textSize(20)
    text(scenes[scene].text, 50, 385, 430, 100);
    fill(255)
    textSize(15)
    stroke(0)
    strokeWeight(2)
    textStyle(BOLD)
    textAlign(CENTER)
    text(scenes[scene].hint, 0, 20, 500, 100)
    pop()

    //Display the text and boxes for the choices offered
    if (scene === 1) {
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

    if (scene === 8) {
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

    if (scene === 6 || scene === 7) {
        push()
        fill(0)
        rect(0, 0, 500, 500)
        text(50)
        textAlign(CENTER)
        fill(255)
        text("Some time later...", 250, 250)
        pop()
    }

    //Call the ending sequence on top of everything
    ending()
}

/*
Display the character sprites depending on the scenes
*/
function characterSprite() {
    if (scene === 1 || scene === 5 || scene === 15) {
        imageMode(CENTER)
        image(elyPensive, width / 2, height / 2)
    }

    if (scene === 2 || scene === 9) {
        imageMode(CENTER)
        image(elySad, width / 2, height / 2)
    }

    if (scene === 3 || scene === 4 || scene === 17 || scene === 18) {
        imageMode(CENTER)
        image(elySmile, width / 2, height / 2)
    }

    if (scene === 8 || scene === 14 || scene === 20) {
        imageMode(CENTER)
        image(elySob, width / 2, height / 2)
    }

    if (scene >= 10 && scene <= 13) {
        imageMode(CENTER)
        image(elyHappyCry, width / 2, height / 2)
    }
}

function mousePressed() {

    //If the mouse is pressed on these scenes, go up one scene (in other words, the scene right after the one that it's on)
    if (scene === 0 || scene === 6 || scene === 7 || scene === 15 || scene === 17 || scene === 18 || scene === 20) {
        scene++
    }

    //if the mouse is pressed on either of these scenes (which are the ones after inserting an image) go to the scene that is after all of the above
    if (scene === 3 || scene === 4 || scene === 5) {
        scene = 6
    }

    //if the mouse is pressed during the final scenes in which you insert an image, the following endings can happen depending on the mood counter
    if (scene >= 10 && scene <= 14) {
        //If you got one wrong answer, you will get the neutral ending
        if (elyMood === 1) {
            scene = 15;
        }

        //If you got all good answers, you will get the good ending
        else if (elyMood === 2) {
            scene = 17;
        }

        //If you got all bad answers, you will get the bad ending
        else if (elyMood === 0) {
            scene = 20;
        };
    }

    //If you press the mouse in these specific scenes in these specific coordinates, you can press the (singular) choice
    if (mouseX >= 126 && mouseX <= 374 && mouseY >= 222 && mouseY <= 277 && (scene === 1 || scene === 8)) {
        scene++;
    }

}

/*
Ending cards, depending on the scene, you will get a different ending card
*/
function ending() {

    if (scene === 19) {
        push()
        fill(50, 0, 10)
        rectMode(CORNER)
        rect(0, 0, 500, 500)

        fill(255)
        textSize(50)
        textAlign(CENTER)
        text("GOOD END", width / 2, height / 2)
        pop()
    }

    if (scene === 16) {
        push()
        fill(0, 50, 10)
        rectMode(CORNER)
        rect(0, 0, 500, 500)

        fill(255)
        textSize(50)
        textAlign(CENTER)
        text("NEUTRAL END", width / 2, height / 2)
        pop()
    }

    if (scene === 21) {
        push()
        fill(10, 0, 50)
        rectMode(CORNER)
        rect(0, 0, 500, 500)

        fill(255)
        textSize(50)
        textAlign(CENTER)
        text("BAD END", width / 2, height / 2)
        pop()
    }
}