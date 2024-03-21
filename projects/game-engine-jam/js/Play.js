class Play extends Phaser.Scene {
    constructor() {
        super({
            key: "play"
        })
    }

    text;
    textNumber = 1;

    create() {
        // this.cameras.main.setBounds(0, 0, 1920 * 2, 1080  * 2);
        this.cameras.main.setBounds(0, 0, 480 * 2, 480 * 2);
        this.physics.world.setBounds(0, 0, 480 * 2, 480 * 2);

        let map = this.make.tilemap({ key: "mapTest" })

        let tileset = map.addTilesetImage("Water", "waterImage");
        let water = map.createLayer("water", tileset);

        let grassBase = map.addTilesetImage("Grass", "grassImage");

        let bridgeBase = map.addTilesetImage("Wood_Bridge", "bridgeImage");
        // let miscBase = map.addTilesetImage("Misc", "miscImage");

        let ground = map.createLayer("ground", grassBase, 0, 0);
        let bridge = map.createLayer("bridge", bridgeBase, 0, 0);

        this.avatar = this.physics.add.sprite(150, 100, `avatar`);
        this.avatar.setSize(16, 28, true)

        let fencesBase = map.addTilesetImage("Fences", "fencesImage");
        let fence = map.createLayer("fenceLayer", fencesBase);
        fence.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, fence);

        let ropeBase = map.addTilesetImage("Rope", "ropeImage");
        let rope = map.createLayer("ropeLayer", ropeBase);
        rope.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.avatar, rope);

        this.npc1 = this.physics.add.sprite(250, 105, "npc1").setImmovable(true);
        this.npc1.setSize(10, 20, true)

        this.avatar.setCollideWorldBounds(true);


        this.trees = this.physics.add.group({

            key: `tree`,

            immovable: true,

            quantity: 455,
        });

        // //TREES
        // this.trees.children.each(function (tree) {
        //     let x = Phaser.Math.Between(0, 3840);
        //     let y = Phaser.Math.Between(0, 2160);
        //     // Set the position of the current wall
        //     tree.setPosition(x, y);
        //     // Set the tint of the current wall
        //     // tree.setTint(`0xdd3333`);
        // }, this);

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

        this.specialTree = this.physics.add.group({
            key: 'tree',
            quantity: 1,
            immovable: true,
        });

        this.specialTree.children.each(function (specialTreeS) {
            specialTreeS.setPosition(480, 460);
            specialTreeS.setTint(`0xdd3333`);
        }, this);

        this.dialogTest = this.physics.add.group({
            key: 'tree',
            quantity: 1,
            immovable: true,
        });

        this.dialogTest.children.each(function (dialogTestS) {
            dialogTestS.setPosition(100, 100);
            dialogTestS.setTint(`0x3333dd`);
        }, this);

        // this.physics.add.collider(this.avatar, this.trees);
        this.physics.add.collider(this.avatar, this.specialTree, this.changeScene, null, this);
        this.physics.add.collider(this.avatar, this.dialogTest, this.displayTreeDialog, null, this);
        this.physics.add.collider(this.avatar, this.npc1, this.displayNPCDialog, null, this);



        this.physics.add.overlap(this.avatar, this.collectables, this.collectItem, null, this);

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
                text: 'hi im a tree',
                style: configStyle
            };

            const npc1Talk = {
                text: 'hi im a person',
                style: configStyle
            };

            const npc1Talk2 = {
                text: 'yippee',
                style: configStyle
            };

            this.dialogBox = this.make.text(treeTalking);
            this.dialogBox.setVisible(false);

            this.dialogBoxNPC1 = this.make.text(npc1Talk);
            this.dialogBoxNPC1.setVisible(false);

            this.dialogBoxNPC2 = this.make.text(npc1Talk2);
            this.dialogBoxNPC2.setVisible(false);
        }

        this.createAnimations();

        this.avatar.play(`idle`);
        this.npc1.play("npcIdle1", true)

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.startFollow(this.avatar, true, 0.05, 0.05);

        // let width = this.scale.width;

        // let rt = this.make.renderTexture({
        //     width: 800,
        //     height: 800,
        // }, true)

        // rt.setTint(0x0a2948)

        // this.vision = this.make.image({
        //     x: this.avatar.x,
        //     y: this.avatar.y,
        //     key: "vision",
        //     add: false,
        // })
        // this.vision.scale = 2.5

        // rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision)
        // rt.mask.invertAlpha = true;
    }

    changeScene() {
        //Change the scene to another state
        this.scene.start("play2");
    }

    displayTreeDialog(avatar, dialogTest) {
        // Display the dialog
        this.dialogBox.setVisible(true);
        this.dialogBox.setPosition(100, 400);
        this.physics.pause();
    }

    displayNPCDialog(avatar, npc1) {
        if (this.collectables.quantity >= 1 && this.collectables.quantity <= 9) {

        }

        this.dialogBoxNPC1.setVisible(true);
        this.dialogBoxNPC1.setPosition(100, 400);
        this.physics.pause();



        if (this.collectables.quantity == 0) {
            this.dialogBoxNPC2.setVisible(true);
            this.dialogBoxNPC2.setPosition(100, 400);
            this.physics.pause();
        }
    }

    hideDialog() {
        this.dialogBox.setVisible(false);
        this.dialogBoxNPC1.setVisible(false);
        this.dialogBoxNPC2.setVisible(false);
        this.physics.resume();
    }

    collectItem(avatar, item) {
        // NOTE: We'll keep it simple by just removing the collectable from the scene
        // using its .destroy() method!
        item.destroy();
    }

    update() {
        this.handleInput();
        if (this.vision) {
            this.vision.x = this.avatar.x;
            this.vision.y = this.avatar.y;
        }
    }


    handleInput() {

        if (this.cursors.space.isDown) {
            this.hideDialog();
        }

        // NOTE: We can now check which keys are pressed and set the velocity of our
        // avatar sprite accordingly.
        // EXAMPLE: https://phaser.io/examples/v3/view/input/keyboard/cursor-keys
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
        // Otherwise it's not moving
        else {
            this.avatar.play(`idle`, true);
        }
    }



    createAnimations() {
        // let movingAnimationConfig = {
        //     key: `moving`,
        //     frames: this.anims.generateFrameNumbers(`avatar`, {
        //         start: 0,
        //         end: 3
        //     }),
        //     frameRate: 30,
        //     repeat: -1
        // };
        // this.anims.create(movingAnimationConfig);

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

// undefined, this.(state).this
//https://blog.ourcade.co/posts/2020/phaser3-fog-of-war-field-of-view-roguelike/