class Play extends Phaser.Scene {
    constructor() {
        super({
            key: `play`
        });
    }

    create() {
        // NOTE: Instead of creating individual walls, we create a group of walls all at once.
        // By adding a group to the physics engine, we can specify some basic details about the
        // image to use, the number to create, and some simple physics properties.
        // We assign the result into a property of the scene so we can deal with the group of walls
        // when we need to.
        // EXAMPLE: https://phaser.io/examples/v3/view/game-objects/group/create-invaders
        this.walls = this.physics.add.group({
            // All walls should use the wall image key
            key: `wall`,
            // Make all the walls created immovable
            immovable: true,
            // Create 16 walls
            quantity: 16,
        });

        // NOTE: Now that we've created all these wall and they're in our group, we need to
        // iterate through them to set them up! Fortunately the group gives us easy access
        // to its children and a method to iterate through them!
        this.walls.children.each(function (wall) {
            // Choose a random position on the canvas
            // NOTE: how the Phaser.Math module gives us access to lots of useful math
            // helper functions!
            // NOTE: we can use this.sys.canvas to find out the dimensions of our game
            // on the canvas!
            let x = Phaser.Math.Between(0, this.sys.canvas.width);
            let y = Phaser.Math.Between(0, this.sys.canvas.height);
            // Set the position of the current wall
            wall.setPosition(x, y);
            // Set the tint of the current wall
            wall.setTint(`0xdd3333`);
            // Note how we pass "this" as the second argument to .each() so that we can use the class'
            // methods and properties if needed
        }, this);

        // NOTE: Do roughly the same thing for the collectables to create randomly positioned
        // collectables
        this.collectables = this.physics.add.group({
            key: 'wall',
            quantity: 9
        });

        this.collectables.children.each(function (collectable) {
            let x = Phaser.Math.Between(0, this.sys.canvas.width);
            let y = Phaser.Math.Between(0, this.sys.canvas.height);
            collectable.setPosition(x, y);
            collectable.setTint(`0x3333dd`);
        }, this);

        this.avatar = this.physics.add.sprite(200, 200, `avatar`);

        // NOTE: We can add a collider between the avatar and the GROUP of walls!
        // It will check the collision between the avatar and all the walls for us!
        this.physics.add.collider(this.avatar, this.walls);

        // NOTE: We can add an overlap check between the avatar and the GROUP of collectables!
        // It will check the overlaps between the avatar and all the collectables for us!
        this.physics.add.overlap(this.avatar, this.collectables, this.collectItem, null, this);

        this.createAnimations();

        this.avatar.play(`idle`);

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

        if (this.avatar.body.velocity.x !== 0 || this.avatar.body.velocity.y !== 0) {
            this.avatar.play(`moving`, true);
        }
        // Otherwise it's not moving
        else {
            this.avatar.play(`idle`, true);
        }
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

