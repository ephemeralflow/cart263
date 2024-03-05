class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: "boot"
        })
    }

    preload() {
        //Loading Assets
        this.load.image("avatar", "assets/images/avatar.png")
        this.load.image("tree", "assets/images/Tree.png")

        this.load.on("complete", () => {
            this.scene.start("play");
        })
    }

    create() {

    }

    update() {

    }
}