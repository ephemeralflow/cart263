class House extends Phaser.Scene {
    constructor() {
        super({
            key: "house"
        })
    }

    create() {
        this.cameras.main.setBounds(-400, -500, 480 * 2, 480 * 2);
        this.physics.world.setBounds(10, 0, 295, 300);
        this.cameras.main.fadeIn(1000, 0, 0, 0)

        //Loading map tiles + layers
        let map = this.make.tilemap({ key: "innerHouse" })

        let floorWallBase = map.addTilesetImage("TopDownHouse_FloorsAndWalls", "floorWallImage");
        let floorWall = map.createLayer("base", floorWallBase, 0, 0);

        let doorBase = map.addTilesetImage("TopDownHouse_DoorsAndWindows", "doorImage");
        let doorWindow = map.createLayer("doorWindow", doorBase, 0, 0);

        let carpetBase = map.addTilesetImage("TopDownHouse_FurnitureState3", "furnitureImage");
        let carpet = map.createLayer("carpets", carpetBase, 0, 0);

        let furnitureBase = map.addTilesetImage("TopDownHouse_FurnitureState3", "furnitureImage");
        let furniture = map.createLayer("furniture", furnitureBase, 0, 0);

        let furniture1Base = map.addTilesetImage("TopDownHouse_SmallItems", "miscImage");
        let furniture1 = map.createLayer("furniture1", furniture1Base, 0, 0);

        //Loading Avatar
        this.avatar = this.physics.add.sprite(255, 90, `avatar`);
        this.avatar.setSize(16, 20, true)

        //Calls the animation function as well as makes the default animations the idle ones for each character on the screen
        this.createAnimations();
        this.avatar.play(`idle`);
        // this.npc4.play("idleNPC4", true)

        furniture.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, furniture);
        this.avatar.setCollideWorldBounds(true);

        this.npc4 = this.physics.add.sprite(120, 85, "npc4").setImmovable(true);
        this.npc4.setSize(10, 30, true)

        this.doorTrigger = this.physics.add.sprite(255, 40, "notSoInvisibleTrigger").setImmovable(true);
        this.physics.add.collider(this.avatar, this.doorTrigger, this.changeScene, null, this);
        // this.physics.add.collider(this.avatar, this.npc4, this.displayNPC4Dialog, null, this);

        // this.displayDialogBoxes()

        {
            //  Sets the appearance of the text shown
            const configStyle = {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',
                // backgroundColor: '#ff00ff',
                shadow: {
                    color: '#000000',
                    fill: true,
                    offsetX: 2,
                    offsetY: 2,
                    blur: 8
                }
            }

            //Sets the text of everything that speaks
            const npc4Interaction = {
                text: "The person isn't acknowledging your existance",
                style: configStyle
            };

            //sets the dialog box as well as the text goes in 
            this.npc4Box = this.make.text(npc4Interaction);
            this.npc4Box.setVisible(false);
        }

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setZoom(2)
    }

    // displayDialogBoxes() {
    //     this.testBox = this.add.image(0, 0, "testBox").setOrigin(0)
    //     this.testBox.setVisible(false);
    //     this.avatarIcon = this.add.image(305, 205, "avatarIcon").setOrigin(0)
    //     this.avatarIcon.setVisible(false);

    //     this.displayBoxLocations()
    // }

    // displayBoxLocations() {
    //     this.testBox.setScrollFactor(0)
    //     this.testBox.setPosition(240, 350);
    //     this.avatarIcon.setScrollFactor(0)
    //     this.avatarIcon.setPosition(245, 355);
    // }

    // displayNPC4Dialog(avatar, talkingTree) {
    //     // Display the dialog as well as pausing the physics so you can't move
    //     this.testBox.setVisible(true);
    //     this.treeIcon.setVisible(true);
    //     this.npc4Box.setVisible(true);
    //     this.npc4Box.setPosition(110, 200);
    //     this.physics.pause();
    // }

    changeScene() {
        //Change the scene to another state
        // this.cameras.main.fadeOut(1000, 0, 0, 0)
        // this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        //     // this.scene.start('arc1')
        //     // this.scene.launch('arc1', "house")
        //     // this.scene.setVisible(false, "house")
        //     // this.scene.setVisible(true, "arc1")
        //     // this.scene.remove("house")
        //     this.scene.launch('arc1')
        // })
        this.scene.setVisible(false, "house")
        this.scene.setVisible(true, "arc1")
        this.scene.resume("arc1")
        this.scene.pause("house")

    }

    update() {
        this.handleInput();
    }

    handleInput() {
        //When SPACE is pressed, call the hideDialog function
        if (this.cursors.space.isDown) {
            this.hideDialog();
        }

        //When any key (UP, DOWN, LEFT, RIGHT) is pressed, go in the direction that it calls, also play the animation of said direction
        if (this.cursors.left.isDown) {
            this.avatar.setVelocityX(-100);
            this.avatar.play('avatarWalkSideLeft', true);
        }
        else if (this.cursors.right.isDown) {
            this.avatar.setVelocityX(100);
            this.avatar.play('avatarWalkSideRight', true);
        }
        else {
            // If neither left or right are pressed, stop moving on x
            this.avatar.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.avatar.setVelocityY(-100);
            this.avatar.play('avatarWalkBack', true);
        }
        else if (this.cursors.down.isDown) {
            this.avatar.setVelocityY(100);
            this.avatar.play('avatarWalkForward', true);
        }
        else {
            // If neither up or down are pressed, stop moving on y
            this.avatar.setVelocityY(0);
        }


        if (this.avatar.body.velocity.x !== 0 || this.avatar.body.velocity.y !== 0) {
        }
        // Otherwise it's not moving so play the idle animation
        else {
            this.avatar.play(`idle`, true);
        }
    }

    //Create the animations for the characters (such as idle and walking for the main avatar)
    createAnimations() {
        this.anims.create({
            key: "idleNPC4",
            frames: this.anims.generateFrameNumbers("npc4", { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1
        })
    }
}