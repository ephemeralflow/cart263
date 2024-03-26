class Play3 extends Phaser.Scene {
    constructor() {
        super({
            key: "play3"
        })
    }

    create() {
        //Sets the camera of the scene + the physics so it will move
        this.cameras.main.setBounds(0, 0, 480 * 2, 480 * 2);
        this.physics.world.setBounds(0, 0, 480 * 2, 480 * 2);

        //Loading map tiles + layers
        let map = this.make.tilemap({ key: "mapTest" })

        let waterBase = map.addTilesetImage("Water", "waterImage");
        let water = map.createLayer("water", waterBase);

        let grassBase = map.addTilesetImage("Grass", "grassImage");
        let ground = map.createLayer("ground", grassBase, 0, 0);

        let bridgeBase = map.addTilesetImage("Wood_Bridge", "bridgeImage");
        let bridge = map.createLayer("bridge", bridgeBase, 0, 0);

        let plantsBase = map.addTilesetImage("Basic_Grass_Biom_things", "plantsImage");
        let plants = map.createLayer("plantLife", plantsBase, 0, 0);

        //Loading Avatar
        this.avatar = this.physics.add.sprite(150, 100, `avatar`);
        this.avatar.setSize(16, 20, true)

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
        //Invisible block that serves as a checker that you talked with the NPC at the bottom
        this.invisibleTrigger1 = this.physics.add.group({
            key: 'invisibleTrigger',
            quantity: 1,
            immovable: true,
        });
        this.invisibleTrigger1.children.each(function (invisibleTriggerS1) {
            invisibleTriggerS1.setPosition(400, 700);
        }, this);


        this.talkingTree = this.physics.add.group({
            key: 'tree',
            quantity: 1,
            immovable: true,
        });

        this.talkingTree.children.each(function (talkingTreeA) {
            talkingTreeA.setPosition(100, 100);
            talkingTreeA.setTint(`0x3333dd`);
        }, this);

        this.physics.add.collider(this.avatar, this.talkingTree, this.displayTreeDialog, null, this);
        this.physics.add.collider(this.avatar, this.npc1, this.displayNPC1Dialog, null, this);
        this.physics.add.collider(this.avatar, this.npc2, this.displayNPC2Dialog, null, this);
        this.physics.add.collider(this.avatar, this.invisibleTrigger1, this.activateEndingBlock, null, this);

        {
            //  Implicit values
            const configStyle = {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',
                backgroundColor: '#ff00ff',
                shadow: {
                    color: '#000000',
                    fill: true,
                    offsetX: 2,
                    offsetY: 2,
                    blur: 8
                }
            }

            const treeTalking = {
                text: 't̸̢̠̘̻̤̭̥̳̗̪̘͓̝̍̀͗͌̽́̑͂̎̏́͒̚r̵̢̨̭̰̝̻͓͚̲̭͋͑̆̔̐̋̒̅̕e̴͔̥͍̙̼̼͓̻̤̊̾͌e̶̢͓͈̲͇̥̜͓̝̜̾̊̀̆̈͒̽̈́͑͘',
                style: configStyle
            };

            const npc1Talk = {
                text: 'Can you \nhelp my friend?',
                style: configStyle
            };

            const npc2Talk = {
                text: 'Oh thank you I wonder\n where it was',
                style: configStyle
            };

            //sets the dialog box as well as the text goes in 
            this.dialogBox = this.make.text(treeTalking);
            this.dialogBox.setVisible(false);

            this.dialogBoxNPC1A = this.make.text(npc1Talk);
            this.dialogBoxNPC1A.setVisible(false);

            this.dialogBoxNPC1B = this.make.text(npc2Talk);
            this.dialogBoxNPC1B.setVisible(false);
        }
        //Play idle animations
        this.avatar.play(`idle`);
        this.npc1.play("npcIdle1", true)
        this.npc2.play("npcIdle2", true)

        //Creates the cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        //Code for the camera to follow the avatar
        this.cameras.main.startFollow(this.avatar, true, 0.05, 0.05);
    }

    //invisible trigger for when you walk towards the second NPC, a block in your way will appear to then call for a change of scenes
    activateEndingBlock(avatar, item) {
        item.destroy();
        this.invisibleTrigger2 = this.physics.add.sprite(510, 550, `invisibleTrigger`).setImmovable(true);
        if (this.invisibleTrigger1.countActive() == 0) {
            this.physics.add.collider(this.avatar, this.invisibleTrigger2, this.changeScene, null, this);
        }
    }

    changeScene() {
        //Change the scene to another state
        if (this.invisibleTrigger1.countActive() == 0) {
            this.scene.start("ending");
        }
    }

    displayTreeDialog(avatar, talkingTree) {
        // Display the dialog for the tree
        this.dialogBox.setVisible(true);
        this.dialogBox.setPosition(100, 400);
        this.physics.pause();
    }

    //Display the NPC dialog
    displayNPC1Dialog(avatar, npc1) {
        this.dialogBoxNPC1A.setVisible(true);
        this.dialogBoxNPC1A.setPosition(100, 400);
        this.physics.pause();
    }

    displayNPC2Dialog(avatar, npc2) {
        this.dialogBoxNPC1B.setVisible(true);
        this.dialogBoxNPC1B.setPosition(100, 800);
        this.physics.pause();
    }

    //Function to resume the physics and hide the dialog
    hideDialog() {
        this.dialogBox.setVisible(false);
        this.dialogBoxNPC1A.setVisible(false);
        this.dialogBoxNPC1B.setVisible(false);
        this.physics.resume();
    }

    update() {
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
}