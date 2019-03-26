var config = {
    title: "Starfall",
    width: 800,
    height: 600,
    parent: "game",
    backgroundColor: "#18216D",
    scene: {
        preload : preload,
        create: create,
        update: update
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
};
let game = new Phaser.Game(config);
let platform;
let star;
let info;
let delta = 1000;
let lastStarTime = 0;
let starsCaught = 0;
let starsFallen = 0;
function preload () {
    this.load.image("star", "/assets/images/star.png");
    this.load.image("platform", "/assets/images/platform.png");
}
function create () {
    platform =this.physics.add.staticGroup({
        key : 'platform',
        frameQuantity : 4
    });
    Phaser.Actions.PlaceOnLine(platform.getChildren(), new Phaser.Geom.Line(20, 580, 820, 580));
    // We also have to call refresh() to update the group bounding box (otherwise, the collisions will be checked against the default location, which is the top left corner of the scene).
    platform.refresh();
    info = this.add.text(10, 10, 'hello',
        { font: '24px Arial Bold', fill: '#FBFBAC' });
}
function update(time) {
    let diff = time-lastStarTime;
    if (diff > delta) {
        lastStarTime = time;
        if (delta > 500) {
            delta -= 20;
        }
        emitStar();
    }
    info.text =
    starsCaught + " caught - " +
    starsFallen + " fallen (max 3)";
}
function emitStar () {
    star = this.physics.add.image(Phaser.Math.Between(25, 775), 26, "star");
    star.setDisplaySize(50, 50);
    star.setVelocity(0, 200);
    star.setInteractive();
    star.on('pointerdown', this.onClick(star), this);
    this.physics.add.collider(star, this.sand,
    onFall(star), null, this);
}
 