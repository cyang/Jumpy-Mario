// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');
            	
// Create our 'main' state that will contain the game
var mainState = {

    preload: function () { 
        // Change the background color of the game
        game.stage.backgroundColor = '#659CEF';
            
        // Load the bird sprite
        game.load.image('bird', 'assets/mario.png');
        game.load.image('pipe', 'assets/block.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('gameOver', 'assets/gameover.wav');
   
        
    },

    create: function () { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
            
        // Display the bird on the screen
        this.bird = this.game.add.sprite(100, 245, 'bird');
                   
            
        // Add gravity to the bird to make it fall
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;  
            
        // Call the 'jump' function when the spacekey is hit
        var jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpKey.onDown.add(this.jump, this);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');

        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = -1;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Consolas", fill: "gold" });
        
        if(this.highScore == undefined)
            this.highScore = 0;
            
        this.labelHighScore = this.game.add.text(170, 20, "High Score: " + this.highScore.toString(),  { font: "30px Consolas", fill: "gold" });

        this.bird.anchor.setTo(-0.2, 0.5);

        this.jumpSound = game.add.audio('jump');
        this.gameOverSound = game.add.audio('gameOver');

    },

    update: function () {  
        // If the bird is out of the world (too high or too low), call the 'restartGame' function
        if (this.bird.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        if (this.bird.angle < 20)
            this.bird.angle += 1;
            
        
            
    },
            
    // Make the bird jump 
    jump: function () {
        if (this.bird.alive == false)
            return; 

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        var animation = game.add.tween(this.bird);
        animation.to({ angle: -20 }, 100);

        animation.start();

        this.jumpSound.play();
        
        $('h1').hide(300);
        
      
    },

    hitPipe: function () {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;

        this.game.time.events.remove(this.timer);

        this.pipes.forEachAlive(function (p) {
            p.body.velocity.x = 0;
        }, this);

        this.gameOverSound.play();

    },
            
    // Restart the game
    restartGame: function () {  
        // Start the 'main' state, which restarts the game
        game.state.start('main');
       
    },

    addOnePipe: function (x, y) {

        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function () {
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);

        this.score += 1;
        this.labelScore.text = this.score;
        
        if(this.score >= this.highScore){
            this.highScore = this.score;
            this.labelHighScore.text = "High Score: " + this.highScore;
        }
    },

};
            
            
            
// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');