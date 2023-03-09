

export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super('Preloader');
    }

    init()
    {
    }

    preload()
    {
        this.load.image('void', 'assets/sprites/void.png');
        this.load.image('wall', 'assets/sprites/wall.png');
        this.load.image('bodyBack', 'assets/sprites/bodyBack.png');
        this.load.image('body', 'assets/sprites/body.png');
        this.load.image('eye', 'assets/sprites/eye.png');
        this.load.image('fire', 'assets/sprites/fire.png');
        this.load.image('hat', 'assets/sprites/hat.png');
        this.load.image('spear', 'assets/sprites/spear.png');
        this.load.image('leftHand', 'assets/sprites/leftHand.png');
        this.load.image('rightHand', 'assets/sprites/rightHand.png');
        this.load.image('leg', 'assets/sprites/leg.png');
        this.load.image('spring', 'assets/sprites/spring.png');
        this.load.image('knife', 'assets/sprites/knife.png');
        this.load.image('sword', 'assets/sprites/sword.png');
        this.load.image('mark', 'assets/sprites/mark.png');
        this.load.image('enlarge', 'assets/sprites/enlarge.png');
        this.load.image('restart', 'assets/sprites/restart.png');
        this.load.image('play', 'assets/sprites/play.png');
        this.load.image('stop', 'assets/sprites/stop.png');
    }

    create()
    {
        /*
        scene.anims.create({
            key: "burn",
            frameRate: 20,
            frames: scene.anims.generateFrameNumbers("tile", { start: 0, end: 5 }),
        });
        */
        this.time.delayedCall(1500,()=>{this.scene.start('Main')},[],this);
    }

    update()
    {
    }
}

