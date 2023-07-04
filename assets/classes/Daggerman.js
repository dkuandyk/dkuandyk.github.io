import Warrior from './Warrior.js'

export default class Daggerman extends Warrior
{
    
    constructor(scene, x, y, config)
    {
        super(scene,x,y,config);
    }

    createWeapon()
    {
        let daggerList=['dagger','dagger1'];

        this.sword=this.scene.matter.add.image(this.x,this.y,daggerList[Math.floor(daggerList.length*Math.random())])
            .setRectangle(50,10)
            .setSensor(true)
            .setOrigin(0.6,0.5)
            .setIgnoreGravity(true)
            .setTint(this.color)
            .setVisible(false)
            .setPosition(0,this.baseY-850);
        
        this.sword.len=0;
        this.sword.enabled=false;
        }
    
    destroyWeapon()
    {
        this.sword.destroy();
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

    act(output)
    {
        
        this.keyRight=false;
        this.keyLeft=false;
        this.keyUp=false;
        
        if(this.projection>0)
        {
            if(output[0]>0)
            {
                this.keyLeft=true;
            }
            if(output[1]>0)
            {
                this.keyRight=true;
            }
            if(output[2]>0)
            {
                this.keyUp=true;
                //this.jump();
            }
            let maxOfDashAction=Math.max(output[3],output[4]);
            if(maxOfDashAction>0)
            {
                if(maxOfDashAction===output[3])
                {
                    this.attack(0);
                }
                else if(maxOfDashAction===output[4])
                {
                    this.attack(Math.PI);
                }
            }
        }
        else
        {
            if(output[0]>0)
            {
                this.keyRight=true;
            }
            if(output[1]>0)
            {
                this.keyLeft=true;
            }
            if(output[2]>0)
            {
                this.keyUp=true;
                //this.jump();
            }
            let maxOfDashAction=Math.max(output[3],output[4]);
            if(maxOfDashAction>0)
            {
                if(maxOfDashAction===output[3])
                {
                    this.attack(Math.PI);
                }
                else if(maxOfDashAction===output[4])
                {
                    this.attack(0);
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

            this.attackingDirection = direction===0 ? 1 : -1;
            
            if(!this.muted)
            {
                this.scene.sound.play('swoosh',{volume:0.3,detune:-400+400*Math.random()});
            }
            //this.sounds.swoosh.play();
            //this.scene.sound.play('swoosh');

            this.physicBody.setVelocityX(4.0*this.maxSpeed*Math.cos(this.sword.rotation));
            this.physicBody.setVelocityY(4.0*this.maxSpeed*Math.sin(this.sword.rotation));
            //this.physicBody.setVelocityY(Math.min(this.physicBody.body.velocity.y*0.4,0));

            this.attackTimer=this.scene.time.delayedCall(this.reloadTime,()=>{
                this.canAttack=true;
            },[],this);
            if(this.alive)
            {
                this.attackTween=this.scene.tweens.add({
                    targets:this.sword,
                    len:65,
                    duration:120,
                    ease:'Expo.easeOut',
                    onComplete:()=>{
                        if(this.alive)
                        {
                            if (direction!==Math.PI*0.5)
                            {
                                this.physicBody.setVelocityX(this.physicBody.body.velocity.x*0.32);
                                this.physicBody.setVelocityY(this.physicBody.body.velocity.y*0.32);
                            }
                            this.physicBody.setIgnoreGravity(false);
                            this.attackHoldTimer=this.scene.time.delayedCall(240,()=>{
                                if(this.alive)
                                {
                                    this.canMove=true;
                                    this.sword.enabled=false;
                                    this.attackingDirection=0;
                                    this.attackTween=this.scene.tweens.add({
                                        targets:this.sword,
                                        len:-15,
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
            .on('keydown-SPACE', ()=>{
                this.keyUp=true;
                //this.jump();
            })
            .on('keyup-SPACE', ()=>{
                this.keyUp=false;
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
            .on('keydown-S', ()=>{
                this.keyDown=true;
            })
            .on('keyup-S', ()=>{
                this.keyDown=false;
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
        if(!this.sword.visible)
        {
            if(this.sword.y!==this.baseY-850)
            {
                this.sword.setPosition(0,this.baseY-850);
            }
        }
        else
        {
            this.sword.setPosition(24*Math.cos(this.sword.rotation)+this.physicBody.x+this.sword.len*Math.cos(this.sword.rotation),24*Math.sin(this.sword.rotation)+this.physicBody.y+this.sword.len*Math.sin(this.sword.rotation));
        }
    }
}