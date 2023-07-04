import Warrior from './Warrior.js'

export default class Puppet extends Warrior
{
    
    constructor(scene, x, y, config)
    {
        super(scene,x,y,config);
    }

    createWeapon()
    {
        this.sword=this.scene.matter.add.image(this.x,this.y,'sword')
            .setCircle(10)
            .setSensor(true)
            .setOrigin(54/66,0.5)
            .setIgnoreGravity(true)
            .setTint(this.color)
            .setVisible(false)
            .setScale(0.01);
        
        this.sword.len=0;
        this.sword.enabled=false;
        
        this.attacks.push(this.sword);
    }
    
    destroyWeapon()
    {
        if(this.attackTween)
        {
            this.attackTween.stop();
            this.attackTween.remove();
        }
        if(this.attackTimer)
        {
            this.attackTimer.remove();
        }
        if(this.attackHoldTimer)
        {
            this.attackHoldTimer.remove();
        }
    }

    thinkAndAct()
    {
        this.keyRight=false;
        this.keyLeft=false;
        this.keyUp=false;

        if(this.alive && this.enemy.alive)
        {
            if(Math.abs(this.enemy.physicBody.y-this.physicBody.y)<50)
            {
                if(Math.abs(this.enemy.physicBody.x-this.physicBody.x)>450)
                {
                    if(Math.sign(this.enemy.physicBody.x-this.physicBody.x)>0)
                    {
                        this.keyRight=true;
                    }
                    else if(Math.sign(this.enemy.physicBody.x-this.physicBody.x)<=0)
                    {
                        this.keyLeft=true;
                    }
                }
                else
                {
                    if(Math.sign(this.enemy.physicBody.x-this.physicBody.x)>0)
                    {
                        this.attack(0);
                    }
                    else if(Math.sign(this.enemy.physicBody.x-this.physicBody.x)<=0)
                    {
                        this.attack(Math.PI);
                    }
                }
            }            
        }
    }

    attack(direction)
    {
        if(this.alive && this.canAttack)
        {
            this.canAttack=false;
            this.canMove=false;
            this.sword.enabled=true;
            this.sword.setVisible(true);

            this.physicBody.setIgnoreGravity(true);

            this.sword.rotation=direction;

            if(!this.muted)
            {
                this.scene.sound.play('swoosh',{volume:0.3,detune:-400+400*Math.random()});
            }
            //this.sounds.swoosh.play();
            //this.scene.sound.play('swoosh');

            this.physicBody.setVelocityX(3.8*this.maxSpeed*Math.cos(this.sword.rotation));
            this.physicBody.setVelocityY(3.8*this.maxSpeed*Math.sin(this.sword.rotation));
            //this.physicBody.setVelocityY(Math.min(this.physicBody.body.velocity.y*0.4,0));

            this.attackTimer=this.scene.time.delayedCall(this.reloadTime,()=>{this.canAttack=true},[],this);
            if(this.alive)
            {
                this.attackTween=this.scene.tweens.add({
                    targets:this.sword,
                    len:75,
                    duration:120,
                    ease:'Expo.easeOut',
                    onComplete:()=>{
                        if(this.alive)
                        {
                            this.physicBody.setVelocityX(this.physicBody.body.velocity.x*0.32);
                            this.physicBody.setVelocityY(this.physicBody.body.velocity.y*0.32);
                            this.physicBody.setIgnoreGravity(false);
                            this.attackHoldTimer=this.scene.time.delayedCall(240,()=>{
                                if(this.alive)
                                {
                                    this.canMove=true;
                                    this.sword.enabled=false;
                                    this.attackTween=this.scene.tweens.add({
                                        targets:this.sword,
                                        len:0,
                                        duration:120,
                                        ease:'Expo.easeOut',
                                        onComplete:()=>{
                                            if(this.alive)
                                            {
                                                this.sword.setVisible(false);
                                            }
                                        }
                                    });
                                }
                            },[],this.scene);
                        }
                    }
                }); 
            }
        }
    }
        
    createInputs()
    {
        this.scene.input.keyboard
            .on('keydown-UP', ()=>{
                this.keyUp=true;
                //this.jump();
            })
            .on('keyup-UP', ()=>{
                this.keyUp=false;
            });
        this.scene.input.keyboard
            .on('keydown-LEFT', ()=>{
                this.keyLeft=true;
            })
            .on('keyup-LEFT', ()=>{
                this.keyLeft=false;
            });
        this.scene.input.keyboard
            .on('keydown-RIGHT', ()=>{
                this.keyRight=true;
            })
            .on('keyup-RIGHT', ()=>{
                this.keyRight=false;
            });

        this.scene.input.keyboard
            .on('keydown-X', ()=>{
                this.attack(Math.PI);
            });

        this.scene.input.keyboard
            .on('keydown-C', ()=>{
                this.attack(0);
            });
        
        this.scene.input.keyboard
            .on('keydown-W', ()=>{
                this.keyUp=true;
                //this.jump();
            })
            .on('keyup-W', ()=>{
                this.keyUp=false;
            });
        this.scene.input.keyboard
            .on('keydown-A', ()=>{
                this.keyLeft=true;
            })
            .on('keyup-A', ()=>{
                this.keyLeft=false;
            });
        this.scene.input.keyboard
            .on('keydown-D', ()=>{
                this.keyRight=true;
            })
            .on('keyup-D', ()=>{
                this.keyRight=false;
            });

        this.scene.input.keyboard
            .on('keydown-J', ()=>{
                this.attack(Math.PI);
            });

        this.scene.input.keyboard
            .on('keydown-K', ()=>{
                this.attack(0);
            });
    }

    updateWeapon()
    {
        this.sword.setPosition(24*Math.cos(this.sword.rotation)+this.physicBody.x+this.sword.len*Math.cos(this.sword.rotation),24*Math.sin(this.sword.rotation)+this.physicBody.y+this.sword.len*Math.sin(this.sword.rotation));
        /*
        this.spring.setPosition(this.physicBody.x,this.physicBody.y);
        this.spring.setRotation(this.sword.rotation);
        this.spring.setScale(Math.abs(this.sword.x-this.physicBody.x)/102,1);
        */
    }
}