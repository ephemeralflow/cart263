class Boot extends Phaser.Scene {

    constructor() {
        super({
            key: `boot`
        });
    }

    preload() {
        this.load.image(`wall`, `assets/images/wall.png`);

        // NOTE: Here's how to load a simple sprite sheet using the loader's
        // .spritesheet() method.
        // The parameters are
        // - The key we will use to refer to this sprite sheet
        // - The image file containing the sprite sheet
        // - A configuration object specifying at least
        //   - the dimensions of an individual frame of the animation via
        //     frameWidth and frameHeight properties
        //   - the final frame number (counting from 0) so the loader knows
        //     how many frames are in the image
        // EXAMPLE: https://phaser.io/examples/v3/view/loader/sprite-sheet/load-sprite-sheet
        this.load.spritesheet(`avatar`, `assets/images/avatar.png`, {
            // Our animation uses 32x32 pixel frames
            frameWidth: 32,
            frameHeight: 32,
            // Our animation has 4 frames, so the final frame number is 3, counting from 0
            endFrame: 3
        });

        this.load.on('complete', () => {
            this.scene.start(`play`);
        });
    }

    create() {
        let loadingTextStyle = {
            fontFamily: "sans-serif",
            fontSize: "40px",
            fill: "#ffffff",
            align: "center"
        };
        let loadingString = `Loading...`;
        this.loadingText = this.add.text(100, 100, loadingString, loadingTextStyle);
    }

    update() {

    }
}