/**
Nah, Cuz Will I Ever Get Out Of Here?!?!?
Scarlett Perez

CREDITS ARE IN GAME!!! JUST LIKE M.A.N.T.I.S. ANATOMY!!!! Just in case I'll rewrite them here but the sprites themselves the background assets are from Penzilla and Cup Nooble while everything else was made by ME remind me to never make sprites again. Extra image from Dark Souls too—aka the death screen because it's iconic
As for the code, the whole phaser site, Pippin and Mathilde. With my honorable mention going to Foti as he helped me with the actual Tiled part of my game since nothing was working (collisions...)

A silly game where you help some random person with stuff because you have no life and also no way out and stuff.

little warning, I have no control on how it appears in your screen but I have realized that depending on how the pixels are formed, it can actually look a bit weird depending on your screen resolution????? I only noticed because I had a second screen for testing purposes and realized the sprites look weird, I have no way of fixing this currently :[

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