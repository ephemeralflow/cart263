class Arc1 extends Phaser.Scene {
    constructor() {
        super({
            key: "arc1"
        })
    }

    create() {
        //Sets the camera of the scene + the physics so it will move
        this.cameras.main.setBounds(0, 0,480 * 2, 480 * 2);
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

        //Loading Avatar
        this.avatar = this.physics.add.sprite(150, 100, `avatar`);
        this.avatar.setSize(16, 20, true)

        this.bridgeInteractionTrigger =  this.physics.add.sprite(120, 250, `invisibleTrigger`);

        //Loads the fence layer + adds collisions between the avatar and fence
        let fencesBase = map.addTilesetImage("Fences", "fencesImage");
        let fence = map.createLayer("fenceLayer", fencesBase);
        fence.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, fence);

        //Loads the rope layer + adds collisions between the avatar and rope
        let ropeBase = map.addTilesetImage("Rope", "ropeImage");
        let rope = map.createLayer("ropeLayer", ropeBase);
        rope.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, rope);

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

        // COLLECTABLES
        this.collectables = this.physics.add.group({
            key: 'tree',
            quantity: 9
        });

        this.collectables.children.each(function (collectable) {
            let x = Phaser.Math.Between(400, 600);
            let y = Phaser.Math.Between(700, 900);
            collectable.setPosition(x, y);
            collectable.setTint(`0x3333dd`);
        }, this);

        //Loads the Talking Tree
        this.talkingTree = this.physics.add.group({
            key: 'tree',
            quantity: 1,
            immovable: true,
        });

        this.talkingTree.children.each(function (talkingTreeA) {
            talkingTreeA.setPosition(100, 100);
            talkingTreeA.setTint(`0x3333dd`);
        }, this);

        //Invisible block that literally only serves the purpose so that .countActive can be used for grabbing the star as countActive only works with this for some reason
        this.gateTrigger = this.physics.add.group({
            key: 'invisibleTrigger',
            quantity: 1,
            immovable: true,
        });

        this.gateTrigger.children.each(function (gateTriggerS) {
            gateTriggerS.setPosition(700, 60);
        }, this);

        //Adds the colliders between the avatar and different objects
        this.physics.add.collider(this.avatar, this.talkingTree, this.displayTreeDialog, null, this);
        //If the avatar collides with the NPC it will call for the function of displaying the NPC dialog
        this.physics.add.collider(this.avatar, this.npc1, this.displayNPC1Dialog, null, this);
        this.physics.add.collider(this.avatar, this.npc2, this.displayNPC2Dialog, null, this);
        this.physics.add.collider(this.avatar, this.npc5, this.displayNPC5Dialog, null, this);
        //If the avatar collides with the collectable plants, it will call for the collectItem function
        this.physics.add.overlap(this.avatar, this.collectables, this.collectItem, null, this);
        this.physics.add.collider(this.avatar, this.door, this.insideHouse, null, this);

        this.physics.add.overlap(this.avatar, this.bridgeInteractionTrigger, this.displayBridgeDialog, null, this);

        this.physics.add.collider(this.avatar, this.sign, this.displaySignDialog, null, this);

        this.physics.add.overlap(this.avatar, this.gateTrigger, this.gateTriggerFarmer, null, this);

        
        if (this.gateTrigger.countActive() == 1 ) {
            this.gate = this.physics.add.sprite(512, 165, `gate`).setImmovable(true);
            this.physics.add.collider(this.avatar, this.gate, this.displayGateDialog, null, this);
            this.physics.add.collider(this.avatar, this.gate);
        }

        this.displayDialogBoxes()

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

            const scene1Text = {
                text: "What's happening!?",
                style: configStyle
            };

            const npc1Talk = {
                text: 'Hello!!!',
                style: configStyle
            };

            const npc1Talk2 = {
                text: 'Thank you!!!',
                style: configStyle
            };

            const npc2Talk = {
                text: '...',
                style: configStyle
            };

            const npc2Talk2 = {
                text: 'I lost something.',
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

            this.dialogBoxScene = this.make.text(scene1Text);
            this.dialogBoxScene.setVisible(false);

            this.dialogBoxNPC1A = this.make.text(npc1Talk);
            this.dialogBoxNPC1A.setVisible(false);

            this.dialogBoxNPC2A = this.make.text(npc1Talk2);
            this.dialogBoxNPC2A.setVisible(false);

            this.dialogBoxNPC1B = this.make.text(npc2Talk);
            this.dialogBoxNPC1B.setVisible(false);

            this.dialogBoxNPC2B = this.make.text(npc2Talk2);
            this.dialogBoxNPC2B.setVisible(false);

            this.dialogBoxNPC5 = this.make.text(npc5Talk);
            this.dialogBoxNPC5.setVisible(false);
        }

        //calls the animation function
        this.createAnimations();

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

    displayDialogBoxes() {
        this.testBox = this.add.image(0, 0, "testBox").setOrigin(0)
        this.testBox.setVisible(false);
        this.treeIcon = this.add.image(45, 205, "treeIcon").setOrigin(0)
        this.treeIcon.setVisible(false);
        this.avatarIcon = this.add.image(305, 205, "avatarIcon").setOrigin(0)
        this.avatarIcon.setVisible(false);
        this.npc1Icon = this.add.image(105, 205, "npc1Icon").setOrigin(0)
        this.npc1Icon.setVisible(false);
        this.npc2Icon = this.add.image(265, 755, "npc2Icon").setOrigin(0)
        this.npc2Icon.setVisible(false); 
        this.npc5Icon = this.add.image(555, 205, "npc5Icon").setOrigin(0)
        this.npc5Icon.setVisible(false); 

        this.displayBoxLocations()
    }

    displayBoxLocations() {
        this.testBox.setScrollFactor(0)
        this.testBox.setPosition(240, 350);
        this.avatarIcon.setScrollFactor(0)
        this.avatarIcon.setPosition(245, 355);
        this.npc1Icon.setScrollFactor(0)
        this.npc1Icon.setPosition(245, 355);
        this.npc2Icon.setScrollFactor(0)
        this.npc2Icon.setPosition(245, 355);
        this.npc5Icon.setScrollFactor(0)
        this.npc5Icon.setPosition(245, 355);
    }

    changeScene() {
        //Change the scene to another state
        this.scene.start("arc2");
    }

    insideHouse() {
        //Change the scene to another state
        this.cameras.main.fadeOut(1000, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('house')
        })
    }

    gateTriggerFarmer(avatar, item){
        item.destroy();
        this.gate.destroy()
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
        this.dialogBoxGate.setScrollFactor(0)
        this.dialogBoxGate.setPosition(325, 350);
        this.physics.pause();
    }

    displaySignDialog() {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.avatarIcon.setVisible(true);
        this.dialogBoxSign.setVisible(true);
        this.dialogBoxSign.setPosition(370, 200);
        this.physics.pause();
    }

    displayBridgeDialog() {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.avatarIcon.setVisible(true);
        this.bridgeInteractionBox.setVisible(true);
        this.bridgeInteractionBox.setPosition(110, 270);
        this.physics.pause();
    }
 
    displayNPC1Dialog(avatar, npc1) {
        //Displaying the dialog for the first NPC depending on how many collectables are still on screen
        if (this.collectables.countActive() >= 1 && this.collectables.countActive() <= 9) {
            this.testBox.setVisible(true);
            this.npc1Icon.setVisible(true);
            this.dialogBoxNPC1A.setVisible(true);
            this.dialogBoxNPC1A.setPosition(170, 200);
            this.physics.pause();
        } else {
            this.invisibleTrigger = this.physics.add.sprite(250, 130, `invisibleTrigger`).setImmovable(true);
            this.physics.add.collider(this.avatar, this.invisibleTrigger, this.changeScene, null, this);
        }
    }

    displayNPC5Dialog(avatar, npc1) {
        // Display the dialog as well as pausing the physics so you can't move
        this.testBox.setVisible(true);
        this.npc5Icon.setVisible(true);
        this.dialogBoxNPC5.setVisible(true);
        this.dialogBoxNPC5.setPosition(620, 200);
        this.physics.pause();
    }

    displayNPC2Dialog(avatar, npc2) {
        //Displaying the dialog for the second NPC depending on how many collectables are still on screen
        if (this.collectables.countActive() >= 1 && this.collectables.countActive() <= 9) {
            this.testBox.setVisible(true);
            // this.testBox.setPosition(260, 750);
            this.npc2Icon.setVisible(true);
            this.dialogBoxNPC1B.setVisible(true);
            this.dialogBoxNPC1B.setPosition(330, 750);
            this.physics.pause();
        }
    }

    //Hides the dialog as well as resumes the physics so you can move again
    hideDialog() {
        this.dialogBox.setVisible(false);
        this.dialogBoxNPC1A.setVisible(false);
        this.dialogBoxNPC2A.setVisible(false);
        this.dialogBoxNPC1B.setVisible(false);
        this.dialogBoxNPC2B.setVisible(false);
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
            this.scene.start('arc2')
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

    //Create the animations for the characters (such as idle and walking for the main avatar)
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
    }
}