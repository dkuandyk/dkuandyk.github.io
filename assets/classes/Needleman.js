import Warrior from './Warrior.js'

export default class Needleman extends Warrior
{
    
    constructor(scene, x, y, config)
    {
        super(scene,x,y,config);
    }

    createWeapon()
    {
        this.sword=this.scene.matter.add.image(this.x,this.y,'needle')
            .setCircle(70)
            .setSensor(true)
            .setOrigin(0.5)
            .setIgnoreGravity(true)
            .setTint(this.color)
            .setVisible(false)
            .setPosition(0,this.baseY-850);
        
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
                    this.attack(Math.PI);
                }
                else if(maxOfDashAction===output[4])
                {
                    this.attack(0);
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
                    this.attack(0);
                }
                if(maxOfDashAction===output[4])
                {
                    this.attack(Math.PI);
                }
            }
        }
    }

    jump()
    {
        if(this.isOnFloor)
        {
            if(!this.muted)
            {
                this.scene.sound.play('swoosh',{volume:0.3,detune:-800+300*Math.random()});
            }
            this.physicBody.setVelocityY(-25);
        }
    }

    attack(direction)
    {
        if(this.alive && this.canAttack)
        {
            this.canAttack=false;
            //this.canMove=false;
            this.sword.enabled=true;
            this.sword.setVisible(true);
            //this.sword.setRotation(-Math.PI);
            //this.sword.setScale(0.005);
            if(direction===Math.PI)
            {                
                //this.sword.rotation=direction;
                //this.sword.setRotation(2*Math.PI);
            }
            //

            this.attackingDirection=direction===0 ? 1 : -1;
            
            if(!this.muted)
            {
                //this.scene.sound.play('swoosh',{volume:0.3,detune:-400+400*Math.random()});
            }

            //this.physicBody.setVelocityX(2.0*this.maxSpeed*Math.cos(direction));
            //this.physicBody.setVelocityY(2.0*this.maxSpeed*Math.sin(direction));

            this.attackTimer=this.scene.time.delayedCall(800,()=>{this.canAttack=true},[],this);

            if(this.alive)
            {
                this.attackTween=this.scene.tweens.add({
                    targets:this.sword,
                    scale:1,
                    duration:100,
                    ease:'Quint.easeOut',
                    onComplete:()=>{
                        if(this.alive)
                        {
                            this.attackHoldTimer=this.scene.time.delayedCall(200,()=>{
                                if(this.alive)
                                {
                                    this.canMove=true;
                                    this.attackTween=this.scene.tweens.add({
                                        targets:this.sword,
                                        scale:0.05,
                                        duration:100,
                                        ease:'Quint.easeIn',
                                        onComplete:()=>{
                                            if(this.alive)
                                            {
                                                this.sword.enabled=false;
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
        if(!this.sword.visible)
        {
            if(this.sword.y!==this.baseY-850)
            {
                this.sword.setPosition(0,this.baseY-850);
            }
        }
        else
        {
            this.sword.setPosition(this.physicBody.x,this.physicBody.y);
        }
    }
}