class Play extends Phaser.Scene {
    constructor() {
        super({
            key: "play"
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

        //Adds the colliders between the avatar and different objects
        this.physics.add.collider(this.avatar, this.talkingTree, this.displayTreeDialog, null, this);
        //If the avatar collides with the NPC it will call for the function of displaying the NPC dialog
        this.physics.add.collider(this.avatar, this.npc1, this.displayNPC1Dialog, null, this);
        this.physics.add.collider(this.avatar, this.npc2, this.displayNPC2Dialog, null, this);
        //If the avatar collides with the collectable plants, it will call for the collectItem function
        this.physics.add.overlap(this.avatar, this.collectables, this.collectItem, null, this);

        {
            //  Sets the appearance of the text shown
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

            //Sets the text of everything that speaks
            const treeTalking = {
                text: 'hi im a tree',
                style: configStyle
            };

            const npc1Talk = {
                text: 'Hello!!! Can you collect\n some plants for me?',
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

            //sets the dialog box as well as the text goes in 
            this.dialogBox = this.make.text(treeTalking);
            this.dialogBox.setVisible(false);

            this.dialogBoxNPC1A = this.make.text(npc1Talk);
            this.dialogBoxNPC1A.setVisible(false);

            this.dialogBoxNPC2A = this.make.text(npc1Talk2);
            this.dialogBoxNPC2A.setVisible(false);

            this.dialogBoxNPC1B = this.make.text(npc2Talk);
            this.dialogBoxNPC1B.setVisible(false);

            this.dialogBoxNPC2B = this.make.text(npc2Talk2);
            this.dialogBoxNPC2B.setVisible(false);
        }

        //calls the animation function
        this.createAnimations();

        //Makes the default animations the idle ones for each character on the screen
        this.avatar.play(`idle`);
        this.npc1.play("npcIdle1", true)
        this.npc2.play("npcIdle2", true)

        //Creates the cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        //Code for the camera to follow the avatar
        this.cameras.main.startFollow(this.avatar, true, 0.05, 0.05);
        
    }

    changeScene() {
        //Change the scene to another state
        this.scene.start("play2");
    }

    displayTreeDialog(avatar, talkingTree) {
        // Display the dialog as well as pausing the physics so you can't move
        this.dialogBox.setVisible(true);
        this.dialogBox.setPosition(100, 400);
        this.physics.pause();
    }

    displayNPC1Dialog(avatar, npc1) {
        //Displaying the dialog for the first NPC depending on how many collectables are still on screen
        if (this.collectables.countActive() >= 1 && this.collectables.countActive() <= 9) {
            this.dialogBoxNPC1A.setVisible(true);
            this.dialogBoxNPC1A.setPosition(100, 400);
            this.physics.pause();
        } else {
            this.invisibleTrigger = this.physics.add.sprite(250, 130, `invisibleTrigger`).setImmovable(true);
            this.physics.add.collider(this.avatar, this.invisibleTrigger, this.changeScene, null, this);
        }
    }

    displayNPC2Dialog(avatar, npc2) {
        //Displaying the dialog for the second NPC depending on how many collectables are still on screen
        if (this.collectables.countActive() >= 1 && this.collectables.countActive() <= 9) {
            this.dialogBoxNPC1B.setVisible(true);
            this.dialogBoxNPC1B.setPosition(100, 800);
            this.physics.pause();
        } else {
            this.dialogBoxNPC2B.setVisible(true);
            this.dialogBoxNPC2B.setPosition(100, 800);
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
        this.physics.resume();
    }

    collectItem(avatar, item) {
        //Destroys the collectables
        item.destroy();
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