class Play2 extends Phaser.Scene {
    constructor() {
        super({
            key: "play2"
        })
    }

    create() {
        this.cameras.main.setBounds(0, 0, 500 * 2, 500 * 2);
        this.physics.world.setBounds(0, 0, 500 * 2, 500 * 2);

        //Makes the tree objects that will be put randomly around the world
        this.trees = this.physics.add.group({

            key: `tree`,

            immovable: true,

            quantity: 455,
        });

        //Random location + A tint to red to make them look kinda weird
        this.trees.children.each(function (tree) {
            let x = Phaser.Math.Between(0, 3840);
            let y = Phaser.Math.Between(0, 2160);
            tree.setPosition(x, y);
            tree.setTint(`0xdd3333`);
        }, this);

        //Invisible block that literally only serves the purpose so that .countActive can be used for grabbing the star as countActive only works with this for some reason
        this.invisibleTrigger = this.physics.add.group({
            key: 'invisibleTrigger',
            quantity: 1,
            immovable: true,
        });

        this.invisibleTrigger.children.each(function (invisibleTriggerS) {
            invisibleTriggerS.setPosition(500, 705);
        }, this);

        //Loads the sprites of the NPC as well as the door and the star
        this.npc3 = this.physics.add.sprite(1000, 105, "npc3");
        this.door = this.physics.add.sprite(100, 105, "door").setImmovable(true);
        this.star = this.physics.add.sprite(500, 705, "star");
        this.avatar = this.physics.add.sprite(200, 200, `avatar`);

        //Loads the colliders for the trees as well as the checkers and the door to call different functions
        this.physics.add.collider(this.avatar, this.trees);
        this.physics.add.collider(this.avatar, this.door, this.changeScene, null, this);
        //When the NPC and the avatar collide, change the DEAD scene
        this.physics.add.collider(this.avatar, this.invisibleTrigger, this.collectStar, null, this);
      
        //Calls the animation function as well as makes the default animations the idle ones for each character on the screen
        this.createAnimations();
        this.npc3.play("idleNPC3", true)
        this.star.play("starAnim", true)
        this.avatar.play(`idle`);

        //Colliders between the avatar and the NPC as to activate the dialog
        this.physics.add.collider(this.avatar, this.npc3, this.endOfGame, null, this);
        //Colliders between the avatar and the star as to collect said star
        this.physics.add.collider(this.avatar, this.star, this.starCollect, null, this);

        //Creates the cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        //Code for the camera to follow the avatar
        this.cameras.main.startFollow(this.avatar, true, 0.05, 0.05);
    }

    //Hides the star the moment the avatar and the star overlap
    starCollect(avatar, star) {
        this.star.setVisible(false)
    }
    //function for when you overlap with the star (which has an extra checker) it will get destroyed
    collectStar(avatar, item) {
        item.destroy();
    }

    endOfGame() {
        this.scene.start('death')
    }

    //Calls the input function + makes the NPC approach the player 100 pixels per second
    update() {
        this.handleInput();
        this.physics.moveToObject(this.npc3,this.avatar,100)
    }

    changeScene() {
        //Change the scene to another state
        if (this.invisibleTrigger.countActive() == 0) {
            this.scene.start("ending");
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
        this.anims.create({
            key: "idleNPC3",
            frames: this.anims.generateFrameNumbers("npc3", { frames: [0, 1, 2, 3] }),
            frameRate: 2,
            repeat: -1
        })
        this.anims.create({
            key: "starAnim",
            frames: this.anims.generateFrameNumbers("star", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
            frameRate: 12,
            repeat: -1
        })
    }
}