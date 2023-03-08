
export default class Effect
{
    
    constructor (scene, x, y, dirX, color)
    {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.dirX =dirX;
        this.color=color;

        this.container=this.scene.add.container(this.x,this.y)
            .setDepth(-100);
        for(let i=0;i<35;i++)
        {
            let image = this.scene.add.image(this.dirX*i*10, -(i+2)*5+Math.random()*(i+2)*10, "bodyBack")
                .setScale(1.2-i*0.03)
                .setAlpha(0.5)
                .setTint(this.color);
            this.container.add(image);
        }
        this.scene.add.tween({
            targets:this.container,
            alpha:0,
            duration:8000,
            ease:"Linear",
            onComplete:()=>{
                this.container.destroy();
            }
        });
    }

    LightenDarkenColor(col, amt) {
        var num = parseInt(col, 16);
        var r = (num >> 16) + amt;
        var b = ((num >> 8) & 0x00FF) + amt;
        var g = (num & 0x0000FF) + amt;
        var newColor = g | (b << 8) | (r << 16);
        return newColor.toString(16);
      }
}