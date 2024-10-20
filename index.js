const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const projectiles =[];
const grids =[];
const enemyProjectiles=[];
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
        this.alive = true;
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

class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 3; 
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.position.y += this.velocity.y;
        this.draw();
    }
}
class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height= 10;
    }

    draw() {
        ctx.fillStyle = 'purple';
        ctx.fillRect(this.position.x,this.position.y,5,15)
        ctx.fill();
    }

    update() {
        this.position.y += this.velocity.y;
        this.draw();
    }
}


class Invaders{
    constructor(i,j) {
        this.velocity = {
            x: 0,
            y: 0,
        }
        const image = new Image()
        image.src = './assets/invader.png'
        image.onload = () => {
            this.image = image
            this.width = (image.width);
            this.height = (image.height);
            this.position = {      
                x: i*30,
                y: j*30
            
    }
  }
}
    draw() {
 
        if(this.image){
            ctx.drawImage(this.image, 
             this.position.x,
             this.position.y, 
             this.width, this.height)
            }
    }

    update({velocity}) {
     if(this.image){
     this.position.x += velocity.x
     this.position.y += velocity.y
     this.draw()  

    }
  }
  shoot(enemyProjectiles){
       enemyProjectiles.push(new InvaderProjectile({position:{
        x: this.position.x+this.width/2,
        y: this.position.y + this.height,
       },
    velocity:{
        x:0,
        y:5
    }}))
  }
   
}

class Grid {

   constructor(){
    this.position ={
        x:0,
        y:0,
    }
    this.velocity={
        x:5,
        y:0
    }
   this.invaders = []
   let rows = Math.floor(Math.random()*5 +2)
   let cols = Math.floor(Math.random()*15 +5)
   this.width = cols*30;
   for(let i=0;i<cols;i++){
      for(let j=0;j<rows;j++){
       this.invaders.push(new Invaders(i,j))
      }
   }
   
   }
   update(){
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      this.velocity.y = 0;
    if(this.position.x + this.width >= canvas.width || this.position.x <=0){
        this.velocity.x = -this.velocity.x
        this.velocity.y =30
    }
}
}
let frames =0;
let randomInterval = Math.floor(Math.random()*500 + 500)
const ashwa = new Player();

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    space: { pressed: false }
};



function animate(){
    requestAnimationFrame(animate)
    ctx.fillStyle='black'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(ashwa.alive){
        ashwa.draw()
        ashwa.update()
    }
    enemyProjectiles.forEach((enemyProjectile,i)=>{
        if(enemyProjectile.position.y+ enemyProjectile.height>=canvas.height){
            enemyProjectiles.splice(i,1);
            console.log(enemyProjectiles)
        }
        //Player With Enemy Bullets Collision Dectection
        if (
            enemyProjectile.position.y + enemyProjectile.height >= ashwa.position.y && 
            enemyProjectile.position.y <= ashwa.position.y + ashwa.height   && 
            enemyProjectile.position.x <= ashwa.position.x + ashwa.width && 
            enemyProjectile.position.x + enemyProjectile.width >= ashwa.position.x 
        ) {
            ashwa.alive = false; 
        }
        
       enemyProjectile.update();
    })
    grids.forEach((grid ,gridIndex) => {
        grid.update();
        if(/* grid.invaders.length ==0 ||  */grid.position.y >=canvas.height){
            grids.splice(gridIndex,1)
            console.log(`${grids}MyGrid`)
        }
        if(frames%100 == 0 && grid.invaders.length>0){
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(enemyProjectiles);
           }
        grid.invaders.forEach((inv,i) =>{
            inv.update({velocity : grid.velocity})
            
            //Collision Detection Logic
            projectiles.forEach((bullet,j)=>{
                if (
                    bullet.position.x + bullet.radius > inv.position.x &&
                    bullet.position.x - bullet.radius < inv.position.x + inv.width &&
                    bullet.position.y + bullet.radius > inv.position.y &&
                    bullet.position.y - bullet.radius < inv.position.y + inv.height
                ) {
                    // Remove invader and projectile on collision
                   
                    grid.invaders.splice(i, 1);
                    projectiles.splice(j, 1);
                  
                }
            })
            
        })
   });

    projectiles.forEach((ammo,i)=> {
        if(ammo.position.y + ammo.radius <=0){
            projectiles.splice(i,1)
        }else{
        ammo.update()}
    });
    if(keys.a.pressed){
       ashwa.velocity.x = -10
    }else if (keys.d.pressed){
        ashwa.velocity.x = 5
    }else{
        ashwa.velocity.x =0
    }
    if(frames %randomInterval === 0){
        randomInterval = Math.floor(Math.random()*500 + 500)
        console.log(randomInterval)
        grids.push(new Grid)
        frames =0
    }

    frames++
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
            fireProjectile()

            break;
    }
})

document.addEventListener('keyup',({key})=>{
    switch (key) {
        case 'a':
           // console.log('left')
            keys.a.pressed = false;
            break;

        case 'd':
           // console.log('right')
            keys.d.pressed= false
            break;

        case ' ':
            //console.log(projectiles)
            keys.space.pressed = false
            break;
    }
})

document.addEventListener('mousedown',()=>{
    keys.space.pressed = true
   fireProjectile()
})


function fireProjectile(){
  
    projectiles.push(new Projectile({position:{
        x:ashwa.position.x+ashwa.width/2,
        y:ashwa.position.y
    },velocity:{
        y:-15,
        x:0
    }}))
}

