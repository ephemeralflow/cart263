/**
Working at the Information Desk
Scarlett Perez

Your job is to help a clown reach his destinations, with the help of a map, you can give him the good or bad answers depending on how you're feeling!
This is early early alpha of the game but it's mostly because everytime I tried to do something it just wouldn't work and completely collapse the program or just make it not listen and work anymore. This has been going on the whole week so I think this is a good alpha to give in as it's the last workable version of the game that I made slightly prettier from it's original last working version
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
Setting up the synthesizer and recognizer
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

        //Change the clown state on the end of the speech
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
        //makes sure the text is aligned to the center of the canvas
        textSize(20)
        textAlign(CENTER);

        //Converts whatever comes into the speech recognizer into lowercase
        let lowercase = speechRecognizer.resultString.toLowerCase();

        //If the user gives the correct answer, then it will show the text of what the clown said in the right answer
        if (lowercase === script[currentScene].correctResponse) {
            // They said the right thing
            text(script[currentScene].successSpeech, width / 2, 400)
        }
        //Same as previous if statement, only that instead of the correct answer, the text for the wrong answer is shown
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

    //reminder text that you can press the UP text for the map + it's display
    push()
    fill(0)
    textSize(20)
    stroke(255)
    text("Press UP key\nfor MAP.", 20, 40)
    pop()

    //A day counter that changes depending how many times the clown comes
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
        text("Day 5.", 430, 40)
        pop()
    }

    if (currentScene === 2) {
        push()
        fill(0)
        textSize(20)
        stroke(255)
        text("Day 23.", 430, 40)
        pop()
    }

    //Displaying the microphone and clown as well as activating the clown's movement
    microphoneDisplay()
    clownMovement()
    displayClown();

    //when scene reaches 3, change the state to the ending ones
    if (currentScene === 3) {
        state = "endScene";
    }
}

function mapDisplay() {
    //displays the map that is used during the game
    push()
    imageMode(CORNER)
    image(mapImg, 0, 0, 530, 500);
    pop()
}

function keyPressed() {
    //When the down arrow is pressed, call back the simulation state (after being in the map state)
    if (keyCode === DOWN_ARROW) {
        state = "simulation"
    }
    //When the up arrow is pressed, display the map
    else if (keyCode === UP_ARROW) {
        state = "mapDisplay"
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
    //Display the clown image with the X, Y coordinates previously mentioned
    imageMode(CENTER)
    image(clown.image, clown.x, clown.y)
}

function mousePressed() {
    //If the mouse is pressed in the title screen, change the state to simulation as well as make sure the counter of the scenes are at 0 and finally calling for the clown to appear.
    if (state === "title") {
        state = "simulation"
        currentScene = 0;
        setupScene();
    }
}

function setupScene() {
    //get the X value of the clown and bring the clown by changing it's state to "entering"
    clown.x = script[currentScene].clownStartX;
    clown.state = "entering";
}

function handleSpeechInput() {

    //If the clown isn't listening and there is nothing in the speech recognizer, do nothing
    if (clown.state !== `listening` || !speechRecognizer.resultValue) {
        return;
    }

    //just making it easier to write down the result string being in lowercase (to try to make the computer less confused)
    let lowercase = speechRecognizer.resultString.toLowerCase();

    //If the response given is the same as what would be the correct response to give to the clown, give the success speech as well as raise the mood of the clown
    if (lowercase === script[currentScene].correctResponse) {
        // They said the right thing
        speechSynthesizer.speak(script[currentScene].successSpeech);
        clownMood = clownMood + 0.5;
    }
    //However, if the opposite is given, make the clown respond negatively as well as drop the mood of the clown
    else {
        // They said the wrong thing
        speechSynthesizer.speak(script[currentScene].failureSpeech);
        clownMood = clownMood - 0.5;
    }
    //Finally, after all that, change the clown state to "replying"
    clown.state = `replying`;
}

function microphoneDisplay() {
    //When the clown is no longer speaking, the state would change to listening, making it that then a microphone icon would appear making it a visual cue for the user to know when they can speak.
    if (clown.state === `listening`) {
        image(microphone, 450, 100, 100, 100);
    }
}

function endScene() {
    //Add the ending CG
    push()
    imageMode(CORNER)
    image(endBG, 0, 0, 530, 500);
    textSize(20)
    fill(255)
    textAlign(CENTER)
    text("you are making your way home", width / 2, height / 2)
    pop()

    //GOOD END
    if (clownMood === 2.5) {

        //Start first timer that waits awhile before letting the clown speak
        if (frameCount % 60 == 0 && timer > 0) {
            timer--;
        }

        //When the previous counter reaches 0, start the clown good ending speech
        if (timer == 0) {
            imageMode(CORNER)
            image(clownEnd1, 0, 0, 500, 500);
            speechSynthesizer.speak(goodEndScript);

            //Start the good end timer, lets clown finish speaking to then execute the fade in
            if (frameCount % 60 == 0 && timerGoodEnd > 0) {
                timerGoodEnd--;
            }
        }

        //When the good end timer ends, stop the speech synthesizer (so it doesnt keep repeating) to then add a background fade in and good ending text
        if (timerGoodEnd === 0) {
            speechSynthesizer.cancel()
            timer = 2
            fill(0, 0, 255, bgFade)
            bgFade += 20;
            rect(0, 0, 500, 500)
            textSize(20)
            textAlign(CENTER)
            fill(0)
            text("GOOD END", width / 2, height / 2)

            //Start ending timer to let the fade in of the background happen but also for the eventual noLoop
            if (frameCount % 60 == 0 && endTimer > 0) {
                endTimer--;
            }
        }
    }

    //NEUTRAL END
    if (clownMood >= 0 && clownMood <= 1.5) {
        //Starts the timer
        if (frameCount % 60 == 0 && timer > 0) {
            timer--;
        }

        //when the timer hits 0, start the neutral end script
        if (timer == 0) {
            imageMode(CORNER)
            image(clownEnd1, 0, 0, 500, 500);
            speechSynthesizer.speak(neutralEndScript);

            //starts the neutral end timer
            if (frameCount % 60 == 0 && timerNeutralEnd > 0) {
                timerNeutralEnd--;
            }
        }

        //when timer finishes (around when the clown should finish speaking) cancel the speech, fade in new background, add ending text
        if (timerNeutralEnd === 0) {
            speechSynthesizer.cancel()
            timer = 2
            fill(0, 255, 0, bgFade)
            bgFade += 20;
            rect(0, 0, 500, 500)
            textSize(20)
            textAlign(CENTER)
            fill(0)
            text("NEUTRAL END", width / 2, height / 2)

            if (frameCount % 60 == 0 && endTimer > 0) {
                endTimer--;
            }
        }
    }

    //BAD ENDING
    if (clownMood === -0.5) {
        //Start timer
        if (frameCount % 60 == 0 && timer > 0) {
            timer--;
        }

        //When the first timer reaches 0, the clown will begin their bad ending speech.
        if (timer == 0) {
            //Display image
            imageMode(CORNER)
            image(clownEnd1, 0, 0, 500, 500);
            //Say the ending speech
            speechSynthesizer.speak(badEndScript);

            // start final counter of the game to let the clown finish as well as making the final ending card available.
            if (frameCount % 60 == 0 && timer2 > 0) {
                timer2--;
            }
        }

        if (timer2 === 0) {
            //stop the speech synthesizer when the final fade in happens of the ending sequence
            speechSynthesizer.cancel()
            //resets the main timer
            timer = 2
            //fill the background with the fade of the ending sequence
            fill(255, 0, 0, bgFade)
            //Add onto bgFade, adding on to the alpha layer of the background
            bgFade += 20;
            //add what would be the background as a full rectangle covering everything
            rect(0, 0, 500, 500)
            //Adding the ending text
            textSize(20)
            fill(0)
            textAlign(CENTER)
            text("BAD END", width / 2, height / 2)

            //Start the final timer to allow the background to fully fade in and stop the game.
            if (frameCount % 60 == 0 && endTimer > 0) {
                endTimer--;
            }
        }
    }

    //the moment that the final timer reaches zero, end the game
    if (endTimer === 0) {
        noLoop()
    }

}