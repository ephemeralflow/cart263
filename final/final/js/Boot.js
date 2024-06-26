class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: "boot"
        })
    }

    preload() {
        //Loading Assets
        this.load.image("titleBG", "assets/images/mainMenu/menu.png")
        this.load.image("playButton", "assets/images/mainMenu/playButton.png")
        this.load.image("instructionButton", "assets/images/mainMenu/instructionButton.png")
        this.load.image("instructionPage", "assets/images/mainMenu/instructionPage.png")
        this.load.image("creditButton", "assets/images/mainMenu/creditsText.png")
        this.load.image("creditPage", "assets/images/mainMenu/creditPage.png")
        this.load.image("xButton", "assets/images/mainMenu/xButton.png")
        this.load.image("endingCard", "assets/images/mainMenu/endingCard.png")
        this.load.image("deathImage", "assets/images/mainMenu/death.jpg")
        this.load.image("playAgain", "assets/images/mainMenu/playAgain.png")
        this.load.image("clown", "assets/images/clown.png")

        //Loading the spritesheets for the main avatar and the NPCs
        this.load.spritesheet("avatar", "assets/images/avatar.png", {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 28,
        })

        this.load.spritesheet("avatarEnterSprite", "assets/images/avatarEnterAnim.png", {
            frameWidth: 32,
            frameHeight: 64,
            endFrame: 20,
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
        this.load.spritesheet("npc4", "assets/images/npc4.png", {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 1,
        })
        this.load.spritesheet("npc5", "assets/images/npc5.png", {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 1,
        })
        this.load.spritesheet("star", "assets/images/star.png", {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 8,
        })
        this.load.spritesheet("out", "assets/images/out.png", {
            frameWidth: 128,
            frameHeight: 64,
            endFrame: 15,
        })

        //load
        this.load.image("testIcon", "assets/images/testIcon.png")
        this.load.image("testBox", "assets/images/testBox1.png")
        this.load.image("treeIcon", "assets/images/treeIcon1.png")
        this.load.image("avatarIcon", "assets/images/avatarIcon.png")
        this.load.image("npc1Icon", "assets/images/npc1Icon.png")
        this.load.image("npc2Icon", "assets/images/npc2Icon.png")
        this.load.image("npc5Icon", "assets/images/npc5Icon.png")
        this.load.image("overlay", "assets/images/overlay.png")
        this.load.image("duck", "assets/images/duck.png")
        this.load.image("duck1", "assets/images/duck1.png")
        this.load.image("duckIcon", "assets/images/duckIcon.png")
        this.load.image("duckDialog", "assets/images/duckDialog.png")
        this.load.image("yesButton", "assets/images/yes.png")
        this.load.image("noButton", "assets/images/no.png")

        //Loading MAP images
        this.load.image("tree", "assets/images/Tree.png")
        this.load.image("gate", "assets/images/gate.png")
        this.load.image("sign", "assets/images/sign.png")
        this.load.image("door", "assets/images/door.png")
        this.load.image("invisibleTrigger", "assets/images/invisibleTrigger.png")
        this.load.image("invisibleTrigger1", "assets/images/invisibleTrigger1.png")
        this.load.image("notSoInvisibleTrigger", "assets/images/notSoInvisibleTrigger.png")

        this.load.image("grassImage", "assets/images/tilesImages/Grass.png")
        this.load.image("dirtImage", "assets/images/tilesImages/Tilled_Dirt.png")
        this.load.image("waterImage", "assets/images/tilesImages/Water.png")
        this.load.image("fencesImage", "assets/images/tilesImages/Fences.png")
        this.load.image("bridgeImage", "assets/images/tilesImages/Wood_Bridge.png")
        this.load.image("plantsImage", "assets/images/tilesImages/Basic_Grass_Biom_things.png")
        this.load.image("ropeImage", "assets/images/tilesImages/Rope.png")
        this.load.tilemapTiledJSON("mapTest", "assets/images/mapTest.json")

        //Loading Inside House MAP
        this.load.image("miscImage", "assets/images/tilesImages/TopDownHouse_SmallItems.png")
        this.load.image("doorImage", "assets/images/tilesImages/TopDownHouse_DoorsAndWindows.png")
        this.load.image("floorWallImage", "assets/images/tilesImages/TopDownHouse_FloorsAndWalls.png")
        this.load.image("furnitureImage", "assets/images/tilesImages/TopDownHouse_FurnitureState3.png")
        this.load.tilemapTiledJSON("innerHouse", "assets/images/insideHouse.json")

        this.load.on("complete", () => {
            this.scene.launch("menu");
        })
    }

    create() {
        this.createAnimations()
    }

    update() {

    }

    //Create the animations for the characters (such as idle and walking for the main avatar) and just idle in general. Also creates animations for misc stuff that would be used throughout the game
    createAnimations() {
        let idleAvatar = {
            key: `idle`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                start: 27,
                end: 28
            }),
            frameRate: 2,
            repeat: -1
        };
        this.anims.create(idleAvatar);

        let npcIdle1 = {
            key: "npcIdle1",
            frames: this.anims.generateFrameNumbers("npc1", { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1
        };
        this.anims.create(npcIdle1);

        let npcIdle2 = {
            key: "npcIdle2",
            frames: this.anims.generateFrameNumbers("npc2", { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1
        };
        this.anims.create(npcIdle2);

        let npcIdle5 = {
            key: "npcIdle5",
            frames: this.anims.generateFrameNumbers("npc5", { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1
        };
        this.anims.create(npcIdle5);

        let forwardAvatar = {
            key: `avatarWalkForward`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                start: 0,
                end: 8
            }),
            frameRate: 24,
            repeat: -1
        };
        this.anims.create(forwardAvatar);

        this.anims.create({
            key: "avatarWalkBack",
            frames: this.anims.generateFrameNumbers("avatar", { frames: [22, 23, 24, 25, 26] }),
            frameRate: 24,
            repeat: -1
        })

        let rightSideAvatar = {
            key: `avatarWalkSideRight`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                start: 9,
                end: 15
            }),
            frameRate: 16,
            repeat: -1
        };
        this.anims.create(rightSideAvatar);

        let leftSideAvatar = {
            key: `avatarWalkSideLeft`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                start: 16,
                end: 21
            }),
            frameRate: 16,
            repeat: -1
        };
        this.anims.create(leftSideAvatar);

        let outWords = {
            key: `outAnim`,
            frames: this.anims.generateFrameNumbers(`out`, {
                start: 0,
                end: 15
            }),
            frameRate: 8,
        };
        this.anims.create(outWords);

        this.anims.create({
            key: "idleNPC3",
            frames: this.anims.generateFrameNumbers("npc3", { frames: [0, 1, 2, 3] }),
            frameRate: 2,
            repeat: -1
        })

        this.anims.create({
            key: "starAnim",
            frames: this.anims.generateFrameNumbers("star", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: "idleNPC4",
            frames: this.anims.generateFrameNumbers("npc4", { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1
        })
    }
}