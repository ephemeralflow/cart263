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

        this.duck = this.physics.add.sprite(208, 165, `duck`).setImmovable(true);
        this.duck.setSize(34, 25, true)

        furniture.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, furniture);
        this.avatar.setCollideWorldBounds(true);

        this.npc4 = this.physics.add.sprite(120, 85, "npc4").setImmovable(true);
        this.npc4.setSize(10, 30, true);


        this.doorTrigger = this.physics.add.sprite(255, 40, "invisibleTrigger").setImmovable(true);
        this.physics.add.collider(this.avatar, this.doorTrigger, this.changeScene, null, this);
        this.physics.add.collider(this.avatar, this.npc4, this.displayNPC4Dialog, null, this);
        this.physics.add.collider(this.avatar, this.duck, this.displayDuckDialog, null, this);

        //Calls the function for the dialog boxes themselves
        this.displayDialogBoxes();

        //Calls the function for the text
        this.dialogBoxFunction();

        //Calls the function to display the location of the text
        this.displayTextLocations();

        //Calls the animation function as well as makes the default animations the idle ones for each character on the screen
        this.createAnimations();
        this.avatar.play(`idle`);
        this.npc4.play("idleNPC4")

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setZoom(2)
    }

    displayDialogBoxes() {
        this.testBox = this.add.image(240, 350, "testBox").setOrigin(0)
        this.testBox.setScrollFactor(0)
        this.testBox.setVisible(false);

        this.avatarIcon = this.add.image(245, 355, "avatarIcon").setOrigin(0)
        this.avatarIcon.setScrollFactor(0)
        this.avatarIcon.setVisible(false);

        this.yesButton = this.add.image(150, 260, "yesButton")
        this.yesButton.setVisible(false);

        this.duckDialog = this.add.image(155, 258, "duckDialog")
        this.duckDialog.setVisible(false);

        this.noButton = this.add.image(250, 260, "noButton")
        this.noButton.setVisible(false);
    }

    displayTextLocations() {
        this.dialogBoxNPC4.setScrollFactor(0)
        this.dialogBoxNPC4.setPosition(325, 350);

        this.dialogBoxDuck.setScrollFactor(0)
        this.dialogBoxDuck.setPosition(325, 350);
    }

    displayNPC4Dialog() {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.avatarIcon.setVisible(true);
        this.dialogBoxNPC4.setVisible(true);
        
        this.physics.pause();
    }

    displayDuckDialog() {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.avatarIcon.setVisible(true);
        this.dialogBoxDuck.setVisible(true);

        this.yesButton.setVisible(true);
        this.duckDialog.setVisible(true);
        this.noButton.setVisible(true);
        
        //Makes the "yes" word interactable so the player can press to take the duck, calling a function to destroy the duck item and also call the hideDialog function to exit out of the scene
        this.yesButton.setInteractive()
        this.yesButton.on("pointerdown", () => {
            this.getDuck()
            this.hideDialog()
        })

        //Makes the "no" word interactable so the player can press no to the duck and exit out of the dialog by calling the "hideDialog" function 
        this.noButton.setInteractive()
        this.noButton.on("pointerdown", () => {
            this.hideDialog()
        })
        
        this.physics.pause();
    }

    getDuck() {
        this.duck.destroy();
    }

    //Hides the dialog as well as resumes the physics so you can move again
    hideDialog() {
        this.testBox.setVisible(false);
        this.avatarIcon.setVisible(false);
        this.dialogBoxNPC4.setVisible(false);
        this.dialogBoxDuck.setVisible(false);
        this.yesButton.setVisible(false);
        this.duckDialog.setVisible(false);
        this.noButton.setVisible(false);
        this.physics.resume();
    }

    dialogBoxFunction() {
        //  Sets the appearance of the text shown
        const configStyle = {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
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
            text: "Hello? ...hm no\nresponse",
            style: configStyle
        };

        const duckInteraction = {
            text: "Cute duck...",
            style: configStyle
        };

        //sets the dialog box as well as the text goes in 
        this.dialogBoxNPC4 = this.make.text(npc4Interaction);
        this.dialogBoxNPC4.setVisible(false);

        this.dialogBoxDuck = this.make.text(duckInteraction);
        this.dialogBoxDuck.setVisible(false);
    }

    changeScene() {
        //Change the scene to another state
        this.scene.setVisible(false, "house")
        this.scene.setVisible(true, "act1")
        this.scene.resume("act1")
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