class Play extends Phaser.Scene {
    constructor() {
        super({
            key: "play"
        })
    }

    text;

    create() {
        // this.cameras.main.setBounds(0, 0, 1920 * 2, 1080  * 2);
        this.cameras.main.setBounds(0, 0, 500 * 2, 400 * 2);
        this.physics.world.setBounds(0, 0, 400 * 2, 400 * 2);

        let map = this.make.tilemap({ key: "mapTest" })
        let waterBase = map.addTilesetImage("Water", "waterImage");
        let grassBase = map.addTilesetImage("Grass", "grassImage");
        let fencesBase = map.addTilesetImage("Fences", "fencesImage");
        let bridgeBase = map.addTilesetImage("Wood_Bridge", "bridgeImage");
        // let miscBase = map.addTilesetImage("Misc", "miscImage");
        let layer = map.createLayer("water", waterBase, 0, 0);
        let ground = map.createLayer("ground", grassBase, 0, 0);
        let fence = map.createLayer("highestlayer", fencesBase, 0, 0);
        let bridge = map.createLayer("bridge", bridgeBase, 0, 0);
        // let toplayer = map.createLayer("highestlayer", miscBase, 0, 0);
        fence.setCollisionByExclusion([-1]);


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

        this.specialTree = this.physics.add.group({
            key: 'tree',
            quantity: 1,
            immovable: true,
        });

        this.specialTree.children.each(function (specialTreeS) {
            specialTreeS.setPosition(500, 450);
            specialTreeS.setTint(`0xdd3333`);
        }, this);

        this.dialogTest = this.physics.add.group({
            key: 'tree',
            quantity: 1,
            // immovable: true,
        });

        this.dialogTest.children.each(function (dialogTestS) {
            dialogTestS.setPosition(100, 100);
            dialogTestS.setTint(`0x3333dd`);
        }, this);

        // // Create a sadness emoji in a random position
        // this.sadness = this.physics.add.sprite(0, 0, `tree`);
        // this.sadness.setTint(0xff0000);
        // // Note how we can use RandomRectangle() here if we put the object we want
        // // to reposition randomly in an array!
        // Phaser.Actions.RandomRectangle([this.sadness], this.physics.world.bounds);


        this.avatar = this.physics.add.sprite(150, 100, `avatar`);

        this.physics.add.collider(this.avatar, this.trees);
        this.physics.add.collider(this.avatar, this.specialTree, this.changeScene, null, this);
        this.physics.add.collider(this.avatar, this.dialogTest, this.dialogBoxFunction, null, this);

        this.physics.add.collider(this.avatar, fence);

        this.physics.add.overlap(this.avatar, this.collectables, this.collectItem, null, this);

        {
            //  Implicit values
            const config1 = {
                x: 100,
                y: 100,
                text: 'TEST DIALOGUE',
                style: {
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
            };

            this.dialogBox = this.make.text(config1);
            this.dialogBox.setVisible(false);
        }

        // this.createAnimations();

        // this.avatar.play(`idle`);

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

    /**
        Called when the avatar overlaps the sadness, moves the sadness to a new random  position.
        */
    dialogBoxFunction(avatar, dialogTest) {
        // Note how we can use RandomRectangle() again here if we put the object we want
        // to reposition randomly in an array!
        Phaser.Actions.RandomRectangle([dialogTest], this.physics.world.bounds);

        this.displaySadDialog();
    }

    changeScene() {
        this.scene.start("play2");
    }

    displaySadDialog() {
        // Display the dialog
        this.dialogBox.setVisible(true);
        this.physics.pause();
    }

    hideSadDialog() {
        this.dialogBox.setVisible(false);
        this.physics.resume();
    }

    collectItem(avatar, item) {
        // NOTE: We'll keep it simple by just removing the collectable from the scene
        // using its .destroy() method!
        // item.destroy();
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
            this.hideSadDialog();
        }

        // NOTE: We can now check which keys are pressed and set the velocity of our
        // avatar sprite accordingly.
        // EXAMPLE: https://phaser.io/examples/v3/view/input/keyboard/cursor-keys
        if (this.cursors.left.isDown) {
            this.avatar.setVelocityX(-100);
        }
        else if (this.cursors.right.isDown) {
            this.avatar.setVelocityX(100);
        }
        else {
            // If neither left or right are pressed, stop moving on x
            this.avatar.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.avatar.setVelocityY(-100);
        }
        else if (this.cursors.down.isDown) {
            this.avatar.setVelocityY(100);
        }
        else {
            // If neither up or down are pressed, stop moving on y
            this.avatar.setVelocityY(0);
        }


        // if (this.avatar.body.velocity.x !== 0 || this.avatar.body.velocity.y !== 0) {
        //     this.avatar.play(`moving`, true);
        // }
        // // Otherwise it's not moving
        // else {
        //     this.avatar.play(`idle`, true);
        // }
    }



    createAnimations() {
        let movingAnimationConfig = {
            key: `moving`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                start: 0,
                end: 3
            }),
            frameRate: 30,
            repeat: -1
        };
        this.anims.create(movingAnimationConfig);

        let idleAnimationConfig = {
            // NOTE: We need to use a different animation key of course
            key: `idle`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                // NOTE: We're only going to use frame 0, so it's starts and ends there
                start: 0,
                end: 3
            }),
            // NOTE: No need to specify a frame rate for something that doesn't animate!
            // NOTE: We'll repeat 0 times!
            repeat: 0
        };
        this.anims.create(idleAnimationConfig);
    }
}

// undefined, this.(state).this
//https://blog.ourcade.co/posts/2020/phaser3-fog-of-war-field-of-view-roguelike/