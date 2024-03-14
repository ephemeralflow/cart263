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

        this.load.image("grassImage", "assets/images/tilesImages/Grass.png")
        this.load.image("waterImage", "assets/images/tilesImages/Water.png")
        this.load.image("fencesImage", "assets/images/tilesImages/Fences.png")
        this.load.image("bridgeImage", "assets/images/tilesImages/Wood_Bridge.png")
        this.load.image("miscImage", "assets/images/tilesImages/Basic_Grass_Biom_things.png")
        this.load.tilemapTiledJSON("mapTest", "assets/images/mapTest.json")

        this.load.on("complete", () => {
            this.scene.start("play");
        })
    }

    create() {

    }

    update() {

    }
}