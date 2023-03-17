//módulos
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

//variáveis
var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon, boat;

//matriz para balas e barcos
var balls = [];
var boats = [];

//var score
var score = 0;

//para imagens e dados do json
var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;

//decLaração de variável com valor booleano(verdadeiro, falso), prof
var isGameOver = false;

//declarar duas variáveis que receberão valores booleanos, aluno
//nomes:
//isLaughing
//isWater



//VARIÁVEIS PARA OS 4 SONS DO JOGO, aluno
var SOM_DE_FUNDO, SOM_DE_AGUA, SOM_DE_CANHAO, SOM_RISADA_DO_PIRATA





function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  //CARREGAR OS SONS, aluno
  SOM_DE_FUNDO = loadSound("./assets/background_music.mp3");
  SOM_RISADA_DO_PIRATA = loadSound("./assets/pirate_laugh.mp3");



  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");
  waterSplashSpritedata = loadJSON("assets/water_splash/water_splash.json");
  waterSplashSpritesheet = loadImage("assets/water_splash/water_splash.png");
}

function setup() {
  canvas = createCanvas(1200, 600);

  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES)
  angle = 15

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 100, 100, angle);

  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterSplashFrames = waterSplashSpritedata.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }
}

function draw() {
  background(189);

  image(backgroundImg, 0, 0, width, height);

  //através de programação condicional, adicionar o som do fundo
  /*if (!SOM_DE_FUNDO.isPlaying()) {
    
  }*/

  Engine.update(engine);

  push();
  translate(ground.position.x, ground.position.y);
  fill("brown");
  rectMode(CENTER);
  rect(0, 0, width * 2, 1);
  pop();

  push();
  translate(tower.position.x, tower.position.y);
  rotate(tower.angle);
  imageMode(CENTER);
  image(towerImage, 0, 0, 160, 310);
  pop();

  showBoats();


  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithBoat(i);
  }

  cannon.display();


  //pontuação, professora
  fill("red");//cor da portuação
  textSize(40);//tamanho do texto
  text(`Pontuação: ${score}`, width - 200, 50);
  textAlign(CENTER, CENTER); //alinha o texto na tela

}

function collisionWithBoat(index) {
  for (var i = 0; i < boats.length; i++) {
    if (balls[index] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);

      //PONTUAÇÃO aumenta SE HOUVE COLISÃO, prof
      if (collision.collided) {
        score += 5;
        boats[i].remove(i);
        Matter.World.remove(world, balls[index].body);
        delete balls[index];
      }
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    ball.animate();
    //verificação
    if (ball.body.position.y >= height - 50) {
      //tocar o som da água, aluno
      /*if (!SOM_DE_AGUA.isPlaying()) {
      
      }*/



      ball.remove(index);
    }
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(
        width,
        height - 100,
        170,
        170,
        position,
        boatAnimation
      );

      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();
      //var para receber valor booleano referente a colisão, prof
      //torre e barco inteiro
      var collision = Matter.SAT.collides(this.tower, boats[i].body);
      //if que verifica se houve colisão com um barco bom 
      if (collision.collided && !boats[i].isBroken) {
        //fazer um if para poder tocar a risada, aluno
        if (!SOM_RISADA_DO_PIRATA.isPlaying()) {
          SOM_RISADA_DO_PIRATA.play();
        }

        //mudar o valor da variável booleana, prof
        isGameOver = true;
        //chamar método gameOver, prof
        gameOver();

      }
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}


function keyReleased() {
  if (keyCode === DOWN_ARROW && !isGameOver) {
    //tocar o som do canhão, aluno


    balls[balls.length - 1].shoot();
  }
}



//função gameOver cria o popUp, prof
function gameOver() {
  swal(
    {
      title: `Fim de Jogo!!!`,
      text: "Obrigada por jogar!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente"
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}
