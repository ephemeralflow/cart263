class Act1 extends Phaser.Scene {
    constructor() {
        super({
            key: "act1"
        })
    }

    create() {
        //Sets the camera of the scene + the physics so it will move
        this.cameras.main.setBounds(0, 0, 480 * 2, 480 * 2);
        this.physics.world.setBounds(0, 0, 480 * 2, 480 * 2);
        this.cameras.main.fadeIn(1000, 0, 0, 0)

        //Loading map tiles + layers
        let map = this.make.tilemap({ key: "mapTest" })

        let waterBase = map.addTilesetImage("Water", "waterImage");
        let water = map.createLayer("water", waterBase);

        let grassBase = map.addTilesetImage("Grass", "grassImage");
        let ground = map.createLayer("ground", grassBase, 0, 0);

        let dirtBase = map.addTilesetImage("Tilled_Dirt", "dirtImage");
        let dirt = map.createLayer("dirt", dirtBase, 0, 0);

        let bridgeBase = map.addTilesetImage("Wood_Bridge", "bridgeImage");
        let bridge = map.createLayer("bridge", bridgeBase, 0, 0);

        let plantsBase = map.addTilesetImage("Basic_Grass_Biom_things", "plantsImage");
        let plants = map.createLayer("plantLife", plantsBase, 0, 0);

        this.bridgeInteractionTrigger = this.physics.add.sprite(120, 250, `invisibleTrigger`);
        this.bridgeInteractionTrigger2 = this.physics.add.sprite(120, 300, `invisibleTrigger`);

        //Loads the fence layer + adds collisions between the avatar and fence
        let fencesBase = map.addTilesetImage("Fences", "fencesImage");
        let fence = map.createLayer("fenceLayer", fencesBase);
        

        //Loads the rope layer + adds collisions between the avatar and rope
        let ropeBase = map.addTilesetImage("Rope", "ropeImage");
        let rope = map.createLayer("ropeLayer", ropeBase);
        

        //Loads the first NPC image and the collision box as well as making it immovable
        this.npc1 = this.physics.add.sprite(250, 105, "npc1").setImmovable(true);
        this.npc1.setSize(10, 20, true)

        //Loads the second NPC image and the collision box as well as making it immovable
        this.npc2 = this.physics.add.sprite(400, 700, "npc2").setImmovable(true);
        this.npc2.setSize(10, 20, true)

        //Loads the fifth NPC image and the collision box as well as making it immovable
        this.npc5 = this.physics.add.sprite(700, 70, "npc5").setImmovable(true);
        this.npc5.setSize(10, 20, true)

        this.sign = this.physics.add.sprite(470, 105, "sign").setImmovable(true);
        this.sign.setSize(20, 20, true)
        this.door = this.physics.add.sprite(510, 80, "door").setImmovable(true);

        //Loading Avatar
        this.avatar = this.physics.add.sprite(150, 100, `avatar`);
        this.avatar.setSize(16, 20, true)

        //FENCE AND ROPE COLLISION WITH AVATAR
        fence.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, fence);
        rope.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, rope);

        // Called collectables as they were remnants from my game jam! Now they work the purpose to teleport you if you go through them so thats fun. Group just takes the key (as in the form—image it would take) and then the quantity.
        this.collectables = this.physics.add.group({
            key: 'tree',
            quantity: 9
        });

        //In here then we have it that the 9 collectable trees would appear between the specific coordinates I put down, I also have it to change color just because I felt like it and honestly it's kind of funny so I love it like this.
        this.collectables.children.each(function (collectable) {
            let x = Phaser.Math.Between(400, 600);
            let y = Phaser.Math.Between(700, 900);
            collectable.setPosition(x, y);
            collectable.setTint(`0x3333dd`);
        }, this);

        //Makes the lovely talking tree appear, putting it's location and making it immovable. "but why is it still blue?" because I think its silly goofy next question
        this.talkingTree = this.physics.add.sprite(100, 100, "tree").setImmovable(true).setTint(`0x3333dd`);

        //Adds the colliders between the avatar and different objects
        this.physics.add.collider(this.avatar, this.talkingTree, this.displayTreeDialog, null, this);

        //If the avatar collides with the NPC it will call for the function of displaying the NPC dialog
        this.physics.add.collider(this.avatar, this.npc1, this.displayNPC1Dialog, null, this);
        this.physics.add.collider(this.avatar, this.npc2, this.displayNPC2Dialog, null, this);
        this.physics.add.collider(this.avatar, this.npc5, this.displayNPC5Dialog, null, this);

        //If the avatar collides with the collectable plants, it will call for the collectItem function
        this.physics.add.overlap(this.avatar, this.collectables, this.collectItem, null, this);
        this.physics.add.collider(this.avatar, this.door, this.insideHouse, null, this);

        //When the avatar overlaps with the very beautiful invisible block I have put down on the bridge. It will call the dialog function of the bridge
        this.physics.add.overlap(this.avatar, this.bridgeInteractionTrigger, this.displayBridgeDialog, null, this);
        this.physics.add.overlap(this.avatar, this.bridgeInteractionTrigger2, this.displayBridgeDialog, null, this);

        //Same as previous only that this time it's with the sign
        this.physics.add.collider(this.avatar, this.sign, this.displaySignDialog, null, this);

        //Makes the gate itself and then the collision with the avatar that makes it that when the avatar collides with the gate it will display the dialog for the gate
        this.gate = this.physics.add.sprite(512, 165, `gate`).setImmovable(true);
        this.physics.add.collider(this.avatar, this.gate, this.displayGateDialog, null, this);

        //Calls the function for the dialog boxes themselves
        this.displayDialogBoxes()

        //Calls the function for the text
        this.dialogBoxFunction()

        //Calls the function to display the location of the text
        this.displayTextLocations()

        //Makes the default animations the idle ones for each character on the screen
        this.avatar.play(`idle`);
        this.npc1.play("npcIdle1", true)
        this.npc2.play("npcIdle2", true)
        this.npc5.play("npcIdle5", true)

        //Creates the cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        //Code for the camera to follow the avatar and also to be closer
        this.cameras.main.startFollow(this.avatar, true, 0.05, 0.05);
        this.cameras.main.setZoom(2)
    }

    //Function specifically for the dialog box as well as the icons, I put down the location, the scroll factor (that basically makes it that even when the camera moves, it will be in the same location, so it doesn't move with the camera per say) and finally the setVisible (display) as false so I can turn it on when I need it <3
    displayDialogBoxes() {
        this.testBox = this.add.image(240, 350, "testBox").setOrigin(0)
        this.testBox.setScrollFactor(0)
        this.testBox.setVisible(false);

        //I just want to add as a note that I made it the same tint as the actual in game sprite and it's SO UGLY but I love it and it's so out of place and that's fitting so um enjoy my very very blue tree
        this.treeIcon = this.add.image(45, 205, "treeIcon").setOrigin(0).setTint(`0x3333dd`)
        this.treeIcon.setVisible(false);

        this.avatarIcon = this.add.image(245, 355, "avatarIcon").setOrigin(0)
        this.avatarIcon.setScrollFactor(0)
        this.avatarIcon.setVisible(false);

        this.npc1Icon = this.add.image(245, 355, "npc1Icon").setOrigin(0)
        this.npc1Icon.setScrollFactor(0)
        this.npc1Icon.setVisible(false);

        this.npc2Icon = this.add.image(245, 355, "npc2Icon").setOrigin(0)
        this.npc2Icon.setScrollFactor(0)
        this.npc2Icon.setVisible(false);

        this.npc5Icon = this.add.image(245, 355, "npc5Icon").setOrigin(0)
        this.npc5Icon.setScrollFactor(0)
        this.npc5Icon.setVisible(false);
    }

    displayTextLocations() {
        this.dialogBoxNPC1.setScrollFactor(0)
        this.dialogBoxNPC1.setPosition(325, 350);

        this.dialogBoxNPC2.setScrollFactor(0)
        this.dialogBoxNPC2.setPosition(325, 350);

        this.dialogBoxNPC5.setScrollFactor(0)
        this.dialogBoxNPC5.setPosition(325, 350);

        this.dialogBoxGate.setScrollFactor(0) 
        this.dialogBoxGate.setPosition(325, 350);

        this.dialogBoxSign.setScrollFactor(0) 
        this.dialogBoxSign.setPosition(325, 350);

        this.bridgeInteractionBox.setScrollFactor(0) 
        this.bridgeInteractionBox.setPosition(325, 350);
    }

    changeScene() {
        //Change the scene to another state
        this.scene.start("act2");
    }

    insideHouse() {
        //pause the main act of the game (main area) to instead start the inside of the house instead. When you leave the house also move the avatar + 10 pixels in the y direction so the user wouldn't walk into the trigger again
        this.scene.pause("act1")
        this.scene.resume("house")
        this.scene.setVisible(false, "act1")
        this.avatar.y += 10
        this.scene.launch("house");
    }

    displayTreeDialog(avatar, talkingTree) {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.treeIcon.setVisible(true);
        this.dialogBox.setVisible(true);
        this.dialogBox.setPosition(110, 200);
        this.physics.pause();
    }

    displayGateDialog() {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.avatarIcon.setVisible(true);
        this.dialogBoxGate.setVisible(true);
        this.physics.pause();
    }

    displaySignDialog() {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.avatarIcon.setVisible(true);
        this.dialogBoxSign.setVisible(true);
        this.physics.pause();
    }

    displayBridgeDialog() {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.avatarIcon.setVisible(true);
        this.bridgeInteractionBox.setVisible(true);
        this.physics.pause();
    }

    displayNPC1Dialog(avatar, npc1) {
        //Displaying the dialog for the first NPC 
        this.testBox.setVisible(true);
        this.npc1Icon.setVisible(true);
        this.dialogBoxNPC1.setVisible(true);
        this.physics.pause();
    }

    displayNPC5Dialog(avatar, npc1) {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.npc5Icon.setVisible(true);
        this.dialogBoxNPC5.setVisible(true);
        this.gate.destroy()
        this.physics.pause();
    }

    displayNPC2Dialog(avatar, npc2) {
        //Displaying the dialog for the second NPC 
        this.testBox.setVisible(true);
        this.npc2Icon.setVisible(true);
        this.dialogBoxNPC2.setVisible(true);
        this.physics.pause();
        
    }

    //Hides the dialog as well as resumes the physics so you can move again
    hideDialog() {
        this.dialogBox.setVisible(false);
        this.dialogBoxNPC1.setVisible(false);
        this.dialogBoxNPC2.setVisible(false);
        this.dialogBoxNPC5.setVisible(false);
        this.testBox.setVisible(false);
        this.dialogBoxSign.setVisible(false);
        this.dialogBoxGate.setVisible(false);
        this.treeIcon.setVisible(false);
        this.avatarIcon.setVisible(false);
        this.npc1Icon.setVisible(false);
        this.npc2Icon.setVisible(false);
        this.npc5Icon.setVisible(false);
        this.bridgeInteractionBox.setVisible(false);
        this.physics.resume();
    }

    collectItem(avatar, item) {
        //Destroys the collectables
        item.destroy();

        //Displaying the dialog for the first NPC depending on how many collectables are still on screen
        if (this.collectables.countActive() >= 8) {
            this.cameras.main.fadeOut(1000, 0, 0, 0)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('act2')
            })
        }
    }

    update() {
        //Handles the input as in makes it that the camera will move with the avatar
        this.handleInput();
        if (this.vision) {
            this.vision.x = this.avatar.x;
            this.vision.y = this.avatar.y;
        }
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

    dialogBoxFunction() {
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
        const treeTalking = {
            text: 'hi im a tree',
            style: configStyle
        };

        const bridgeInteraction = {
            text: 'It seems the bridge \nis broken.',
            style: configStyle
        };

        const signText = {
            text: '... house.',
            style: configStyle
        };

        const gateText = {
            text: "It's locked.",
            style: configStyle
        };

        const npc1Talk = {
            text: 'Hello!!!',
            style: configStyle
        };

        const npc2Talk = {
            text: '...',
            style: configStyle
        };

        const npc5Talk = {
            text: "The gate's locked? \nI'll fix that",
            style: configStyle
        };

        //sets the dialog box as well as the text goes in 
        this.bridgeInteractionBox = this.make.text(bridgeInteraction);
        this.bridgeInteractionBox.setVisible(false);

        this.dialogBox = this.make.text(treeTalking);
        this.dialogBox.setVisible(false);

        this.dialogBoxSign = this.make.text(signText);
        this.dialogBoxSign.setVisible(false);

        this.dialogBoxGate = this.make.text(gateText);
        this.dialogBoxGate.setVisible(false);

        this.dialogBoxNPC1 = this.make.text(npc1Talk);
        this.dialogBoxNPC1.setVisible(false);

        this.dialogBoxNPC2 = this.make.text(npc2Talk);
        this.dialogBoxNPC2.setVisible(false);

        this.dialogBoxNPC5 = this.make.text(npc5Talk);
        this.dialogBoxNPC5.setVisible(false);
        
    }
}