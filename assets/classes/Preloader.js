

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
        this.load.image('fire', 'assets/sprites/fire.png');
        
        this.load.image('eye', 'assets/sprites/eye.png');
        this.load.image('eye1', 'assets/sprites/eye1.png');
        this.load.image('eye2', 'assets/sprites/eye2.png');
        this.load.image('eye3', 'assets/sprites/eye3.png');
        this.load.image('eye4', 'assets/sprites/eye4.png');
        this.load.image('eye5', 'assets/sprites/eye5.png');

        this.load.image('ears', 'assets/sprites/ears.png');
        this.load.image('ears1', 'assets/sprites/ears1.png');
        this.load.image('ears2', 'assets/sprites/ears2.png');
        this.load.image('ears3', 'assets/sprites/ears3.png');
        this.load.image('ears4', 'assets/sprites/ears4.png');
        this.load.image('ears5', 'assets/sprites/ears5.png');

        this.load.image('hat', 'assets/sprites/hat.png');
        this.load.image('hat1', 'assets/sprites/hat1.png');
        this.load.image('hat2', 'assets/sprites/hat2.png');
        this.load.image('hat3', 'assets/sprites/hat3.png');
        this.load.image('hat4', 'assets/sprites/hat4.png');
        this.load.image('hat5', 'assets/sprites/hat5.png');

        this.load.image('dagger', 'assets/sprites/dagger.png');
        this.load.image('dagger1', 'assets/sprites/dagger1.png');

        this.load.image('spear', 'assets/sprites/spear.png');
        this.load.image('leftHand', 'assets/sprites/leftHand.png');
        this.load.image('rightHand', 'assets/sprites/rightHand.png');
        this.load.image('leg', 'assets/sprites/leg.png');
        this.load.image('spring', 'assets/sprites/spring.png');
        this.load.image('knife', 'assets/sprites/knife.png');
        this.load.image('sword', 'assets/sprites/sword.png');
        this.load.image('gun', 'assets/sprites/gun.png');
        this.load.image('lazer', 'assets/sprites/lazer.png');
        this.load.image('needle', 'assets/sprites/needle.png');

        this.load.image('mark', 'assets/sprites/mark.png');
        this.load.image('mark1', 'assets/sprites/mark1.png');
        this.load.image('mark2', 'assets/sprites/mark2.png');
        this.load.image('play', 'assets/sprites/play.png');
        this.load.image('restart', 'assets/sprites/restart.png');
        this.load.image('enlarge', 'assets/sprites/enlarge.png');
        this.load.image('enmin', 'assets/sprites/enmin.png');
        this.load.image('soundOn', 'assets/sprites/soundOn.png');
        this.load.image('soundOff', 'assets/sprites/soundOff.png');

        this.load.audio('swoosh', 'assets/sounds/swoosh.wav');
        this.load.audio('punch', 'assets/sounds/punch.wav');
        this.load.audio('jump', 'assets/sounds/jump.wav');
        this.load.audio('bump', 'assets/sounds/bump.wav');

        this.load.once('complete',()=>{this.scene.start('Main')},this);
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
        this.sound.unlock();
    }

    update()
    {
    }
}

