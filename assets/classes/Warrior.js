import Effect from './Effect.js'
export default class Warrior
{
    
    constructor(scene, x, y, config)
    {
        this.scene=scene;
        this.x=x;
        this.y=y;
        this.baseX=config.baseX||0;
        this.baseY=config.baseY||0;
        this.brain=config.brain||undefined;
        this.objects=config.objects;
        this.projection=1;
        
        this.alive=true;

        this.vel={x:0,y:0};
        this.maxSpeed=10;
        this.reloadTime=600;
        this.canMove=true;
        this.canDash=false;
        this.dashTimer=this.scene.time.delayedCall(this.reloadTime,()=>{this.canDash=true},[],this);
        this.isDashing=false;
        this.isOnFloor=false;
        
        this.keyRight=false;
        this.keyLeft=false;
        this.keyUp=false;


        let colors=[0x003CC7,0xC70000,0xC76000,0x6100C7,0xC700BB];
        this.color=colors[Math.floor(colors.length*Math.random())];

        if(this.brain)
        {
            this.thinkTimer=this.scene.time.addEvent({
                delay: 10,
                startAt: 5+5*Math.random(),
                callback: ()=>{
                    this.thinkAndAct();
                },
                callbackScope: this,
                loop: true
            });
        }
        else
        {
            this.color=0x00C71F;
            this.createInputs();
        }
        
        this.createBody();
    }

    setContestantsNumber(a)
    {
        this.contestantsNumber=a;
    }

    setFlipped()
    {
        this.projection=-1;
    }

    mapObjects(object,ifDynamic=false)
    {
        this.raycaster.mapGameObjects(object, ifDynamic, {shape:'Arc'});
    }

    removeObjects(object)
    {
        this.raycaster.removeMappedObjects(object);
    }

    getPhysicBody()
    {
        return this.physicBody;
    }

    createBody()
    {
        /*
        this.physicBody=this.scene.matter.add.image(this.x,this.y,'void')
            .setCircle(0.5)
            .setScale(80)
            //.setInteractive(new Phaser.Geom.Circle(this.x, this.y, 40), Phaser.Geom.Circle.Contains)
            .setFixedRotation()
            .setFriction(0.2)
            .setFrictionAir(0.01)
            .setBounce(0.3)
            .setOnCollide(pair=>{
                if(pair.bodyA.gameObject)
                {
                    if(pair.bodyA.gameObject.type==='floor')
                    {
                        if(!this.isDashing)
                        {
                            this.canDash=true;
                        }
                        this.isOnFloor=true;
                    }
                }
            })
            .setOnCollideEnd(pair=>{
                //console.log(pair.bodyB.gameObject.body.isSensor)
                if(pair.bodyA.gameObject)
                {
                    if(pair.bodyA.gameObject.type==='floor')
                    {
                        this.isOnFloor=false;
                    }
                }
                
            });
        console.log(this.physicBody)
        */
        
        this.sounds=
        {
            swoosh:this.scene.sound.add('swoosh',{volume:0.3}),
            punch:this.scene.sound.add('punch',{volume:0.3}),
            jump:this.scene.sound.add('jump',{volume:0.3}),
            bump:this.scene.sound.add('bump',{volume:0.3}),
        };

        this.physicBody=this.scene.add.circle(this.x,this.y,40);

        this.scene.matter.add.gameObject(this.physicBody,{restitution:0.9, shape: { type: 'circle' } })
            .setFixedRotation()
            .setFriction(0.2)
            .setFrictionAir(0.01)
            .setBounce(0.3)
            .setOnCollide(pair=>{
                if(pair.bodyA.gameObject)
                {
                    if(pair.bodyA.gameObject.type==='floor')
                    {
                        if(!this.isDashing)
                        {
                            //this.canDash=true;
                        }
                        this.isOnFloor=true;
                        if(this.alive)
                        {
                            let bump=this.scene.sound.add('bump',{volume:0.3});
                            bump.setDetune(-600+200*Math.random());
                            let volume=Math.abs(this.physicBody.body.velocity.y/60);
                            if(volume<0.05)
                            {
                                volume=0;
                            }
                            else if(volume>0.1)
                            {
                                volume=0.1;
                            }
                            bump.setVolume(volume);
                            bump.play();
                        }
                    }
                }
            })
            .setOnCollideEnd(pair=>{
                //console.log(pair.bodyB.gameObject.body.isSensor)
                if(pair.bodyA.gameObject)
                {
                    if(pair.bodyA.gameObject.type==='floor')
                    {
                        this.isOnFloor=false;
                    }
                }
                
            });

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

        this.bodyBack=this.scene.add.image(0,0,'bodyBack');

        this.body=this.scene.add.image(0,0,'body')
            .setTint(this.color);
       
        this.hat=this.scene.add.image(0,-30,'hat')
            .setTint(this.color);

        
        
        this.container=this.scene.add.container(this.x, this.y, [this.bodyBack,this.body,this.hat])
            .setScale(0.01);

            /*
        if(!this.brain)
        {
            this.mark=this.scene.add.image(0,-80,'mark')
                .setTint(this.color);
            this.container.add(this.mark)
        } */
        
        this.eye=this.scene.add.image(this.x,this.y,'eye')
            .setTint(this.color)
            .setScale(0.01);

        this.scaleUpTween=this.scene.tweens.add({
            targets:[this.container,this.eye,this.sword],
            scale:1,
            duration:200,
            ease:'Linear',
            onComplete:()=>{
            }
        });

        /*
        this.pinSpearToBody1=this.scene.matter.add.spring(this.physicBody,this.spear,30,0.1,
            {
                pointA:
                {
                    x:-100,
                    y:15,
                },
                pointB:
                {
                    x:-130,
                    y:0,
                }
            });
        
        this.pinSpearToBody2=this.scene.matter.add.spring(this.spear,this.physicBody,30,0.1,
            {
                pointB:
                {
                    x:100,
                    y:15,
                },
                pointA:
                {
                    x:0,
                    y:0,
                }
            });
        */

    }

    setEnemy(enemy)
    {
        this.enemy=enemy;
        this.physicBody.setOnCollideWith(this.enemy.sword,()=>{
            if(this.enemy.sword.enabled)
            {
                if(this.alive && this.enemy.alive)
                {
                    new Effect(this.scene, this.physicBody.x, this.physicBody.y, Math.sign(this.enemy.physicBody.body.velocity.x), this.color);
                }
                if(this.alive)
                {
                    this.sounds.punch.setDetune(-500+200*Math.random());
                    this.sounds.punch.play();
                    this.destroy();
                }
            }
        });
    }

    clear()
    {
        this.alive=false;
        
        //this.scene.removeItemOnce(this.scene.warriors,this);

        this.physicBody.destroy();
        this.sword.destroy();
        this.container.destroy();
        this.eye.destroy();
        if(this.thinkTimer)
        {
            this.thinkTimer.remove();
        }
        if(this.scaleUpTween)
        {
            this.scaleUpTween.remove();
        }
        if(this.dashTween)
        {
            this.dashTween.stop();
            this.dashTween.remove();
        }
        if(this.dashTimer)
        {
            this.dashTimer.remove();
        }
        if(this.dashHoldTimer)
        {
            this.dashHoldTimer.remove();
        }
    }

    destroy()
    {
        this.alive=false;
        
        this.scene.removeItemOnce(this.scene.warriors,this);

        if(this.destroyFunc)
        {
            this.destroyFunc();
        }
                
        this.physicBody.destroy();
        this.sword.destroy();
        this.container.destroy();
        this.eye.destroy();
        if(this.thinkTimer)
        {
            this.thinkTimer.remove();
        }
        if(this.scaleUpTween)
        {
            this.scaleUpTween.remove();
        }
        if(this.dashTween)
        {
            this.dashTween.stop();
            this.dashTween.remove();
        }
        if(this.dashTimer)
        {
            this.dashTimer.remove();
        }
        if(this.dashHoldTimer)
        {
            this.dashHoldTimer.remove();
        }
    }

    createInputs()
    {
        this.scene.input.keyboard
            .on('keydown-UP', ()=>{
                this.keyUp=true;
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
                this.dash(Math.PI);
            });

        this.scene.input.keyboard
            .on('keydown-C', ()=>{
                this.dash(0);
            });
        
        this.scene.input.keyboard
            .on('keydown-W', ()=>{
                this.keyUp=true;
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
                this.dash(Math.PI);
            });

        this.scene.input.keyboard
            .on('keydown-K', ()=>{
                this.dash(0);
            });
    }

    dash(direction)
    {
        if(this.alive && this.canDash)
        {
            this.canDash=false;
            this.canMove=false;
            this.isDashing=true;
            this.sword.enabled=true;
            this.sword.setVisible(true);

            this.sword.rotation=direction;

            this.sounds.swoosh.setDetune(-400+400*Math.random());
            this.sounds.swoosh.play();
            //this.scene.sound.play('swoosh');

            this.physicBody.setVelocityX(3.8*this.maxSpeed*Math.cos(this.sword.rotation));
            this.physicBody.setVelocityY(3.8*this.maxSpeed*Math.sin(this.sword.rotation));
            //this.physicBody.setVelocityY(Math.min(this.physicBody.body.velocity.y*0.4,0));

            this.dashTimer=this.scene.time.delayedCall(this.reloadTime,()=>{this.canDash=true},[],this);
            if(this.alive)
            {
                this.dashTween=this.scene.tweens.add({
                    targets:this.sword,
                    len:75,
                    duration:120,
                    ease:'Expo.easeOut',
                    onComplete:()=>{
                        if(this.alive)
                        {
                            this.physicBody.setVelocityX(this.physicBody.body.velocity.x*0.32);
                            this.physicBody.setVelocityY(this.physicBody.body.velocity.y*0.32);
                            this.dashHoldTimer=this.scene.time.delayedCall(240,()=>{
                                if(this.alive)
                                {
                                    this.canMove=true;
                                    this.sword.enabled=false;
                                    this.dashTween=this.scene.tweens.add({
                                        targets:this.sword,
                                        len:0,
                                        duration:120,
                                        ease:'Expo.easeOut',
                                        onComplete:()=>{
                                            if(this.alive)
                                            {
                                                this.isDashing=false;
                                                this.sword.setVisible(false);
                                                if(this.isOnFloor)
                                                {
                                                    //this.canDash=true;
                                                }
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

    thinkAndAct()
    {
        this.keyRight=false;
        this.keyLeft=false;
        this.keyUp=false;
        this.keyDash=false;

        if(this.alive && this.enemy.alive)
        {
            let input=[];

            if(this.projection>0)
            {
                input.push(this.projection*(this.physicBody.x-this.baseX+900)/1800);
            }
            else
            {
                input.push(this.projection*(this.physicBody.x-this.baseX-900)/1800);
            }
            input.push(this.projection*(this.enemy.physicBody.x-this.physicBody.x)/1800);
            input.push((this.enemy.physicBody.y-this.physicBody.y)/800);
            input.push((this.baseY+400-this.physicBody.y)/800);
            input.push(this.projection*(this.enemy.physicBody.body.velocity.x-this.physicBody.body.velocity.x)/90);
            input.push((this.enemy.physicBody.body.velocity.y-this.physicBody.body.velocity.y)/90);

            input.push(this.canMove);
            input.push(this.canDash);
            if(this.dashTimer)
            {
                input.push((this.dashTimer.delay-this.dashTimer.elapsed)/this.dashTimer.delay);
            }
            else
            {
                input.push(0);
            }
            input.push(this.isOnFloor);

            input.push(this.enemy.canMove);
            input.push(this.enemy.canDash);
            if(this.enemy.dashTimer)
            {
                input.push((this.enemy.dashTimer.delay-this.enemy.dashTimer.elapsed)/this.enemy.dashTimer.delay);
            }
            else
            {
                input.push(0);
            }
            input.push(this.enemy.isOnFloor);
            
            let output=this.brain.getOutput(input);
            
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
                }
                let maxOfDashAction=Math.max(output[3],output[4]);
                if(maxOfDashAction>0)
                {
                    if(maxOfDashAction===output[3])
                    {
                        this.dash(this.dash(Math.PI));
                    }
                    else if(maxOfDashAction===output[4])
                    {
                        this.dash(this.dash(0));
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
                }
                let maxOfDashAction=Math.max(output[3],output[4]);
                if(maxOfDashAction>0)
                {
                    if(maxOfDashAction===output[3])
                    {
                        this.dash(this.dash(0));
                    }
                    if(maxOfDashAction===output[4])
                    {
                        this.dash(this.dash(Math.PI));
                    }
                }
            }
        }
    }

    update()
    {
        if(this.alive)
        {
            if(this.canMove)
            {
                if((this.keyRight-this.keyLeft)!==0)
                {
                    if(Math.abs(this.vel.x)<this.maxSpeed)
                    {
                        this.vel.x+=0.1*this.maxSpeed*(this.keyRight-this.keyLeft);
                    }
                    else
                    {
                        this.vel.x=this.maxSpeed*Math.sign(this.keyRight-this.keyLeft);
                    }
                    this.physicBody.setVelocityX(this.vel.x);
                }
                else
                {
                    this.vel.x+=-0.5*(this.vel.x);
                }
                
                if(this.keyUp)
                {
                    if(this.isOnFloor)
                        {
                            this.sounds.swoosh.setDetune(-800+300*Math.random());
                            this.sounds.swoosh.play();
                            this.physicBody.setVelocityY(-30);
                        }
                }
            }
            
            this.sword.setPosition(24*Math.cos(this.sword.rotation)+this.physicBody.x+this.sword.len*Math.cos(this.sword.rotation),24*Math.sin(this.sword.rotation)+this.physicBody.y+this.sword.len*Math.sin(this.sword.rotation));

            this.container.setPosition(this.physicBody.x,this.physicBody.y);
            this.container.rotation+=((this.keyRight-this.keyLeft)*0.24-this.container.rotation)*0.1;

            this.eye.x+=(this.container.x+
                Math.sign(this.physicBody.body.velocity.x)*Math.min(15,1.5*Math.abs(this.physicBody.body.velocity.x))-this.eye.x)*0.8;
            this.eye.y+=(this.container.y+
                Math.sign(this.physicBody.body.velocity.y)*Math.min(15,1.5*Math.abs(this.physicBody.body.velocity.y))-this.eye.y)*0.8;
        }
    }
}