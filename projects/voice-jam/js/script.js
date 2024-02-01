/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

const speechSynthesizer = new p5.Speech();
const speechRecognizer = new p5.SpeechRec();

let listening = false;

let mapValues = {
    r: 100,
    g: 100,
    b: 120,
    a: 255,
}

let state = "simulation"
let mapImg;
let clownPNG;
let microphone;

let dialogue = 0;
let showSubtitle = false;

let person1Text = "hello, I want to go to the store"
let person1Success = "thank you"
let person1Failure = "oh no"

let person2Text = "hello, i'm back. I want to go to the classroom"

let day3Text = "hello, i'm back. I want to go to the office"

let showSubtitles = false;

let clownAppearance = false;
let clownLeave = false;

let clownPositionA = -100;
let clownPositionB = 250;
let clownPositionC = 600;



/**
Description of preload
*/
function preload() {
    mapImg = loadImage('assets/images/mapTest.png');
    clownPNG = loadImage('assets/images/clown.png');
    microphone = loadImage('assets/images/microphone.png');
}


/**
Description of setup
*/
function setup() {
    createCanvas(500, 500)


    //Synthesis settings
    speechSynthesizer.setPitch(0.3);
    speechSynthesizer.setRate(0.7);

    //I'm sorry I forgot how he sounds like so he can be bri'ish now
    //setting the voice of the synthesizer
    speechSynthesizer.setVoice("Google UK English Male")

    speechSynthesizer.onStart = () => {
        showSubtitle = true;
    };

    speechSynthesizer.onEnd = () => {
        showSubtitle = false;
        // startListening();
        listening = true;
    };

    //Speech recognizer
    speechRecognizer.onResult = handleSpeechInput;
    speechRecognizer.continuous = true;
    speechRecognizer.start();
}


/**
Description of draw()
*/
function draw() {
    background(150, 50, 50)
    console.log(speechRecognizer.resultString)
    console.log(dialogue)
    console.log(listening)

    displaySubtitles()

    if (state === "title") {
        title();
    } else if (state === `simulation`) {
        simulation();
    }
    else if (state === `mapDisplay`) {
        mapDisplay();
    } else if (state === `missionOne`) {
        missionOne();
    }
}

function displaySubtitles() {
    if (showSubtitle && dialogue === 1) {
        textSize(20)
        text(person1Text, 200, 400)
    }

    if (showSubtitle && dialogue === 3) {
        textSize(20)
        text(person2Text, 200, 400)
    }

    if (showSubtitle && dialogue === 5) {
        textSize(20)
        text(day3Text, 200, 400)
    }
}

//Displaying the whole title screen, its full of text and size and all of that, very straight forward.
function title() {
    push()
    fill(255)
    rect(0, 0, 500, 500)
    fill(102, 44, 44)
    textSize(40);
    textAlign(CENTER, CENTER);
    text(`WORKING AT\nTHE\nINFORMATION DESK`, width / 2, 100);
    textSize(20);
    text(`Instruction:`, width / 2, 210);
    textSize(15);
    textAlign(LEFT, CENTER);
    text(`Press the UP arrow to see the map (and down to put it away)\nClick to hear out the customer\nSpeak into the microphone when the microphone symbol appears\nAnswer by giving strict directional instructions`, 30, 260);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`Available directions to say:`, width / 2, 330);
    textSize(15);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(`LEFT`, 60, 380);
    text(`FORWARD`, width / 2, 360);
    text(`RIGHT`, 440, 380);
    textSize(15);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    text(`Say them wisely and guide properly.`, width / 2, 400);
    textStyle(BOLD);
    text(`Good Luck.`, 257, 420);
    textStyle(NORMAL);
    text(`and`, 200, 420);
    textSize(25);
    textStyle(BOLD);
    text(`PRESS ANYWHERE TO CONTINUE`, width / 2, 460);
    pop()
}

function simulation() {
    push()
    fill(100, 250, 100)
    rect(0, 0, 130, 130)
    pop()

    microphoneDisplay()

    missionOne()
    clownMovement()

}

function mapDisplay() {
    push()
    imageMode(CORNER)
    image(mapImg, 0, 0, 530, 500);
    pop()
}

//buttons to show map
function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        mapValues.r = 255
    } else if (keyCode === RIGHT_ARROW) {
        value = 0;
    } else if (keyCode === DOWN_ARROW) {
        mapValues.a = 0;
        state = "simulation"
    } else if (keyCode === UP_ARROW) {
        state = "mapDisplay"
    }

    if (keyCode === 69) {
        dialogue++
    }
}

function missionOne() {
    imageMode(CENTER)
    image(clownPNG, clownPositionA, height / 2)
}

function mousePressed() {
    //Say something

    if (state === "title") {
        state = "simulation"
    }

    if (dialogue === 0 && state === "simulation") {
        dialogue++
        speechSynthesizer.speak(person1Text)
    }

    if (dialogue === 2) {
        dialogue++
        speechSynthesizer.speak(person2Text)

    }

    if (dialogue === 4) {
        dialogue++
        speechSynthesizer.speak(day3Text)

    }
}

function handleSpeechInput() {

    if (!listening) {
        return;
    }
    //currentSpeech = speechRecognizer.resultString;

    // if user says one thing machine reacts another
    if (dialogue === 1 && speechRecognizer.resultString.toLowerCase() === "left forward") {
        dialogue++
        speechSynthesizer.speak(person1Success)
        listening = false;

    } else if (dialogue === 1 && speechRecognizer.resultString.toLowerCase() !== "left forward") {
        dialogue++
        speechSynthesizer.speak(person1Failure)
        listening = false;
    }

    if (dialogue === 3 && speechRecognizer.resultString.toLowerCase() === "left left right") {
        dialogue++
        speechSynthesizer.speak(person1Success)
        listening = false;

    } else if (dialogue === 3 && speechRecognizer.resultString.toLowerCase() !== "left forward") {
        dialogue++
        speechSynthesizer.speak(person1Failure)
        listening = false;
    }
}

function startListening() {
    listening = true;
    console.log("start listening now")
}

function microphoneDisplay() {
    if (listening === true) {
        push()
        image(microphone, 450, 100, 100, 100)
        pop()
    }

    // push()
    // image(microphone, 450, 100, 100, 100)
    // pop()
}

function clownMovement() {

    //Run 1
    //Clown appears on screen
    if (clownAppearance === false && (dialogue === 0 || dialogue === 3 || dialogue === 5)) {
        clownPositionA = clownPositionA + 5;
        clownPositionB = 250
    }

    if (clownPositionA > clownPositionB) {
        clownAppearance = true
    }

    //makes 0 position become 250 no matter what
    if (clownAppearance === true) {
        clownPositionA = clownPositionB
    }

    //makes 250 to move it more to 600 (C)
    if ((dialogue === 2 || dialogue === 4 || dialogue === 6) && clownLeave === false) {
        clownPositionB = clownPositionB + 5
    }

    if (clownPositionB > clownPositionC) {
        clownLeave = true
    }

    if (clownPositionB === clownPositionC && (dialogue === 2 || dialogue === 4)) {
        clownAppearance = false;
        clownLeave = false;
        clownPositionA = -100
        clownPositionB = 250
        clownPositionC = 600
    }

}