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
                star.on('pointerdown', this.onClick);
            this.physics.add.collider(star, platform, this.onFall(star), null, this);
        },
        onFall: function (star) {
            return function (){
                star.setTint(0xff0000);
                starsFallen += 1;
                this.time.delayedCall(500, function (star) {
                    star.destroy();
                }, [star], this);
            }
            
        },
        onClick : function (star) {
            console.log(star);
        } 
    });

    new Phaser.Game({
        title: "Starfall",
        width: 800,
        height: 600,
        backgroundColor: "#18216D",
        scene: [mainScene],
        physics: {
            default: "arcade",
            arcade: {
                debug: true
            }
        }
    });

 }());