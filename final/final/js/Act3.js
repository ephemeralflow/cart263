class Act3 extends Phaser.Scene {
    constructor() {
        super({
            key: "act3"
        })
    }

    create() {
        //Sets the camera of the scene + the physics so it will move
        this.cameras.main.setScroll(-400, -300);
        this.physics.world.setBounds(0, 0, 480 * 2, 480 * 2);
        this.cameras.main.fadeIn(1000, 0, 0, 0)

        //Loading map tiles + layers
        let map = this.make.tilemap({ key: "mapTest" })

        let waterBase = map.addTilesetImage("Water", "waterImage");
        let water = map.createLayer("water", waterBase,-100,-100);

        let grassBase = map.addTilesetImage("Grass", "grassImage");
        let ground = map.createLayer("ground", grassBase, 0, 0);

        let dirtBase = map.addTilesetImage("Tilled_Dirt", "dirtImage");
        let dirt = map.createLayer("dirt", dirtBase, 0, 0);

        let bridgeBase = map.addTilesetImage("Wood_Bridge", "bridgeImage");
        let bridge = map.createLayer("bridge", bridgeBase, 0, 0);

        let plantsBase = map.addTilesetImage("Basic_Grass_Biom_things", "plantsImage");
        let plants = map.createLayer("plantLife", plantsBase, 0, 0);

        //Loads the fence layer
        let fencesBase = map.addTilesetImage("Fences", "fencesImage");
        let fence = map.createLayer("fenceLayer", fencesBase);
        
        //Loads the rope layer
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

        //Displays the avatar itself as well as stopping the physics of the game for the animation of the avatar coming into the game can finish before the user can move
        this.avatar = this.physics.add.sprite(150, 100, `avatar`);
        this.avatar.setSize(10, 20, true)
        this.physics.pause();
        
        //Loads the gate image as well as making it that if the avatar and the gate collide that the dialog for the gate gets displayed
        this.gate = this.physics.add.sprite(512, 165, `gate`).setImmovable(true);
        this.physics.add.collider(this.avatar, this.gate, this.displayGateDialog, null, this);

        //Animation for the entering part of the scene
        let avatarEnterAnimation = {
            key: `avatarEnterAnimationKey`,
            frames: this.anims.generateFrameNumbers(`avatarEnterSprite`, {
                start: 0,
                end: 20
            }),
            frameRate: 12,
        };
        this.anims.create(avatarEnterAnimation);

        //Puts in the sprite for the animation and play it
        this.avatarEnterAnim = this.physics.add.sprite(150, 84, "avatarEnterSprite").setImmovable(true);
        this.avatarEnterAnim.setSize(10, 20, true)
        this.avatarEnterAnim.play(`avatarEnterAnimationKey`, true);

        //When the animation is done, call the "resumeAnimation" function
        this.avatarEnterAnim.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            this.resumeAnimation();
        }, this);

        //Collision with map parts, in this case, fence and rope
        fence.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, fence);
        rope.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, rope);

        //Makes the invisible triggers that the user would collide with as to not fall in the bridge
        this.bridgeInteractionTrigger = this.physics.add.sprite(120, 250, `invisibleTrigger`);
        this.bridgeInteractionTrigger2 = this.physics.add.sprite(120, 300, `invisibleTrigger`);
        
        //Makes the sign and the door as well as changing their size (as in the size of their collision box) as well as making them immovable
        this.sign = this.physics.add.sprite(470, 105, "sign").setImmovable(true);
        this.sign.setSize(20, 20, true)
        this.door = this.physics.add.sprite(510, 80, "door").setImmovable(true);

        //Makes the ending block that the avatar would walk through to end the game
        this.endingTrigger = this.physics.add.sprite(510, 550, "invisibleTrigger").setImmovable(true);

        //Makes a just as lovely talking tree like act 1 appear, putting it's location and making it immovable. "but why is it also still blue?" because I still think its silly goofy next question
        this.talkingTree = this.physics.add.sprite(100, 100, "tree").setImmovable(true).setTint(`0x3333dd`);

        //Opener scene trigger, it will get destroyed the moment the avatar object spawns in. When this disappears it can't be triggered again, which is the point (yay)
        this.openerScene = this.physics.add.group({
            key: 'invisibleTrigger1',
            quantity: 1,
            immovable: true,
        });

        this.openerScene.children.each(function (openerSceneA) {
            openerSceneA.setPosition(150, 100);
        }, this);

        //Adds the colliders between the avatar and different objects
        this.physics.add.collider(this.avatar, this.talkingTree, this.displayTreeDialog, null, this);

        //If the avatar collides with the NPC it will call for the function of displaying the NPC dialog
        this.physics.add.collider(this.avatar, this.npc1, this.displayNPC1Dialog, null, this);
        this.physics.add.collider(this.avatar, this.npc2, this.displayNPC2Dialog, null, this);
        this.physics.add.collider(this.avatar, this.npc5, this.displayNPC5Dialog, null, this);

        //If the avatar collides with the door, display the dialog, if with the ending trigger (invisible block!!!) call the change scene function
        this.physics.add.collider(this.avatar, this.door, this.displayHouseDialog, null, this);
        this.physics.add.overlap(this.avatar, this.endingTrigger, this.changeScene , null, this);

        //When the user tries to get to the bridge, it would be met with a dialog
        this.physics.add.overlap(this.avatar, this.bridgeInteractionTrigger, this.displayBridgeDialog, null, this);
        this.physics.add.overlap(this.avatar, this.bridgeInteractionTrigger2, this.displayBridgeDialog, null, this);

        //When the user collides with the sign, displaySignDialog gets called
        this.physics.add.collider(this.avatar, this.sign, this.displaySignDialog, null, this);

        //makes it that if the openerScene block WHICH IS INVISIBLE is there, displaay the text, however, if it's not there, it doesn't display the text, I put it like this so like that it would only display the text once aren't I amazing
        if (this.openerScene.countActive() == 1) {
            this.physics.add.overlap(this.avatar, this.openerScene, this.   displayOpenerDialog, null, this);
        }

        //Calls the "crops" function
        this.createCrops()

        //Calls the function for the dialog boxes themselves
        this.displayDialogBoxes()

        //Calls the function for the text
        this.dialogBoxFunction()

        //Calls the function to display the location of the text
        this.displayTextLocations()

        //Makes the default animations the idle ones for each character on the screen
        this.npc1.play("npcIdle1", true)
        this.npc2.play("npcIdle2", true)
        this.npc5.play("npcIdle5", true)

        //Creates the cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        //Code for the camera to follow the avatar and also to be closer
        this.cameras.main.startFollow(this.avatar, true, 0.05, 0.05);
        this.cameras.main.setZoom(2)
    }

    //When the opener animation finishes, resume the physics so the user can move once again
    resumeAnimation() {
        this.physics.resume();
    }

    //Creates the array for the crops, basically it creates lines at the X positions I put in that would contain 10 crops each line and each x position I put down
    //ITS SUPPOSED TO HAVE NO TEXTURE!!! ITS ON PURPOSE!!!
    createCrops() {
        const cropXPositions = [750, 770, 790, 830, 870];
        this.cropGroup = this.physics.add.group();
        for (let pos of cropXPositions) {
            const numCrops = 10;
            const crops = [];
            for (let i = 0; i < numCrops; i++) {
                const crop = this.physics.add.sprite(0, 0, `crop-image`);
                crops.push(crop);
            }
            const line = new Phaser.Geom.Line(pos, 90, pos, 210);
            Phaser.Actions.RandomLine(crops, line);
            this.cropGroup.addMultiple(crops);
        }
        this.physics.add.overlap(this.avatar, this.cropGroup, this.cropDestroy, null, this);
    }

    //Destroys the crops
    cropDestroy(avatar, item) {
        item.destroy();
    }

    //Sets the location of each and every box + icon in the game and sets them as not visible as to be made visible when the collisions happen
    displayDialogBoxes() {
        this.testBox = this.add.image(240, 350, "testBox").setOrigin(0)
        this.testBox.setScrollFactor(0)
        this.testBox.setVisible(false);

        this.treeIcon = this.add.image(245, 355, "treeIcon").setOrigin(0).setTint(`0x3333dd`)
        this.treeIcon.setScrollFactor(0)
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

        this.overlay = this.add.image(0,0, "overlay").setOrigin(0)
        this.overlay.setBlendMode(Phaser.BlendModes.ADD);
        this.overlay.setScrollFactor(0)
        this.overlay.setVisible(false);

        this.getOut = this.physics.add.sprite(400, 380, `out`);
        this.getOut.setScrollFactor(0)
        this.getOut.setVisible(false);
    }

    //Sets the location of the text itself, as to why this is seperate from the other box? It was getting too long and I felt this was better for organization
    displayTextLocations() {
        this.openerBox.setScrollFactor(0)
        this.openerBox.setPosition(330, 350);

        this.dialogBox.setScrollFactor(0)
        this.dialogBox.setPosition(325, 350);

        this.dialogBoxNPC1.setScrollFactor(0)
        this.dialogBoxNPC1.setPosition(325, 350);

        this.dialogBoxNPC2.setScrollFactor(0)
        this.dialogBoxNPC2.setPosition(325, 350);

        this.npc5dialogBox1.setScrollFactor(0)
        this.npc5dialogBox1.setPosition(325, 350);

        this.npc5dialogBox2.setScrollFactor(0)
        this.npc5dialogBox2.setPosition(325, 350);

        this.dialogBoxGate.setScrollFactor(0) 
        this.dialogBoxGate.setPosition(325, 350);

        this.dialogBoxSign.setScrollFactor(0) 
        this.dialogBoxSign.setPosition(325, 350);

        this.bridgeInteractionBox.setScrollFactor(0) 
        this.bridgeInteractionBox.setPosition(310, 350);
    }

    changeScene() {
        //Change the scene to another state
        this.cameras.main.fadeOut(1000, 0, 0, 0)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('ending')
            })
    }

    insideHouse() {
        //Change the scene to another state
        this.cameras.main.fadeOut(1000, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('house')
        })
    }

    displayTreeDialog(avatar, talkingTree) {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.treeIcon.setVisible(true);
        this.dialogBox.setVisible(true);
        this.physics.pause();
    }

    displayHouseDialog() {
        // Display the dialog as well as pausing the physics so you can't move, this one also plays a special animation just for this scene! yay!
        this.testBox.setVisible(true);
        this.overlay.setVisible(true);
        this.getOut.setVisible(true);
        this.getOut.play("outAnim", true)
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

    displayOpenerDialog(avatar,item) {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.avatarIcon.setVisible(true);
        this.openerBox.setVisible(true);
        
        this.physics.pause();
        item.destroy();
    }

    displayBridgeDialog() {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.avatarIcon.setVisible(true);
        this.bridgeInteractionBox.setVisible(true);
        this.physics.pause();
    }

    displayNPC1Dialog(avatar, npc1) {
        //Displaying the dialog for the first NPC depending
        this.testBox.setVisible(true);
        this.npc1Icon.setVisible(true);
        this.dialogBoxNPC1.setVisible(true);
        this.physics.pause();
    }

    displayNPC5Dialog(avatar, npc1) {
        // Display the dialog as well as pausing the physics so you can't move

        if (this.cropGroup.countActive() >= 1) {
            this.testBox.setVisible(true);
            this.npc5Icon.setVisible(true);
            this.npc5dialogBox1.setVisible(true);
            this.physics.pause();
        } else {
            this.testBox.setVisible(true);
            this.npc5Icon.setVisible(true);
            this.npc5dialogBox2.setVisible(true);
            this.physics.pause();
            this.gate.destroy()
        }
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
        this.npc5dialogBox1.setVisible(false);
        this.npc5dialogBox2.setVisible(false);
        this.testBox.setVisible(false);
        this.openerBox.setVisible(false);
        this.dialogBoxSign.setVisible(false);
        this.dialogBoxGate.setVisible(false);
        this.treeIcon.setVisible(false);
        this.avatarIcon.setVisible(false);
        this.npc1Icon.setVisible(false);
        this.npc2Icon.setVisible(false);
        this.npc5Icon.setVisible(false);
        this.overlay.setVisible(false);
        this.bridgeInteractionBox.setVisible(false);
        this.getOut.setVisible(false);
        this.physics.resume();
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

    //Sets the appearance + what the dialog would look like in one silly function
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
            text: 'honk',
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

        const openerText = {
            text: "What just \nhappened!?",
            style: configStyle
        };

        const npc1Talk = {
            text: '...hi...',
            style: configStyle
        };

        const npc2Talk = {
            text: '...',
            style: configStyle
        };

        const npc5Talk1 = {
            text: "Can you grab\n▮▮▮▮▮▮▮▮.",
            style: configStyle
        }

        const npc5Talk2 = {
            text: "Okay You Can\nPass Now",
            style: configStyle
        }

        //sets the dialog box as well as the text goes in 
        this.bridgeInteractionBox = this.make.text(bridgeInteraction);
        this.bridgeInteractionBox.setVisible(false);

        this.dialogBox = this.make.text(treeTalking);
        this.dialogBox.setVisible(false);

        this.openerBox = this.make.text(openerText);
        this.openerBox.setVisible(false);

        this.dialogBoxSign = this.make.text(signText);
        this.dialogBoxSign.setVisible(false);

        this.dialogBoxGate = this.make.text(gateText);
        this.dialogBoxGate.setVisible(false);

        this.dialogBoxNPC1 = this.make.text(npc1Talk);
        this.dialogBoxNPC1.setVisible(false);

        this.dialogBoxNPC2 = this.make.text(npc2Talk);
        this.dialogBoxNPC2.setVisible(false);

        this.npc5dialogBox1 = this.make.text(npc5Talk1);
        this.npc5dialogBox1.setVisible(false);

        this.npc5dialogBox2 = this.make.text(npc5Talk2);
        this.npc5dialogBox2.setVisible(false);
        
    }
}