class Death extends Phaser.Scene {
    constructor() {
        super({
            key: "death"
        })
    }

    create() {
        //Loads the images in the title screen + it's respective locations
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.add.image(400, 200, "deathImage")
        let playAgain = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "playAgain")

        //Makes the PLAY button interactive and makes it when you click on it wiht your cursor it will change the scene to the "play" one
        playAgain.setInteractive()
        playAgain.on("pointerdown", () => {
            this.scene.start("act1");
        })
    }

    update() {

    }
}