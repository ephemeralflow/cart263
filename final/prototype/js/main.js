/**
I actually don't know what to call this game
Scarlett Perez

A silly game where you help some random person with stuff because you have no life and also no way out and stuff.
*/

"use strict";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
        }
    },
    scene: [Boot, Menu, Play, Play2, Play3, Ending],
    antialias: false,
}

let game = new Phaser.Game(config)