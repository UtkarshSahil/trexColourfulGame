var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trexrun.png","Trexrun2.png","trexstand.png");
  trex_collided = loadAnimation("trexstand.png");
  
  groundImage = loadImage("backgroundimage.png");
  
  cloudImage = loadImage("CLOUD.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-200,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2
  trex.setCollider("rectangle",0,0,350,300)
  trex.debug=false
  
  ground = createSprite(width/2,height/2,width-60,height-120);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale=1.3
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2-20);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2+10,height/2+55);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.2;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-40,width,10);
  invisibleGround.visible = false
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  
  
  if (gameState===PLAY){
    trex.depth=trex.depth+10
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((touches.length > 0) || (keyDown("space") && trex.y >= 480)) {
      trex.velocityY = -15   ;
      touches=[];
    }
  
    trex.velocityY = trex.velocityY + 0.99
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
   
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)||(touches.length > 0)||(keyDown("space"))) {
      reset();
      touches=[]
    }
  }
  
  
  drawSprites();
  text("Score: "+ score, 500,50);
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-70,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        obstacle.setCollider("rectangle",0,0,200,300)
        obstacle.debug=false
              break;
      case 2: obstacle.addImage(obstacle2);
        obstacle.debug=false
        obstacle.setCollider("rectangle",0,0,200,300)
              break;
      case 3: obstacle.addImage(obstacle3);
        obstacle.debug=false
        obstacle.setCollider("rectangle",0,0,200,300)
              break;
      case 4: obstacle.addImage(obstacle4);
        obstacle.debug=false
        obstacle.setCollider("rectangle",0,0,200,250)
              break;

              default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}