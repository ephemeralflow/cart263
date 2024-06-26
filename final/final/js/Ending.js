class Ending extends Phaser.Scene {
    constructor() {
        super({
            key: "ending"
        })
    }

    create() {
        //Loads the images in the title screen + it's respective locations
        this.add.image(0, 0, "endingCard").setOrigin(0)
        //I like adding the clown image somewhere in my game
        this.add.image(100, 500, "clown").setAlpha(0.3)
        //Adds the play again image
        let playAgain = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 200, "playAgain")

        //Makes the PLAY button interactive and makes it when you click on it wiht your cursor it will change the scene to the "play" one
        playAgain.setInteractive()
        playAgain.on("pointerdown", () => {
            this.scene.start("act1");
        })
    }

    update() {

    }
}