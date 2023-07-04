
export default class Effect
{
    
    constructor (scene, x, y, direction, color)
    {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.direction=direction;
        this.color=color;

        this.container=this.scene.add.container(this.x,this.y)
            .setDepth(-100);
        for(let i=0;i<50;i++)
        {
            let image = this.scene.add.image(Math.cos(this.direction)*i*10-(30+7*i)/2+(30+7*i)*Math.random(),
            Math.sin(this.direction)*i*10-(30+7*i)/2+(30+7*i)*Math.random(), "bodyBack")
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