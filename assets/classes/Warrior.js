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
        this.muted=config.muted||false;
        this.projection=1;
        
        this.alive=true;

        this.vel={x:0,y:0};
        this.maxSpeed=9;
        this.reloadTime=600;
        this.canMove=true;
        this.canAttack=false;
        this.attackTimer=this.scene.time.delayedCall(this.reloadTime,()=>{this.canAttack=true},[],this);
        this.isOnFloor=false;
        
        this.keyRight=false;
        this.keyLeft=false;
        this.keyUp=false;
        this.keyDown=false;

        this.attackingDirection=1;
        
        let colors=[0x4f0a19,0xb51616,0xbf2192,0x5d0991, 0x078a07, 0x11a855, 0x0c8d96];
        this.color=colors[Math.floor(colors.length*Math.random())];

        if(this.brain)
        {
            this.thinkTimer=this.scene.time.addEvent({
                delay: 5,
                startAt: 5+5*Math.random(),
                callback: ()=>{
                    //this.thinkAndAct();
                },
                callbackScope: this,
                loop: true
            });
        }
        else
        {
            this.color=0x13099c;
            this.createInputs();
        }
        
        this.createBody();
    }
    
    setFlipped()
    {
        this.projection=-1;
    }

    removeObjects(object)
    {
        this.raycaster.removeMappedObjects(object);
    }
    
    createBody()
    {        
        this.physicBody=this.scene.add.circle(this.x,this.y,40);
        
        this.scene.matter.add.gameObject(this.physicBody,{restitution:0.9, shape: { type: 'circle' } })
            //.setCollisionGroup(-5)
            .setFixedRotation()
            .setFriction(0.3)
            .setFrictionAir(0.01)
            .setBounce(0.25)
            .setOnCollide(pair=>{
                if(pair.bodyA.gameObject)
                {
                    if(pair.bodyA.gameObject.type==='floor')
                    {
                        this.isOnFloor=true;
                        if(this.alive)
                        {
                            let volume=Math.abs(this.physicBody.body.velocity.y/60);
                            if(volume<0.05)
                            {
                                volume=0;
                            }
                            else if(volume>0.1)
                            {
                                volume=0.1;
                            }
                            if(!this.muted)
                            {
                                this.scene.sound.play('bump',{volume:volume,detune:-600+200*Math.random()});
                            }
                        }
                    }
                }
            })
            .setOnCollideEnd(pair=>{
                if(pair.bodyA.gameObject)
                {
                    if(pair.bodyA.gameObject.type==='floor')
                    {
                        this.isOnFloor=false;
                    }
                }
            });

        this.createWeapon();

        let earsList=['ears','ears1','ears2','ears3','ears4','ears5'];

        this.ears=this.scene.add.image(0,-25,earsList[Math.floor(earsList.length*Math.random())])
            .setTint(this.color);

        let hatList=['hat','hat1','hat2','hat3','hat4','hat5'];

        this.hat=this.scene.add.image(0,-45,hatList[Math.floor(hatList.length*Math.random())]);

        this.bodyBack=this.scene.add.image(0,0,'bodyBack')
            //.setTint(0xf5f5f5)
            .setTint(0xffffff);

        this.body=this.scene.add.image(0,0,'body')
            .setTint(this.color);
        
        //    .setTint(this.color);

        
        this.container=this.scene.add.container(this.x, this.y, [this.ears,this.bodyBack,this.body,this.hat])
        //this.container=this.scene.add.container(this.x, this.y, [this.ears,this.bodyBack,this.body])
            .setScale(0.01);

        let eyeList=['eye','eye1','eye2','eye3','eye4','eye5'];
        
        this.eye=this.scene.add.image(this.x,this.y,eyeList[Math.floor(eyeList.length*Math.random())])
            //.setTint(this.color)
            .setScale(0.01);

        this.scaleUpTween=this.scene.tweens.add({
            targets:[this.container,this.eye,this.sword],
            scale:1,
            duration:200,
            ease:'Linear',
            onComplete:()=>{
            }
        });

    }

    jump()
    {
        if(this.isOnFloor)
        {
            if(!this.muted)
            {
                this.scene.sound.play('swoosh',{volume:0.3,detune:-800+300*Math.random()});
            }
            this.physicBody.setVelocityY(-30);
        }
    }

    setEnemy(enemy)
    {
        this.enemy=enemy;
        this.physicBody.setOnCollideWith(this.enemy.sword,()=>{
            if(this.enemy.sword.enabled)
            {
                if(this.alive)
                {
                    let effectDirection=0;
                    if(this.enemy.attackingDirection===-1)
                    {
                        effectDirection=Math.PI;
                    }
                    new Effect(this.scene, this.physicBody.x, this.physicBody.y, effectDirection, this.color);
                    
                    if(!this.muted)
                    {
                        
                        this.scene.sound.play('punch',{volume:0.3,detune:-500+200*Math.random()});
                    }
                    this.destroy();
                }
            }
        });
        /*
        this.physicBody.setOnCollideWith(this.enemy.attacks,attack=>{
            if(this.alive && this.enemy.alive)
            {
                if(attack.gameObject.enabled)
                {
                    if(!this.muted)
                    {
                        new Effect(this.scene, this.physicBody.x, this.physicBody.y, Math.sign(this.enemy.physicBody.body.velocity.x), this.color);
                    }
                    if(this.alive)
                    {
                        //this.sounds.punch.setDetune(-500+200*Math.random());
                        if(!this.muted)
                        {
                            this.scene.sound.play('punch',{volume:0.3,detune:-500+200*Math.random()});
                        }
                        this.destroy();
                    }

                }
            }
        });
        */
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
        
        this.destroyWeapon();
    }

    destroy()
    {
        this.alive=false;
        
        //this.scene.removeItemOnce(this.scene.warriors,this);

        if(this.destroyFunc)
        {
            this.destroyFunc();
        }
                
        this.physicBody.destroy();
        
        //this.sword.destroy();

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
        
        this.destroyWeapon();
    }

    thinkAndAct()
    {

        if(this.alive && this.enemy.alive)
        {
            let input=[];

            this.projection=Math.sign(this.enemy.physicBody.x-this.physicBody.x);
            if(this.projection===0)
            {
                this.projection=1;
            }

            input.push(Math.abs(this.projection*(this.baseX-this.projection*900-this.physicBody.x)/1800));
            input.push(this.projection*(this.baseX+this.projection*900-this.physicBody.x)/1800);
            //input.push(this.projection*(this.baseX-this.enemy.physicBody.x)/1800);
            
            input.push((this.baseY+400-this.physicBody.y)/800);
            input.push((this.baseY+400-this.enemy.physicBody.y)/800);

            input.push(this.projection*(this.enemy.physicBody.x-this.physicBody.x)/1800);
            input.push(antiLerp(-1,1,(this.enemy.physicBody.y-this.physicBody.y)/800));
            input.push(antiLerp(-1,1,this.projection*this.enemy.physicBody.body.velocity.x/40));            
            input.push(antiLerp(-1,1,this.projection*this.physicBody.body.velocity.x/40));
            input.push(antiLerp(-1,1,this.enemy.physicBody.body.velocity.y/30));
            input.push(antiLerp(-1,1,this.physicBody.body.velocity.y/30));

            input.push(this.canMove);
            input.push(this.canAttack);
            if(this.attackTimer)
            {
                let timeCut=(this.attackTimer.delay-this.attackTimer.elapsed)/this.attackTimer.delay;
                input.push(timeCut);
                if(timeCut===0)
                {
                    input.push(0);
                }
                else
                {
                    let attackingDirection = this.sword.rotation===0 ? 1 : -1;
                    input.push(antiLerp(-1,1,this.projection*attackingDirection));
                }
            }
            else
            {
                input.push(0);
                input.push(0);
            }
            input.push(this.isOnFloor);

            input.push(this.enemy.canMove);
            input.push(this.enemy.canAttack);
            if(this.enemy.attackTimer)
            {
                let timeCut=(this.enemy.attackTimer.delay-this.enemy.attackTimer.elapsed)/this.enemy.attackTimer.delay;
                input.push(timeCut);
                if(timeCut===0)
                {
                    input.push(0);
                }
                else
                {
                    let attackingDirection = this.enemy.sword.rotation===0 ? 1 : -1;
                    input.push(antiLerp(-1,1,this.projection*attackingDirection));
                }
            }
            else
            {
                input.push(0);
                input.push(0);
            }
            input.push(this.enemy.isOnFloor);
            
            input.push(antiLerp(-1,1,this.keyUp));
            input.push(antiLerp(-1,1,this.keyRight*this.projection));
            input.push(antiLerp(-1,1,this.keyLeft*this.projection));
            
            input.push(antiLerp(-1,1,this.enemy.keyUp));
            input.push(antiLerp(-1,1,this.enemy.keyRight*this.projection));
            input.push(antiLerp(-1,1,this.enemy.keyLeft*this.projection));
            
            let output=this.brain.getOutput(input);
            
            this.act(output);
        }
    }

    update(time,dt)
    {
        //this.currentDeltaTime=dt;

        if(this.brain)
        {
            this.thinkAndAct();
        }
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
                        if((this.keyRight-this.keyLeft)>0 && this.vel.x>0)
                        {
                            this.vel.x=this.maxSpeed;
                        }
                        else if((this.keyRight-this.keyLeft)<0 && this.vel.x<0)
                        {
                            this.vel.x=-this.maxSpeed;
                        }
                        else
                        {
                            this.vel.x+=0.1*this.maxSpeed*(this.keyRight-this.keyLeft);
                        }
                    }
                    this.physicBody.setVelocityX(this.vel.x);
                }
                else
                {
                    this.vel.x+=-0.5*(this.vel.x);
                }
                
                if(this.keyUp)
                {
                    this.jump();
                }
                else
                {
                    //if(this.physicBody.body.velocity.y<-10)
                    //this.physicBody.setVelocityY(this.physicBody.body.velocity.y/1.2);
                }
            }
                        
            this.updateWeapon();

            this.container.setPosition(this.physicBody.x,this.physicBody.y);
            this.container.rotation+=((this.keyRight-this.keyLeft)*0.24-this.container.rotation)*0.1;

            this.eye.x+=(this.container.x+
                Math.sign(this.physicBody.body.velocity.x)*Math.min(15,1.5*Math.abs(this.physicBody.body.velocity.x))-this.eye.x)*0.8;
            this.eye.y+=(this.container.y+
                Math.sign(this.physicBody.body.velocity.y)*Math.min(15,1.5*Math.abs(this.physicBody.body.velocity.y))-this.eye.y)*0.8;
        }
    }
}