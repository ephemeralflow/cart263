/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

const NUMBER_OF_ANIMAL_IMAGES = 10
const NUMBER_OF_ANIMALS_DISPLAYED = 100
const ANIMAL_IMAGE_PREFIX = "assets/images/animal";
const SAUSAGE_DOG_IMAGE = `assets/images/sausage-dog.png`;
let animalImages = [];
let animals = [];
let animalObject = [];
let sausageDog;
let sausageDogImage;

/**
Description of preload
*/
function preload() {
    for (let i = 0; i < NUMBER_OF_ANIMAL_IMAGES; i++) {
        let animalImage = loadImage(`${ANIMAL_IMAGE_PREFIX}${i}.png`);
        animalImages.push(animalImage);
    }

    sausageDogImage = loadImage(`${SAUSAGE_DOG_IMAGE}`);
}


/**
Description of setup
*/
function setup() {
    createCanvas(windowWidth, windowHeight)

    createAnimals();
    createSausageDog();
}

function createAnimals() {
    for (let i = 0; i < NUMBER_OF_ANIMALS_DISPLAYED; i++) {
        let animal = createRandomAnimal();
        animals.push(animal);
    }
}

function createRandomAnimal() {
    let x = random(0, width);
    let y = random(0, height);
    let animalImage = random(animalImages);
    let animal = new Animal(x, y, animalImage);
    return animal;
}

function createSausageDog() {
    let x = random(0, width);
    let y = random(0, height);
    sausageDog = new SausageDog(x, y, sausageDogImage);
}

/**
Description of draw()
*/
function draw() {
    background(255);
    update()
    updateSausageDog();
}

function update() {
    for (let i = 0; i < animals.length; i++) {
        // Update the current animal
        animals[i].update();
    }
}

function updateSausageDog() {
    sausageDog.update();
}

function mousePressed() {
    sausageDog.mousePressed();
}