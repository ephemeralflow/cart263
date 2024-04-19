class Menu extends Phaser.Scene {
    constructor() {
        super({
            key: "menu"
        })
    }

    create() {
        //Loads the images in the title screen + it's respective locations
        this.add.image(0, 0, "titleBG").setOrigin(0)
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 50, "playButton")
        let instructionButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "instructionButton")
        let creditButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 150, "creditButton")

        //Makes the PLAY button interactive and makes it when you click on it wiht your cursor it will change the scene to the "play" one
        playButton.setInteractive()
        playButton.on("pointerdown", () => {
            this.scene.start("act1");
        })

        //Sets the instruction button to be interactive and then makes it that when it is clicked, for an image to appear (which are the instructions) as well as making another button appear (which is the "x" button) which is set to interactive as well. With what it does which is to hide the visibility of both the x button as well as the actual instruction page.
        instructionButton.setInteractive();
        instructionButton.on("pointerdown", () => {
            let instructionPage = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "instructionPage");
            let xButton = this.add.image(180, 80, "xButton");
            xButton.setInteractive();
            xButton.on("pointerdown", () => {
                instructionPage.visible = false;
                xButton.visible = false;
            });
        });

        //Same as the instruction button only for the credits button instead.
        creditButton.setInteractive();
        creditButton.on("pointerdown", () => {
            let creditPage = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "creditPage");
            let xButton = this.add.image(180, 80, "xButton");
            xButton.setInteractive();
            xButton.on("pointerdown", () => {
                creditPage.visible = false;
                xButton.visible = false;
            });
        });
    }

    update() {

    }
}