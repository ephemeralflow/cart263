class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: "boot"
        })
    }

    preload() {
        //Loading Assets

        this.load.on("complete", () => {
            this.scene.start("play");
        })
    }

    create() {

    }

    update() {

    }
}