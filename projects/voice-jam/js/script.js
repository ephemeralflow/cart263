/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

//constants for the speech synthesizer and recognizer (making it that the program can then use it)
const speechSynthesizer = new p5.Speech();
const speechRecognizer = new p5.SpeechRec();

let listening = false;

let state = "title"
let mapImg;
let clownEnd1;
let microphone;

let endBG;

//setting up timers for the ending cards
let timer = 3;
let timer2 = 10;
let timerNeutralEnd = 4;
let timerGoodEnd = 7;
let endTimer = 2;

let bgFade = 0;

let showSubtitle = false;

//array for the clown object, hosting the dialogue that the clown would say not only at arrival but also when you say the wrong or right answer. The array also holds the clown's original position as well as the one it will stop at when it will start speaking. Finally, there is also the right answer as well for what the user is supposed to say
let script = [
    {
        clownStartX: -100,
        clownStopX: 250,
        clownSpeech: `Hello, I want to go to the store.`,
        correctResponse: `right forward`,
        successSpeech: `Thank you.`,
        failureSpeech: `Oh no.`
    },
    {
        clownStartX: -100,
        clownStopX: 250,
        clownSpeech: `Hello, I'm back, I want to go to the classroom.`,
        correctResponse: `right right left`,
        successSpeech: `Thank you.`,
        failureSpeech: `Oh no.`
    },
    {
        clownStartX: -100,
        clownStopX: 250,
        clownSpeech: `Hello, I'm back, I want to go to the library.`,
        correctResponse: `right right forward right`,
        successSpeech: `Thank you.`,
        failureSpeech: `Oh no.`
    },
    {
        clownStartX: -100,
        clownStopX: 250,
        clownSpeech: ` `,
        correctResponse: ` `,
        successSpeech: ` `,
        failureSpeech: ` `
    },
];

//Current scene is to know in which part o the array the game would be
let currentScene = 0;
//Clown mood is made for the endings, when there is a wrong answer it would make the mood go down, however, if it is the right answer 
let clownMood = 1;

//clown object itself, specifically for the speed of it's movement, it's placement. the image (that will then be loaded in) and also it's state that would then change depending on which part it is on
let clown = {
    x: 0,
    y: 200,
    speed: 2,
    image: undefined,
    state: "off-stage", // off-stage, entering, speaking, listening, replying, leaving
};

//Ending texts for the synthesizer to read out in the endings 
let goodEndScript = "Thank you for helping me all these days. I brought you a gift."
let neutralEndScript = "Hello, I need help with-"
let badEndScript = `hello again... Why would you keep giving me the wrong directions..? That was very rude...`
let endSceneLine = 0;




/**
Loads all the images needed for later
*/
function preload() {
    mapImg = loadImage('assets/images/mapTest.png');
    endBG = loadImage('assets/images/AdobeStock_415752572.jpeg');
    clown.image = loadImage('assets/images/clown.png');
    clownEnd1 = loadImage('assets/images/clownEnd1.png');
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

    //setting the voice of the synthesizer
    speechSynthesizer.setVoice("Google UK English Male")

    speechSynthesizer.onStart = () => {
        //makes it that when the clown speaks, subtitles will change to "true" making it that when the clown speaks, it will have what it says under it)
        showSubtitle = true;
    };

    //When the clown is not speaking, it will change states to it's respective state (such as listening for when the user speaks or leaving as it leaves the screen.)
    speechSynthesizer.onEnd = () => {
        //When the clown stops speaking, the subtitles will no longer show
        showSubtitle = false;

        switch (clown.state) {
            case "speaking":
                clown.state = "listening";
                break;

            case "replying":
                clown.state = "leaving";
                break;
        }
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
    //setting the background
    background(150, 50, 50)

    //Making that the display of the subtitles always exist and will run during the whole program no matter the state.
    displaySubtitles()

    //stating the states of the game itself 
    if (state === "title") {
        title();
    } else if (state === `simulation`) {
        simulation();
    }
    else if (state === `mapDisplay`) {
        mapDisplay();
    } else if (state === `endScene`) {
        endScene();
    }
}

function displaySubtitles() {

    //shows subtitles for when the clown is speaking
    if (showSubtitle && clown.state === "speaking") {
        push()
        textSize(20)
        textAlign(CENTER);
        text(script[currentScene].clownSpeech, width / 2, 400)
        pop()
    }

    if (showSubtitle && clown.state === "replying") {
        push()
        textSize(20)
        textAlign(CENTER);

        //converts whatever comes into the speech recognizer into lowercase
        let lowercase = speechRecognizer.resultString.toLowerCase();

        //if the user gives the correct answer, then it will show the text of what the clown said in the right answer
        if (lowercase === script[currentScene].correctResponse) {
            // They said the right thing
            text(script[currentScene].successSpeech, width / 2, 400)
        }
        //same as previous if statement, only that instead of the correct answer, the text for the wrong answer is shown
        else {
            // They said the wrong thing
            text(script[currentScene].failureSpeech, width / 2, 400)
        }
        pop()
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
    // push()
    // fill(100, 250, 100)
    // rect(0, 0, 130, 130)
    // pop()

    push()
    fill(0)
    textSize(20)
    stroke(255)
    text("Press UP key\nfor MAP.", 20, 40)
    pop()

    if (currentScene === 0) {
        push()
        fill(0)
        textSize(20)
        stroke(255)
        text("Day 1.", 430, 40)
        pop()
    }

    if (currentScene === 1) {
        push()
        fill(0)
        textSize(20)
        stroke(255)
        text("Day 2.", 430, 40)
        pop()
    }

    if (currentScene === 2) {
        push()
        fill(0)
        textSize(20)
        stroke(255)
        text("Day 3.", 430, 40)
        pop()
    }

    microphoneDisplay()
    clownMovement()
    displayClown();

    if (currentScene === 3) {
        state = "endScene";
    }
}

function mapDisplay() {
    //displays the map that is used furing the game
    push()
    imageMode(CORNER)
    image(mapImg, 0, 0, 530, 500);
    pop()
}

//buttons to show map
function keyPressed() {
    if (keyCode === DOWN_ARROW) {
        state = "simulation"
    } else if (keyCode === UP_ARROW) {
        state = "mapDisplay"
    }

    if (keyCode === 69) {
        currentScene++
    }
}

function clownMovement() {
    // Handle the clown based on what state they are in

    switch (clown.state) {
        case "off-stage":
            // Do nothing
            break;
        case "entering":
            clown.x += clown.speed;
            if (clown.x >= script[currentScene].clownStopX) {
                // The clown should stop and deliver its line
                clown.state = "speaking";
                // Say it!
                speechSynthesizer.speak(script[currentScene].clownSpeech);
            }
            break;
        case "listening":
            // Do nothing
            break;
        case "replying":
            // Do nothing
            break;
        case "leaving":
            clown.x += clown.speed;
            if (clown.x >= 600) {
                // The clown goes off stage
                currentScene++;
                setupScene();
            }
            break;
    }
}

function displayClown() {
    imageMode(CENTER)
    image(clown.image, clown.x, clown.y)
}

function mousePressed() {
    //Say something

    if (state === "title") {
        state = "simulation"
        currentScene = 0;
        setupScene();
    }
}

function setupScene() {
    clown.x = script[currentScene].clownStartX;
    clown.state = "entering"; // Bring on the clown...
}

function handleSpeechInput() {

    if (clown.state !== `listening` || !speechRecognizer.resultValue) {
        return;
    }

    console.log(speechRecognizer.resultString);

    let lowercase = speechRecognizer.resultString.toLowerCase();

    if (lowercase === script[currentScene].correctResponse) {
        // They said the right thing
        speechSynthesizer.speak(script[currentScene].successSpeech);
        clownMood = clownMood + 0.5;
    }
    else {
        // They said the wrong thing
        speechSynthesizer.speak(script[currentScene].failureSpeech);
        clownMood = clownMood - 0.5;
    }
    clown.state = `replying`;
}

function microphoneDisplay() {
    if (clown.state === `listening`) {
        image(microphone, 450, 100, 100, 100);
    }

    // push()
    // image(microphone, 450, 100, 100, 100)
    // pop()
}

function endScene() {
    push()
    imageMode(CORNER)
    image(endBG, 0, 0, 530, 500);
    pop()

    if (clownMood === 2.5) {
        if (frameCount % 60 == 0 && timer > 0) {
            timer--;
        }

        if (timer == 0) {
            imageMode(CORNER)
            image(clownEnd1, 0, 0, 500, 500);
            speechSynthesizer.speak(goodEndScript);
            endSceneLine++

            if (frameCount % 60 == 0 && timerGoodEnd > 0) {
                timerGoodEnd--;
            }
        }

        if (timerGoodEnd === 0) {
            speechSynthesizer.cancel()
            timer = 2
            fill(0, 0, 255, bgFade)
            bgFade += 20;
            rect(0, 0, 500, 500)
            textSize(20)
            fill(0)
            text("GOOD END", width / 2, height / 2)

            if (frameCount % 60 == 0 && endTimer > 0) {
                endTimer--;
            }
        }
    }

    if (clownMood >= 0 && clownMood <= 1.5) {
        if (frameCount % 60 == 0 && timer > 0) {
            timer--;
        }

        if (timer == 0) {
            imageMode(CORNER)
            image(clownEnd1, 0, 0, 500, 500);
            speechSynthesizer.speak(neutralEndScript);
            endSceneLine++

            if (frameCount % 60 == 0 && timerNeutralEnd > 0) {
                timerNeutralEnd--;
            }
        }

        if (timerNeutralEnd === 0) {
            speechSynthesizer.cancel()
            timer = 2
            fill(0, 255, 0, bgFade)
            bgFade += 20;
            rect(0, 0, 500, 500)
            textSize(20)
            fill(0)
            text("NEUTRAL END", width / 2, height / 2)

            if (frameCount % 60 == 0 && endTimer > 0) {
                endTimer--;
            }
        }
    }

    if (clownMood === -0.5) {
        if (frameCount % 60 == 0 && timer > 0) {
            timer--;
        }

        if (timer == 0) {
            imageMode(CORNER)
            image(clownEnd1, 0, 0, 500, 500);
            speechSynthesizer.speak(badEndScript);
            endSceneLine++

            if (frameCount % 60 == 0 && timer2 > 0) {
                timer2--;
            }
        }

        if (timer2 === 0) {
            speechSynthesizer.cancel()
            timer = 2
            fill(255, 0, 0, bgFade)
            bgFade += 20;
            rect(0, 0, 500, 500)
            textSize(20)
            fill(0)
            text("BAD END", width / 2, height / 2)

            if (frameCount % 60 == 0 && endTimer > 0) {
                endTimer--;
            }
        }
    }

    if (endTimer === 0) {
        noLoop()
    }

}

/*
- date plan A to Z (?) clown getting nice stuff for a date.... MAYBE????
- COMPUTER STUFFS "where is the background function?" CHANGING THE BG IF RIGHT DIRECTION???? next sound so just the sound o the synthesizer being lowered
- the idea that there is text for the user to say s its more intuintive that you are the one speaking so the idea that like we are like "i cant hear you" and the clown is like sorry and leaves and then comes back and is like sorry I lowere the sound it was bugging me
- giving the wrong answer and another person who came to the help desk being like you gave the wrong directions? are you dumb?
- the map getting a new text after like the second time the clown comes LIKE "DO NOT SAY" and if you do idk bad stuff happen^tm
*/