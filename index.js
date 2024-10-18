const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ashwa.draw();
})

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0,
        }
        const image = new Image()
        image.src = './assets/spaceship.png'
        image.onload = () => {
            this.image = image
            this.width = (image.width) * 0.15;
            this.height = (image.height) * 0.15;
            this.position = {
                x: canvas.width/2 - this.width/2,
                y: canvas.height - this.height -20,
            }
        }   
    }
    
    draw() {
        ctx.fillStyle='black'
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if(this.image){
            ctx.drawImage(this.image, 
             this.position.x,
             this.position.y, 
             this.width, this.height)
            }
    }
    
    update() {
     if(this.image){
     this.position.x += this.velocity.x
     if(this.position.x + this.width > canvas.width ){
        this.position.x=canvas.width-this.width;
     } else if(this.position.x<0){
         this.position.x=0  
      }
    }
  }
}

const ashwa = new Player();

const keys  ={
    a:{
        pressed : false
    },
    d:{
        pressed : false
    },
    space:{
        pressed : false
    }

}

function animate(){
    ashwa.draw()
    requestAnimationFrame(animate)
    ashwa.update()

    if(keys.a.pressed){
       ashwa.velocity.x = -5
    }else if (keys.d.pressed){
        ashwa.velocity.x = 5
    }else{
        ashwa.velocity.x =0
    }
    
}
animate()

document.addEventListener('keydown',({key})=>{
    switch (key) {
        case 'a':
            console.log('left')
            keys.a.pressed = true;
            break;

        case 'd':
            console.log('right')
            keys.d.pressed= true
            break;
    
        case ' ':
            console.log('space')
            keys.space.pressed = true
            break;
    }
})

document.addEventListener('keyup',({key})=>{
    switch (key) {
        case 'a':
            console.log('left')
            keys.a.pressed = false;
            break;

        case 'd':
            console.log('right')
            keys.d.pressed= false
            break;

        case ' ':
            console.log('space')
            keys.space.pressed = false
            break;
    }
})
