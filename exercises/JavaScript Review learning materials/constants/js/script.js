/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

// Constants defining our grid
const TILE_SIZE = 50;
const COLUMNS = 10;
const ROWS = 10;

/**
Description of preload
*/
function preload() {

}


// Creates the canvas
function setup() {
    // Define the canvas size in terms of the grid constants
    createCanvas(TILE_SIZE * COLUMNS, TILE_SIZE * ROWS);
}

// Draw a sparkling grid
function draw() {
    background(0);

    // Loop through each row
    for (let row = 0; row < ROWS; row++) {
        // Loop through each column
        for (let col = 0; col < COLUMNS; col++) {
            // Draw a tile at the current row and column
            drawTile(row, col);
        }
    }
}

// Draw a tile at the specified row and column
function drawTile(row, col) {
    // Calculate the x and y of the tile on the canvas
    // by multiplying by the tile size
    let x = row * TILE_SIZE;
    let y = col * TILE_SIZE;
    // Draw a random shaded tile sized square at that location
    push();
    noStroke();
    let grey = random(50, 200);
    fill(grey);
    rect(x, y, TILE_SIZE, TILE_SIZE);
    pop();
}