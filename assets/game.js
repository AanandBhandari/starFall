 (function() {
     let platform;
     let star;
     let info;
     let delta = 1000;
     let lastStarTime = 0;
     let starsCaught = 0;
     let starsFallen = 0;
    let mainScene = new Phaser.Class({
        Extends : Phaser.Scene,
        initialize:
            function mainScene() {
                Phaser.Scene.call(this, { key: "mainScene" });
            },
        preload : function () {
            this.load.image("star", "/assets/images/star.png");
            this.load.image("platform", "/assets/images/platform.png");
        },
        create : function () {
            platform = this.physics.add.staticGroup({
                key: 'platform',
                frameQuantity: 4
            });
            Phaser.Actions.PlaceOnLine(platform.getChildren(), new Phaser.Geom.Line(20, 580, 820, 580));
            // We also have to call refresh() to update the group bounding box (otherwise, the collisions will be checked against the default location, which is the top left corner of the scene).
            platform.refresh();
            info = this.add.text(10, 10, '',
                { font: '24px Arial Bold', fill: '#FBFBAC' });
        },
        update: function (time) {
            console.log(delta);
            console.log(time);
            let diff = time - lastStarTime;
            if (diff > delta) {
                lastStarTime = time;
                if (delta > 500) {
                    delta -= 20;
                }
                this.emitStar();
            }
            info.text =
                starsCaught + " caught - " +
                starsFallen + " fallen (max 3)";
        },
        emitStar: function () {
                star = this.physics.add.image(Phaser.Math.Between(25, 775), 26, "star");
                star.setDisplaySize(50, 50);
                star.setVelocity(0, 200);
                star.setInteractive();
                star.on('pointerdown', this.onClick(star),this);
            this.physics.add.collider(star, platform, this.onFall(star), null, this);
        },
        onFall: function (star) {
            return function (){
                star.setTint(0xff0000);
                starsFallen += 1;
                this.time.delayedCall(500, function (star) {
                    star.destroy();
                    if (starsFallen > 2) {
                        this.scene.start("gameOverScene",
                            { starsCaught: starsCaught });
                    }
                }, [star], this);
            }
            
        },
        onClick : function (star) {
            // var _this = this;
            return function () {
                star.setTint(0x00ff00);
                star.setVelocity(0, 0);
                starsCaught += 1;
                this.time.delayedCall(100, function (star) {
                    star.destroy();
                }, [star], this);
            }
            
        } 
    });

    // welcome scene
    //  let title;
    //  var hint;
    let welcomeScene = new Phaser.Class ({
        Extends: Phaser.Scene,
        initialize:
            function welcomeScene() {
                Phaser.Scene.call(this, { key: "welcomeScene" });
            },
            create : function () {
               this.add.text(150, 200, 'StarFall',
                    { font: '128px Arial Bold', fill: '#FBFBAC' });
               this.add.text(300, 350, 'Click to start',
                    { font: '24px Arial Bold', fill: '#FBFBAC' });
                    // var _this = this;
                this.input.on('pointerdown', function (pointer) {
                    this.scene.start("mainScene");
                }, this)
            }

    })
    let gameOverScene = new Phaser.Class ( {
        Extends : Phaser.Scene,
        initialize :
                function gaemOverScene() {
                    Phaser.Scene.call(this,{key:"gameOverScene"});
                },
        create : function (score) {
            console.log(score);
            starsCaught = 0;
            starsFallen = 0;
            const resultText = 'Your score is ' + score.starsCaught + '!';
             this.add.text(200, 250, resultText,
                { font: '48px Arial Bold', fill: '#FBFBAC' });
             this.add.text(300, 350, 'Click to Restart',
                { font: '24px Arial Bold', fill: '#FBFBAC' });
            this.input.on('pointerdown', function (pointer) {
                this.scene.start("welcomeScene");
            }, this)
        }
    })
    new Phaser.Game({
        title: "Starfall",
        width: 800,
        height: 600,
        backgroundColor: "#18216D",
        scene: [welcomeScene,mainScene,gameOverScene],
        physics: {
            default: "arcade",
            arcade: {
                debug: true
            }
        }
    });

 }());