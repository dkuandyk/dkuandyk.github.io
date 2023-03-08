
export default class Button
{
    
    constructor (scene, x, y, pressFunction, texture)
    {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.container = scene.add.container(x, y);
        this.image = scene.add.image(0, 0, texture);

        //контейнер всех элементов кнопки, чтобы можно было всю кнопку двигать разом
        this.container.add(this.image);
        
        //обновляем глубину кнопки, чтобы она была поверх всего
        this.container.setDepth(100);

        this.image
            .setInteractive()
            .on('pointerover', () => {
                this.container.setScale(1.03);
            }, this)
            .on('pointerout', () => {
                this.container.setScale(1);
            }, this)
            .on('pointerdown', () => {
                if(this.container.scaleX ===1.03)
                {
                    pressFunction();
                    //this.scene.sounds.click.play();
                    //реализуем функцию кнопки
                    
                }
            }, this)
            .on('pointerup', () => {
                if(this.container.scaleX ===0.97)
                {
                }
            }, this);
    }

    destroy()
    {
        this.scene.tweens.add({
            targets:this.container,
            scale:0,
            duration:500,
            ease:'Back.In',
            onComplete:()=>{
                this.container.destroy();
        }});
    }

}