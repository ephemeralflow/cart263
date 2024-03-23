class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: "boot"
        })
    }

    preload() {
        //Loading Assets
        this.load.image("titleBG", "assets/images/AdobeStock_501202742.jpg")
        this.load.image("playButton", "assets/images/playButton.png")
        this.load.image("instructionButton", "assets/images/instructionButton.png")
        this.load.image("instructionPage", "assets/images/instructionPage.png")
        this.load.image("xButton", "assets/images/xButton.png")
        this.load.image("endingCard", "assets/images/endingCard.png")
        this.load.image("playAgain", "assets/images/playAgain.png")

        //Loading the spritesheets for the main avatar and the NPCs
        this.load.spritesheet("avatar", "assets/images/avatar.png", {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 28,
        })
        this.load.spritesheet("npc1", "assets/images/npc1.png", {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 1,
        })
        this.load.spritesheet("npc2", "assets/images/npc2.png", {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 1,
        })
        this.load.spritesheet("npc3", "assets/images/npc3.png", {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 3,
        })
        this.load.spritesheet("star", "assets/images/star.png", {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 8,
        })

        //Loading MAP images
        this.load.image("tree", "assets/images/Tree.png")
        this.load.image("door", "assets/images/door.png")
        this.load.image("invisibleTrigger", "assets/images/invisibleTrigger.png")

        this.load.image("grassImage", "assets/images/tilesImages/Grass.png")
        this.load.image("waterImage", "assets/images/tilesImages/Water.png")
        this.load.image("fencesImage", "assets/images/tilesImages/Fences.png")
        this.load.image("bridgeImage", "assets/images/tilesImages/Wood_Bridge.png")
        this.load.image("plantsImage", "assets/images/tilesImages/Basic_Grass_Biom_things.png")
        this.load.image("ropeImage", "assets/images/tilesImages/Rope.png")
        this.load.tilemapTiledJSON("mapTest", "assets/images/mapTest.json")


        this.load.on("complete", () => {
            this.scene.start("menu");
        })
    }

    create() {

    }

    update() {

    }
}