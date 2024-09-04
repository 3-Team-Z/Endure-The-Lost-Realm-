
class Game {
  constructor(canvas, context) {
    this.canvas= canvas;
    this.ctx= context;
    this.width= this.canvas.width;
    this.height= this.canvas.height;
    this.baseHeight= 720;
    this.ratio= this.height / this.baseHeight;
    this.background= new Background(this);
    this.player= new Player(this);
    this.obstacles= [];
    this.numberOfObstacles= 10;
    this.gravity;
    this.speed;
    this.minSpeed;
    this.maxSpeed;
    this.score;
    this.gameOver= false;
    this.timer;
    this.message1;
    this.message2;
    this.eventTimer= 0;
    this.eventInterval= 150;
    this.eventUpdate= false;
    this.touchStartX;
    this.swipeDistance= 50;

    this.resize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', e => {
      
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });

    this.canvas.addEventListener('mousedown', e=> {
      this.player.levitate();
    });

    window.addEventListener('keydown', e=> {
      if (e.key === ' ' || e.key ==='ArrowUp'); this.player.levitate();
      if (e.key === 'Shift' || e.key.toLowerCase() === 'c') this.player.startCharge();
      if (e.key === 'r' || e.key === 'R') this.restart();
    });

    this.canvas.addEventListener('touchstart', e=> {
      this.player.levitate();
      this.touchStartX= e.changedTouches[0].pageX;
    });
    this.canvas.addEventListener('touchmove', e=> {
      if(e.changedTouches[0].pageX- this.touchStartX> this.swipeDistance){ 
        this.player.startCharge();
      }
    })
  }

  resize(width, height){
    this.canvas.width= width;
    this.canvas.height= height;
    this.ctx.fillStyle= 'blue';
    this.ctx.textAlign= 'right';
    this.ctx.lineWidth= 3;
    this.ctx.strokeStyle= 'white';
    this.width= this.canvas.width;
    this.height= this.canvas.height;
    this.ratio= this.height / this.baseHeight;

    this.gravity= .15 * this.ratio;
    this.speed= 2 * this.ratio;
    this.minSpeed= this.speed;
    this.maxSpeed= this.speed * 5;
    this.background.resize();
    this.player.resize();
    this.createObstacles();
    this.obstacles.forEach(obstacle=> {
      obstacle.resize();
    });
    this.score= 0;
    this.gameOver= false;
    this.timer= 0;
  }
  
  render(deltaTime){
    if(!this.gameOver) this.timer+= deltaTime;
    this.handlePeriodicEvents(deltaTime);
    this.background.update();
    this.background.draw();
    this.drawStatusText();
    this.player.update();
    this.player.draw();
    this.obstacles.forEach(obstacle=> {
      obstacle.update();
      obstacle.draw();
    });
  }
  createObstacles(){
    this.obstacles= [];
    const firstX= this.baseHeight * this.ratio;
    const obstacleSpacing= 1000 * this.ratio;
    for(let i=0; i<this.numberOfObstacles; i++){
      this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing));
    }
  
  }

  checkCollision(a, b){
    const dx= a.collisionX - b.collisionX;
    const dy= a.collisionY - b.collisionY;
    const distance= Math.hypot(dx, dy);
    const sumOfRadii= a.collisionRadius + b.collisionRadius;
    return distance <= sumOfRadii;
  }

  formatTimer(){
    return (this.timer* 0.001).toFixed(1);
  }
  handlePeriodicEvents(deltaTime){
    if (this.eventTimer < this.eventInterval){
      this.eventTimer += deltaTime;
      this.eventUpdate= false;
    }else {
      this.eventTimer= this.eventTimer% this.eventInterval;
      this.eventUpdate= true;
      
    }
  }
  drawStatusText(){
    this.ctx.save();
    // this.ctx.font = "italic small-caps bold 20px 'Courier New'";
    // this.ctx.font = "italic small-caps bold 20px Georgia";
    // this.ctx.font = "italic small-caps bold 20px 'Times New Roman'";
    this.ctx.font = "italic small-caps bold 25px Verdana";
    this.ctx.fillText('score'+ this.score, this.width- 10, 30);
    this.ctx.textAlign= 'left';
    this.ctx.fillText('Timer'+ this.formatTimer(), 10, 30);
    if(this.gameOver){
      if(this.player.collided){
        this.message1= "Stuck, Are we?";
        this.message2= "Collision time"+ this.formatTimer()+ 'seconds!';
      }else if(this.obstacles.length <=0){
        this.message1= "Nailed it!";
        this.message2= "Can you do it faster than"+ this.formatTimer()+ 'seconds?';
      }
      this.ctx.textAlign= 'center';
      this.ctx.font= '50px'
      this.ctx.fillText(this.message1, this.width * .5, this.height * .5-60);
      this.ctx.fillText(this.message2, this.width * .5, this.height * .5+10);
      this.ctx.fillText("Press R to try again!", this.width * .5, this.height * .5+60);
    }
    if(this.player.energy <= 20) this.ctx.fillStyle= 'red';
    else if(this.player.energy>= this.player.maxEnergy) this.ctx.fillStyle= 'green';
    for (let i= 0; i< this.player.energy; i++){
      this.ctx.fillRect(10, this.height- 10- this.player.barSize* i, this.player.barSize* 5, this.player.barSize);
    }
    this.ctx.restore();
  }
  
  restart (){
    if (this.gameOver) {
      this.resize(window.innerWidth, window.innerHeight);
      this.gameOver= false;
    }
  }
}




window.addEventListener('load', function(){
  const canvas= document.getElementById('canvas1');
  const ctx= canvas.getContext('2d');
  canvas.width= 720;
  canvas.height= 720;
  

  const game= new Game(canvas, ctx);
  
  let lastTime= 0;
  function animate(timeStamp) {
    const deltaTime= timeStamp- lastTime;
    lastTime= timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});