/**
Sad and All That Jazz (Desperately Seeking Sadness) 
Author Name

some sad guy going hm i stay sad i hate :DDD things yeah
*/

"use strict";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade"
    },
    scene: [Boot, Play]
}

let game = new Phaser.Game(config)