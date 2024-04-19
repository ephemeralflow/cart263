/**
I actually don't know what to call this game
Scarlett Perez

A silly game where you help some random person with stuff because you have no life and also no way out and stuff.

aha! This started as editing my gamejam but guess what! The only thing that really stayed was the sprites! Because I kind of added more and changed stuff around so... It's practically a new game now so um... yeah knew I had to mention that somewhere--
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
    scene: [Boot, Menu, Act1, House, Act2, Act3, Ending, Death],
    antialias: false,
}

let game = new Phaser.Game(config)