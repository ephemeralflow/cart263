class Play2 extends Phaser.Scene {
    constructor() {
        super({
            key: "play2"
        })
    }

    text;

    create() {
        this.cameras.main.setBounds(0, 0, 500 * 2, 500 * 2);
        this.physics.world.setBounds(0, 0, 500 * 2, 500 * 2);

        this.trees = this.physics.add.group({

            key: `tree`,

            immovable: true,

            quantity: 455,
        });
        //this.scene.start("NAME OF SCENE");

        this.npc2 = this.physics.add.sprite(350, 105, "npc2");


        //TREES
        this.trees.children.each(function (tree) {
            let x = Phaser.Math.Between(0, 3840);
            let y = Phaser.Math.Between(0, 2160);
            // Set the position of the current wall
            tree.setPosition(x, y);
            // Set the tint of the current wall
            tree.setTint(`0xdd3333`);
        }, this);

        this.specialTree = this.physics.add.group({
            key: 'tree',
            quantity: 1,
            immovable: true,
        });

        this.specialTree.children.each(function (specialTreeS) {
            specialTreeS.setPosition(100, 100);
            specialTreeS.setTint(`0xdd3333`);
        }, this);

        this.dialogTest = this.physics.add.group({
            key: 'tree',
            quantity: 1,
            // immovable: true,
        });

        this.dialogTest.children.each(function (dialogTestS) {
            dialogTestS.setPosition(200, 100);
            dialogTestS.setTint(`0x3333dd`);
        }, this);

        // Create a sadness emoji in a random position
        this.sadness = this.physics.add.sprite(0, 0, `tree`);
        this.sadness.setTint(0xff0000);
        // Note how we can use RandomRectangle() here if we put the object we want
        // to reposition randomly in an array!
        Phaser.Actions.RandomRectangle([this.sadness], this.physics.world.bounds);


        this.avatar = this.physics.add.sprite(200, 200, `avatar`);

        this.physics.add.collider(this.avatar, this.trees);
        this.physics.add.collider(this.avatar, this.specialTree);
        this.physics.add.collider(this.avatar, this.dialogTest, this.dialogBoxFunction, null, this);

        this.physics.add.overlap(this.avatar, this.collectables, this.collectItem, null, this);

        {
            //  Implicit values
            const config1 = {
                x: 100,
                y: 100,
                text: 'Why are you here',
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

        this.createAnimations();
        this.npc2.play("idleNPC2", true)
        this.avatar.play(`idle`);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.startFollow(this.avatar, true, 0.05, 0.05);
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
        this.anims.create({
            key: "idleNPC2",
            frames: this.anims.generateFrameNumbers("npc2", { frames: [0, 1, 2, 3] }),
            frameRate: 2,
            repeat: -1
        })
    }
}

// undefined, this.(state).this
//https://blog.ourcade.co/posts/2020/phaser3-fog-of-war-field-of-view-roguelike/