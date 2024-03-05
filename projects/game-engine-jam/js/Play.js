class Play extends Phaser.Scene {
    constructor() {
        super({
            key: "play"
        })
    }

    create() {
        this.trees = this.physics.add.group({

            key: `tree`,

            immovable: true,

            quantity: 32,
        });

        //TREES
        this.trees.children.each(function (tree) {
            let x = Phaser.Math.Between(0, this.sys.canvas.width);
            let y = Phaser.Math.Between(0, this.sys.canvas.height);
            // Set the position of the current wall
            tree.setPosition(x, y);
            // Set the tint of the current wall
            // tree.setTint(`0xdd3333`);
        }, this);

        //COLLECTABLES
        // this.collectables = this.physics.add.group({
        //     key: 'tree',
        //     quantity: 9
        // });

        // this.collectables.children.each(function (collectable) {
        //     let x = Phaser.Math.Between(0, this.sys.canvas.width);
        //     let y = Phaser.Math.Between(0, this.sys.canvas.height);
        //     collectable.setPosition(x, y);
        //     collectable.setTint(`0x3333dd`);
        // }, this);

        this.avatar = this.physics.add.sprite(200, 200, `avatar`);

        this.physics.add.collider(this.avatar, this.trees);

        this.physics.add.overlap(this.avatar, this.collectables, this.collectItem, null, this);

        // this.createAnimations();

        // this.avatar.play(`idle`);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    collectItem(avatar, item) {
        // NOTE: We'll keep it simple by just removing the collectable from the scene
        // using its .destroy() method!
        item.destroy();
    }

    update() {
        this.handleInput();
    }


    handleInput() {
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