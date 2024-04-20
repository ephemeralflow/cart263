class Act2 extends Phaser.Scene {
    constructor() {
        super({
            key: "act2"
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

        this.physics.add.collider(this.avatar, this.door, this.doorActions, null, this);
        
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
        this.cameras.main.setZoom(2)
    }

    //Hides the star the moment the avatar and the star overlap
    starCollect(avatar, star) {
        this.star.setVisible(false)
    }
    
    //function for when you overlap with the star (which has an extra checker) it will get destroyed, you'd think that if I just make the star itself do this it would work right!? NUH UH the countActive just breaks and the group breaks and everything breaks and um yes that's why its like this
    collectStar(avatar, item) {
        item.destroy();
    }

    //if you get touched by the enemy you get sent to the death scene
    endOfGame() {
        this.scene.start('death')
    }

    //Calls the input function + makes the NPC approach the player 100 pixels per second
    update() {
        this.handleInput();
        this.physics.moveToObject(this.npc3,this.avatar,100)
    }

    doorActions() {
        //If the player and the door overlap and the key is still on the game field, it will display the text box of the avatar talking which would give the hint to go searching for the key
        if (this.invisibleTrigger.countActive() == 1) {
            this.testBox = this.add.image(240, 350, "testBox").setOrigin(0)
            this.testBox.setScrollFactor(0)
            this.testBox.setVisible(true);

            this.dialogBoxFunction()

            this.avatarIcon = this.add.image(245, 355, "avatarIcon").setOrigin(0)
            this.avatarIcon.setScrollFactor(0)
            this.avatarIcon.setVisible(true);

            this.doorDialogBox.setScrollFactor(0)
            this.doorDialogBox.setPosition(325, 350);
            this.doorDialogBox.setVisible(true);

            this.physics.pause();
        }

        //However if the key has been acquired, then the state would change to the final act
        if (this.invisibleTrigger.countActive() == 0) {
            this.scene.start("act3");
        }
    }

    //When the spacebar is pressed (see handleInput) call this function, which just makes the parts disappear and resume the physics
    hideDialog() {
        this.doorDialogBox.setVisible(false);
        this.testBox.setVisible(false);
        this.avatarIcon.setVisible(false);
        
        this.physics.resume();
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
        const doorDialog = {
            text: "Maybe I have to\nfind a key...",
            style: configStyle
        };

        //sets the dialog box as well as the text goes in 
        this.doorDialogBox = this.make.text(doorDialog);
        this.doorDialogBox.setVisible(false);
        
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