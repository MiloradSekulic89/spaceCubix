const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const titleDiv = document.getElementById('title');
const explosionParticles = []; // Array to store explosion particles

// Lives and Score
let lives = 3; // Initial number of lives
let score = 0; // Initial score
let gameOver = false;
let scoreMultiplier = 1;
let hitDetection = false; // detect hits for multiplier




// Set canvas dimensions to match the viewport
canvas.width = 1920;
canvas.height = 1080;

// Player ship image
const playerShipImage = new Image();
playerShipImage.src = 'src/img/spritesheet_player.png';
const frameWidth = 45;
const frameHeight = 60;
let currentFrame = 0;
const totalFrames = 8;
let frameInterval = 1000; // Adjust this interval to control animation speed
let lastFrameTime = 0;
let currentTime = 0;

const shipWidth = 70;
const shipHeight = 80;
let shipX = Math.floor((canvas.width - shipWidth) / 2); // Ensure integer position
let shipY = Math.floor(canvas.height - shipHeight -40); // Ensure integer position
let playerShipHit = false;



// Dropables (powerUps) (coins)

const smallCoinImage = new Image()
smallCoinImage.src ='src/img/100Coin.png';
const smallCoinWidth = 20;
const smallCoinHeight = 20;

const dropablesCoins = [];

const smallCoinPercentage = 20;

function animateCoins(){

  for(let i = 0; i <dropablesCoins.length; i++) {

    const coin = dropablesCoins[i];
    

    

      coin.y += 5;
      ctx.drawImage(coin.image,coin.x,coin.y,coin.width,coin.height);
   

    if(coin.y>canvas.height){
      dropablesCoins.splice(i,1);
      i--;
    }

  }
}

// Pulse cannon image
const pulseCannonImage = new Image();
pulseCannonImage.src = 'src/img/pulseCannon.png';
const pulseCannonWidth = 30;
const pulseCannonHeight = 30;
const pulseCannonUpgradeImage = new Image();
pulseCannonUpgradeImage.src ='src/img/pulseCannonUpgrade.png';
const pulseCannonUpgradeWidth = 40;
const pulseCannonUpgradeHeight = 40;
const laserBoomerangImage = new Image();
laserBoomerangImage.src ='src/img/laserBoomerang.png';
const laserBoomerangWidth = 30;
const laserBoomerangHeight = 30;

// Enemy weapons images
const enemySmallShipImage = new Image();
enemySmallShipImage.src = 'src/img/enemy-small.png';
const enemySmallKamikazeShipImage = new Image();
enemySmallKamikazeShipImage.src ='src/img/kamikaze-small.png';
const enemySmallShipX=50;
const enemySmallShipY=50;
const enemyMediumShipImage = new Image();
enemyMediumShipImage.src ='src/img/enemy-medium.png';
const enemyMediumShipX=60;
const enemyMediumShipY=50;
const enemyMediumShipPurpleImage = new Image();
enemyMediumShipPurpleImage.src ='src/img/purple_03.png';
const enemyMediumShipPurpleX = 60;
const enemyMediumShipPurpleY = 50;
const enemySideShips = [];
const laserBulletImage = new Image();
laserBulletImage.src = 'src/img/laserBullet.png';
const laserBulletWidth = 10;
const laserBulletHeight = 10;
const enemyMediumMiniBossImage = new Image();
enemyMediumMiniBossImage.src ='src/img/enemy_2_1.png';
const enemyMediumMiniBossShipX=60;
const enemyMediumMiniBossShipY=60;
const miniBossWeaponImage = new Image();
miniBossWeaponImage.src ='src/img/projectile-miniBoss.png';
const miniBossWeaponWidth = 20;
const miniBossWeaponHeight = 20;

const weapons = [];
const enemyWeapons = [];
const boss1Weapons = [];


//Bosses resources
const boss1Image = new Image();
boss1Image.src ='src/img/boss1.png';
boss1Width = 600;
boss1Height = 600;
const boss1LaserImage = new Image();
boss1LaserImage.src ='src/img/boss1Laser.png';
const boss1LaserWidth = 20;
const boss1LaserHeight = 250;
let bossDestroyed = false;

const boss1Array = [];



//World images and database

//Cubix station , player station
const stationTurretImage = new Image();
stationTurretImage.src ='src/img/turret-01.png';
const stationTurretWidth = 50;
const stationTurretHeight = 50;
let stationTurretX = 0;
const stationTurretY = Math.floor(canvas.height -50);
let stationTurretSpeed = 1;
let stationTurretDirection = 1;

const turretWeaponImage = new Image();
turretWeaponImage.src ='src/img/turretBeam.png';
const turretWeaponWidth = 20;
const turretWeaponHeight = 20;
const defenceWeapons = [];


const LastShotTurret = new Map();

// Define the turret object with properties like cooldown time
const turret = {
  cooldownTime: 3000, // 3000 milliseconds or 3 seconds
  canFire: true, // Flag to indicate if the turret can fire
 
};

// Function to check if the turret can fire a laser based on the cooldown
function canFireTurret() {
  const currentTime = Date.now();
  const lastShotTime = LastShotTurret.get(turret);

  if (!lastShotTime || currentTime - lastShotTime >= turret.cooldownTime) {
    return true;
  } else {
    return false;
  }
}

function animateTurret() {
  // Draw the turret at the current position
  ctx.drawImage(stationTurretImage, stationTurretX, stationTurretY);

  // Update the turret's position based on direction and constant speed
  stationTurretX += stationTurretSpeed * stationTurretDirection;

  // Check if the turret has reached the right edge of the canvas
  if (stationTurretX + stationTurretImage.width >= canvas.width) {
    stationTurretDirection = -1; // Change direction to left
  }

  // Check if the turret has reached the left edge of the canvas
  if (stationTurretX <= 0) {
    stationTurretDirection = 1; // Change direction to right
  }

  // Check if the turret can fire and if it should fire
  if (turret.canFire && canFireTurret()) {
    // Calculate the position to shoot in front of the turret
    const laserX = stationTurretX +  stationTurretWidth/ 2 - turretWeaponWidth / 2;
    const laserY = stationTurretY; // Move the bullet upwards

    

    const turretWeapon = {
      image: turretWeaponImage,
      width: turretWeaponWidth,
      height: turretWeaponHeight,
      x: laserX,
      y: laserY - 30,
      fired: true,

    };

    defenceWeapons.push(turretWeapon);
    

    // Update the last shot time for the turret
    LastShotTurret.set(turret, Date.now());

    // Prevent the turret from firing until the cooldown is over
    turret.canFire = false;

    // Set a timer to allow firing again after the cooldown
    setTimeout(() => {
      turret.canFire = true;
    }, turret.cooldownTime);
  }

}

function animateDefenceWeapons() {
  // Iterate through the weapons and animate each one
  for (let i = 0; i < defenceWeapons.length; i++) {
    const weapon = defenceWeapons[i];

    // Check if the weapon is fired
    if (weapon.fired) {
      // Move the weapon
      weapon.y -= 10;

      // Draw the weapon image
      ctx.drawImage(weapon.image, weapon.x, weapon.y, weapon.width, weapon.height);

      // Check if the weapon is outside the canvas
      if (weapon.y < 0) {
        // Remove the weapon from the array
        defenceWeapons.splice(i, 1);
        i--; // Decrement the index to account for the removed weapon
      }
    }
  }
}




let CubixStationLives = 1000;
const cubixStationImage = new Image();
cubixStationImage.src ='src/img/cubix-station-construction.png';
const cubixStationWidth = 1998;
const cubixStationHeight = 210;
let cubixStationX = canvas.width;
let cubixStationY = Math.floor(canvas.height - 50);



function animateCubixStation() {
  // Calculate the scaling factors to fit the station image within the canvas
  const scaleX = canvas.width / cubixStationWidth;
  const scaleY = canvas.height / cubixStationHeight; // Use the canvas height

  // Use the smaller of the two scaling factors to ensure the entire image fits
  const scale = Math.min(scaleX, scaleY);

  // Calculate the scaled width and height
  const scaledWidth = cubixStationWidth * scale;
  const scaledHeight = cubixStationHeight * scale;
 

  // Calculate the position to align the station image to the bottom of the canvas
  const positionX = (canvas.width - scaledWidth) / 2;
  const positionY = canvas.height - 120; // Place at the bottom

  // Draw the scaled station image
  ctx.drawImage(cubixStationImage, positionX, positionY, scaledWidth, scaledHeight);
}



//Asteroids
const asteroids = [];

const asteroidImage = new Image();
asteroidImage.src ='src/img/asteroid.png';
const asteroidX=30;
const asteroidY=30;
const asteroidBrokenImage = new Image();
asteroidBrokenImage.src ='src/img/asteroid-broken.png';
const asteroidBrokenX=30;
const asteroidBrokenY=30;
const asteroidExplosionImage = new Image();
asteroidExplosionImage.src ='src/img/asteroid-explosion.png';

//Planets
const planets = [];

const earthPlanetImage = new Image();
earthPlanetImage.src ='src/img/earth-like planet.png';
const earthPlanetX=200;
const earthPlanetY=200;
const CelestialObjectsImage1 = new Image();
CelestialObjectsImage1.src ='src/img/CelestialObjects1.png';
const CelestialObjectsImage2 = new Image();
CelestialObjectsImage1.src ='src/img/CelestialObjects2.png';
const CelestialObjectsImage3 = new Image();
CelestialObjectsImage1.src ='src/img/CelestialObjects3.png';
const CelestialObjectsImage4 = new Image();
CelestialObjectsImage1.src ='src/img/CelestialObjects4.png';
const CelestialObjectsImage5 = new Image();
CelestialObjectsImage1.src ='src/img/CelestialObjects5.png';
const CelestialObjectsImage6 = new Image();
CelestialObjectsImage1.src ='src/img/CelestialObjects6.png';
const CelestialObjects1Width = 200;
const CelestialObjects1Height = 200;
const CelestialObjects2Width = 200;
const CelestialObjects2Height = 200;
const CelestialObjects3Width = 200;
const CelestialObjects3Height = 200;
const CelestialObjects4Width = 200;
const CelestialObjects4Height = 200;
const CelestialObjects5Width = 200;
const CelestialObjects5Height = 200;
const CelestialObjects6Width = 200;
const CelestialObjects6Height = 200;



function animatePlanets() {
  for (let i = 0; i < planets.length; i++) {
    const square = planets[i];

    // Move the square
    square.y += square.speed;

    // Draw the square
    ctx.drawImage(square.image,square.x, square.y, square.size, square.size);

    // Check if the square is out of the canvas
    if (square.y > canvas.height) {
      planets.splice(i, 1);
      i--; // Decrement the index to account for the removed square
    }
  
  }}


function spawnPlanet(){
  const squareSize = 100;
  const squareX = Math.random() * (canvas.width - squareSize); // Random X position
  const squareY = -squareSize; // Start from the top
  const squareSpeed = 1; // Random speed between 1 and 3

  const asteroidImages = [earthPlanetImage, CelestialObjectsImage1, CelestialObjectsImage2, CelestialObjectsImage3, CelestialObjectsImage4, CelestialObjectsImage5, CelestialObjectsImage6];
  const selectedImage = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];

  planets.push({
    image: selectedImage,
    x: squareX,
    y: squareY,
    size: squareSize,
    speed: squareSpeed,
  });

}

function animateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    const square = asteroids[i];

    // Move the square
    square.y += square.speed;

    // Draw the square
    ctx.drawImage(square.image,square.x, square.y, square.size, square.size);

    // Check if the square is out of the canvas
    if (square.y > canvas.height) {
      asteroids.splice(i, 1);
      i--; // Decrement the index to account for the removed square
    }
  
  }}

  function spawnAsteroid(){
    const squareSize = 40;
    const squareX = Math.random() * (canvas.width - squareSize); // Random X position
    const squareY = -squareSize; // Start from the top
    const squareSpeed = 0.5; // Random speed between 1 and 3
  
    const asteroidImages = [asteroidImage, asteroidBrokenImage, asteroidExplosionImage];
    const selectedImage = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
  
    asteroids.push({
      image: selectedImage,
      x: squareX,
      y: squareY,
      size: squareSize,
      speed: squareSpeed,
    });
  
  }



// Enemy squares and animations
const enemiesSmall = [];
const enemiesMedium = [];
const enemiesMiniBoss = [];




// Percentage of red squares that fire laser bullets
const laserFirePercentage = 0; // 20% of red squares will fire
const blueLaserFirePercentage = 100; // 100% of blue squares will fire

function spawnSmallEnemy() {
  const squareSize = 25;
  const squareSpeed = Math.random() * 2 + 1; // Random speed between 1 and 3

  let squareX, squareY;
  do {
    squareX = Math.random() * (canvas.width - squareSize);
    squareY = -squareSize; // Start from the top
  } while (checkCollisions(squareX, squareY, squareSize, enemiesSmall));

  // Determine if this red square will fire a laser
  const willFireLaser = Math.random() < laserFirePercentage / 100;

  enemiesSmall.push({
    image: enemySmallShipImage,
    x: squareX,
    y: squareY,
    size: squareSize,
    speed: squareSpeed,
    fireLaser: willFireLaser,
  });
}

function spawnSmallEnemyKamikaze() {
  const squareSize = 40;
  const squareSpeed = 5; // Random speed between 1 and 3

  let squareX, squareY;
  do {
    squareX = Math.random() * (canvas.width - squareSize);
    squareY = -squareSize; // Start from the top
  } while (checkCollisions(squareX, squareY, squareSize, enemiesSmall));

  // Determine if this red square will fire a laser
  const willFireLaser = Math.random() < laserFirePercentage / 100;

  enemiesSmall.push({
    image: enemySmallKamikazeShipImage,
    x: squareX,
    y: squareY,
    size: squareSize,
    speed: squareSpeed,
    fireLaser: willFireLaser,
  });
}

function spawnMediumEnemy() {
  const squareSize = 40;
  const squareSpeed = 1; // Random speed between 1 and 3

  let squareX, squareY;
  do {
    squareX = Math.random() * (canvas.width - squareSize);
    squareY = -squareSize; // Start from the top
  } while (checkCollisions(squareX, squareY, squareSize, enemiesMedium));

  // Determine if this blue square will fire a laser
  const willFireLaser = Math.random() < blueLaserFirePercentage / 100;
  const hitPoints = 2;

  enemiesMedium.push({
    image: enemyMediumShipImage,
    x: squareX,
    y: squareY,
    size: squareSize,
    speed: squareSpeed,
    fireLaser: willFireLaser,
    hitPoints: hitPoints,
  });
}

function spawnMediumPurpleEnemy() {
  const squareSize = 40;
  const squareSpeed = 1; // Random speed between 1 and 3

  let squareX, squareY;
  do {
    squareX = canvas.width;
    squareY = Math.random() * (canvas.height / 3); 
  } while (checkCollisions(squareX, squareY, squareSize, enemySideShips));

  // Determine if this blue square will fire a laser
  const willFireLaser = Math.random() < blueLaserFirePercentage / 100;
  const hitPoints = 2;

  enemySideShips.push({
    image: enemyMediumShipPurpleImage,
    x: squareX,
    y: squareY,
    size: squareSize,
    speed: squareSpeed,
    fireLaser: willFireLaser,
    hitPoints: hitPoints,
  });
}

const miniBossWeaponPercentage = 50;

function spawnMediumMiniBossEnemy() {
  const squareSize = 60;
  const squareSpeed = 1; // Random speed between 1 and 3

  let squareX, squareY;
  do {
    squareX = Math.random() * (canvas.width - squareSize);
    squareY = -squareSize; // Start from the top
  } while (checkCollisions(squareX, squareY, squareSize, enemiesMiniBoss));

  // Determine if this blue square will fire a laser
  const willFireLaser = Math.random() < miniBossWeaponPercentage / 100;
  const hitPoints = 10;

  enemiesMiniBoss.push({
    image: enemyMediumMiniBossImage,
    x: squareX,
    y: squareY,
    size: squareSize,
    speed: squareSpeed,
    fireLaser: willFireLaser,
    hitPoints: hitPoints,
  });
}

// Function to check for collisions
function checkCollisions(x, y, size, enemyArray) {
  for (const enemy of enemyArray) {
    if (
      x < enemy.x + enemy.size &&
      x + size > enemy.x &&
      y < enemy.y + enemy.size &&
      y + size > enemy.y
    ) {
      return true; // Collision detected
    }
  }
  return false; // No collision
}



// Define a variable to store the time of the last laser shot for each square and droppables
const squareLastShotTimes = new Map();
const squareLastDropTimes = new Map();

// Function to check if a square can fire a laser based on the cooldown
function canFireLaser(square) {
  const currentTime = Date.now();
  const lastShotTime = squareLastShotTimes.get(square);

  if (!lastShotTime || currentTime - lastShotTime >= 3000) {
    // Allow firing if there's no last shot time or if enough time has passed (e.g., 3000 milliseconds or 3 seconds)
    return true;
  } else {
    return false;
  }
}



function animateSmallEnemies() {
  for (let i = 0; i < enemiesSmall.length; i++) {
    const square = enemiesSmall[i];

    // Move the square
    square.y += square.speed;

    // Draw the square
    ctx.drawImage(square.image,square.x, square.y, square.size, square.size);

    // Check if the square is out of the canvas
    if (square.y > canvas.height) {
      enemiesSmall.splice(i, 1);
      i--; // Decrement the index to account for the removed square
    }

    // Check if the square should fire a laser and if it's allowed to based on cooldown
    if (square.fireLaser && canFireLaser(square)) {
      // Calculate the position to shoot in front of the square
      const laserX = square.x + square.size / 2 - laserBulletWidth / 2;
      const laserY = square.size + square.size;

      const laserBullet = {
        image: laserBulletImage,
        width: laserBulletWidth,
        height: laserBulletHeight,
        x: laserX,
        y: laserY,
        fired: true,
      };

      enemyWeapons.push(laserBullet);
     
      // Update the last shot time for this square
      squareLastShotTimes.set(square, Date.now());

     
      
        
      }


     
  }}

  function animateMediumEnemies() {
    for (let i = 0; i < enemiesMedium.length; i++) {
      const square = enemiesMedium[i];
  
      // Move the square
      square.y += square.speed;
  
      // Draw the square
      
      ctx.drawImage(square.image,square.x, square.y, square.size, square.size);
  
      // Check if the square is out of the canvas
      if (square.y > canvas.height) {
        enemiesMedium.splice(i, 1);
        i--; // Decrement the index to account for the removed square
      }
  
      // Check if the square should fire a laser and if it's allowed to based on cooldown
      if (square.fireLaser && canFireLaser(square)) {
        // Calculate the position to shoot in front of the square
        const laserX = square.x + square.size / 2 - laserBulletWidth / 2;
        const laserY = square.size + square.size;
  
        const laserBullet = {
          image: laserBulletImage,
          width: laserBulletWidth,
          height: laserBulletHeight,
          x: laserX,
          y: laserY,
          fired: true,
        };
  
        enemyWeapons.push(laserBullet);
        
        // Update the last shot time for this square
        squareLastShotTimes.set(square, Date.now());
  
        
        
          
        }
  
       
    }}

    function animateMediumPurpleEnemies() {
      for (let i = 0; i < enemySideShips.length; i++) {
        const square = enemySideShips[i];
    
        // Move the square
        square.x -= square.speed;
    
        // Draw the square
        
        ctx.drawImage(square.image,square.x, square.y, square.size, square.size);
    
        // Check if the square is out of the canvas
        if (square.x > canvas.width) {
          enemySideShips.splice(i, 1);
          i--; // Decrement the index to account for the removed square
        }
    
        // Check if the square should fire a laser and if it's allowed to based on cooldown
        if (square.fireLaser && canFireLaser(square)) {
          // Calculate the position to shoot in front of the square
          const laserX = square.x + square.size / 2 - laserBulletWidth / 2;
          const laserY = square.size + square.size;
    
          const laserBullet = {
            image: laserBulletImage,
            width: laserBulletWidth,
            height: laserBulletHeight,
            x: laserX,
            y: laserY,
            fired: true,
          };
    
          enemyWeapons.push(laserBullet);
          
          // Update the last shot time for this square
          squareLastShotTimes.set(square, Date.now());
    
          
          
            
          }
    
         
      }}

    function animateMiniBossEnemies() {
      for (let i = 0; i < enemiesMiniBoss.length; i++) {
        const square = enemiesMiniBoss[i];
    
        // Move the square
        square.y += square.speed;
    
        // Draw the square
        
        ctx.drawImage(square.image,square.x, square.y, square.size, square.size);
    
        // Check if the square is out of the canvas
        if (square.y > canvas.height) {
          enemiesMiniBoss.splice(i, 1);
          i--; // Decrement the index to account for the removed square
        }
    
        // Check if the square should fire a laser and if it's allowed to based on cooldown
        if (square.fireLaser && canFireLaser(square)) {

          const numProjectiles = 3; // Number of projectiles in the circle
          const spread = 100;
      
          
      
          for (let j = 0; j < numProjectiles; j++) {
            
          // Calculate the position to shoot circle pattern
            const laserX = square.x + square.size / 2 - miniBossWeaponWidth / 2 + (j - 1) * spread;
            const laserY = square.y + square.size / 2 - miniBossWeaponHeight / 2;
    
          const miniBossWeapon= {
            image: miniBossWeaponImage,
            width: miniBossWeaponWidth,
            height: miniBossWeaponHeight,
            x: laserX,
            y: laserY,
            fired: true,
          };
    
          enemyWeapons.push(miniBossWeapon);
        }
          
          // Update the last shot time for this square
          squareLastShotTimes.set(square, Date.now());
    
          
          
            
          }
    
         
      }}

      const boss1WeaponsFirePercentage = 100;

      function spawnBoss() {

        const squareSize = 200;
        const squareX = Math.random() * (canvas.width - squareSize); // Random X position
        const squareY = -squareSize; // Start from the top
        const squareSpeed = 0.1; // Random speed between 1 and 3
      
        // Determine if this blue square will fire a laser
        const willFireLaser = Math.random() < boss1WeaponsFirePercentage / 100;
        const hitPoints = 100;
        playBossWarningSound();
      
        boss1Array.push({
          image: boss1Image,
          x: squareX,
          y: squareY,
          size: squareSize,
          speed: squareSpeed,
          fireLaser: willFireLaser,
          hitPoints: hitPoints,
      
          
          
          
        });

        bossDestroyed = false;
      }

      function animateBoss() {
        for (let i = 0; i < boss1Array.length; i++) {
          const square = boss1Array[i];
      
          // Move the square
          square.y += square.speed;
      
          // Draw the square
          
          ctx.drawImage(square.image,square.x, square.y, square.size, square.size);
      
         
      
          // Check if the square should fire a laser and if it's allowed to based on cooldown
          if (square.fireLaser && canFireLaser(square)) {
  
            const numProjectiles = 3; // Number of projectiles in the circle
            const spread = 100;
        
            
        
            for (let j = 0; j < numProjectiles; j++) {
              
            // Calculate the position to shoot circle pattern
              const laserX = square.x + square.size / 2 - boss1LaserWidth / 2 + (j - 1) * spread;
              const laserY = square.y + square.size / 2 - boss1LaserHeight / 2;
      
            const boss1Weapon= {
              image: boss1LaserImage,
              width: boss1LaserWidth,
              height: boss1LaserHeight,
              x: laserX,
              y: laserY,
              fired: true,
            };
      
            boss1Weapons.push(boss1Weapon);
          }
            playBoss1WeaponSound();
            // Update the last shot time for this square
            squareLastShotTimes.set(square, Date.now());
      
            
            
              
            }
      
           
        }}


// Define a variable to keep track of the elapsed time
let elapsedTime = 0;

// Initially set the spawn interval for red squares (in milliseconds)
let redSpawnInterval = 3000; // 5 seconds

// Initially set the spawn interval for blue squares (in milliseconds)
let blueSpawnInterval = 5000; // 20 seconds

// Interval miniBoss
let miniBossSpawnInterval = 20000;

function updateElapsedTime() {
  elapsedTime += 1000; // Increment elapsed time by 1 second (1000 milliseconds)
  currentTime += 1000;
  
}

function increaseDifficulty() {
  // After 20 seconds, reduce the spawn interval for red squares
  if (elapsedTime >= 6000) { // 20 seconds
    redSpawnInterval = 1000; // Set a new, shorter spawn interval (e.g., 3 seconds) for red squares
  }

  if (elapsedTime >= 20000) {
    blueSpawnInterval = 2000; // Set a new, shorter spawn interval (e.g., 10 seconds) for blue squares
  }

  if (elapsedTime >= 30000){
    miniBossSpawnInterval = 15000; // Set a new, shorter spawn interval (e.g., 5 seconds) for miniBoss
  }

  // You can apply similar logic for blue squares if needed
}

function spawnEnemies() {
  if (elapsedTime >= 5000) {
    // Spawn red squares every 3 seconds
    if (elapsedTime % redSpawnInterval === 0) {
      spawnSmallEnemy();
      spawnSmallEnemyKamikaze();
      
    }
  } else {
    // Spawn red squares every 5 seconds
    if (elapsedTime % redSpawnInterval === 0) {
      spawnSmallEnemy();
    }
  }

  // Spawn blue squares every 20 seconds
  if (elapsedTime % blueSpawnInterval === 0) {
    spawnMediumEnemy();
  }

  if (elapsedTime % miniBossSpawnInterval === 0){
    spawnMediumMiniBossEnemy();
  }
}

// Use a single setInterval for spawning red and blue squares
 // Check every second and spawn as needed



// Function to animate weapons
function animateWeapons() {
  // Iterate through the weapons and animate each one
  for (let i = 0; i < weapons.length; i++) {
    const weapon = weapons[i];

    // Check if the weapon is fired
    if (weapon.fired) {
      // Move the weapon
      weapon.y -= 10;

      // Draw the weapon image
      ctx.drawImage(weapon.image, weapon.x, weapon.y, weapon.width, weapon.height);

      // Check if the weapon is outside the canvas
      if (weapon.y < 0) {
        // Remove the weapon from the array
        weapons.splice(i, 1);
        i--; // Decrement the index to account for the removed weapon
      }
    }
  }
}

function animateEnemyWeapons() {
  // Iterate through the weapons and animate each one
  for (let i = 0; i < enemyWeapons.length; i++) {
    const weapon = enemyWeapons[i];

    // Check if the weapon is fired
    if (weapon.fired) {
      // Move the weapon
      weapon.y += 10;

      // Draw the weapon image
      ctx.drawImage(weapon.image, weapon.x, weapon.y, weapon.width, weapon.height);

      // Check if the weapon is outside the canvas
      if (weapon.y < 0) {
        // Remove the weapon from the array
        weapons.splice(i, 1);
        i--; // Decrement the index to account for the removed weapon
      }
    }
  }
}

function animateBoss1Weapons() {
  // Iterate through the weapons and animate each one
  for (let i = 0; i < boss1Weapons.length; i++) {
    const weapon = boss1Weapons[i];

    // Check if the weapon is fired
    if (weapon.fired) {
      // Move the weapon
      weapon.y += 10;

      // Draw the weapon image
      ctx.drawImage(weapon.image, weapon.x, weapon.y, weapon.width, weapon.height);

      // Check if the weapon is outside the canvas
      if (weapon.y < 0) {
        // Remove the weapon from the array
        weapons.splice(i, 1);
        i--; // Decrement the index to account for the removed weapon
      }
    }
  }
}

// Hide title function
function hideTitle() {
  titleDiv.style.display = 'none';
}

// Function to display lives and score
function displayLivesAndScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 30); // Display lives in the top-right corner
  ctx.fillText(`Score: ${score}`, 20, 30);// Display score in the top-left corner
  ctx.fillText(`Station health:${CubixStationLives}`,100,50) ;// Display station health in the top-right corner
  ctx.fillText(`Multiplier:${scoreMultiplier}`,100,70); // Display score multiplier counter in top left corner
  
  
}

let hitTime = 0;
let resetHitTime = false;

function updateMultiplier(){

  if(hitDetection===true ){
    
    scoreMultiplier= scoreMultiplier+1;
    if (scoreMultiplier>=10){
      playCongratulationSound();
    }
    
    
  }else{
    
    
    if(hitDetection===false && hitTime >= 5000 && resetHitTime === false){
    
    scoreMultiplier=1;
    hitTime=0;
    resetHitTime = false;
    }
  }
  
  }

  function resetHitDetection() {
    if(hitDetection===true ){

      
    setTimeout(function() {
      updateMultiplier();
      
      hitDetection=false;
      if(hitTime >= 5000){
      console.log("updated hit" +hitTime);
      resetHitTime= false;
      }
    }, 300); 

    setTimeout(function(){

     
      score = score + 10 * scoreMultiplier;
      scoreMultiplier=1;
      
    },5000)
  }
  }


// Function to handle collisions between the player's ship and red squares
function handleShipSquareCollisions() {
  for (let i = 0; i < enemiesSmall.length; i++) {
    const square = enemiesSmall[i];

    // Calculate the center of the player's ship
    const playerShipCenterX = shipX + shipWidth / 2;
    const playerShipCenterY = shipY + shipHeight / 2;

    // Calculate the center of the red square
    const squareCenterX = square.x + square.size / 2;
    const squareCenterY = square.y + square.size / 2;

    // Calculate the distance between the centers of the ship and the square
    const distance = Math.sqrt(
      (playerShipCenterX - squareCenterX) ** 2 +
      (playerShipCenterY - squareCenterY) ** 2
    );

    // Check if the ship and square overlap (collision)
    if (distance < (shipWidth + square.size) / 2) {
      // Collision detected
      enemiesSmall.splice(i, 1); // Remove the red square
      i--; // Decrement the index to account for the removed square
      lives--; // Decrease the number of lives
      playerShipHit = true;

      // Create explosion particles (stars)
      createExplosion(playerShipCenterX, playerShipCenterY, 1000); // Adjust the number of particles as needed
      playExplosionSound();
    }
  }
  for (let j = 0; j < enemiesMedium.length; j++) {
    const square = enemiesMedium[j];

    // Calculate the center of the player's ship
    const playerShipCenterX = shipX + shipWidth / 2;
    const playerShipCenterY = shipY + shipHeight / 2;

    // Calculate the center of the red square
    const squareCenterX = square.x + square.size / 2;
    const squareCenterY = square.y + square.size / 2;

    // Calculate the distance between the centers of the ship and the square
    const distance = Math.sqrt(
      (playerShipCenterX - squareCenterX) ** 2 +
      (playerShipCenterY - squareCenterY) ** 2
    );

    // Check if the ship and square overlap (collision)
    if (distance < (shipWidth + square.size) / 2) {
      // Collision detected
      enemiesMedium.splice(j, 1); // Remove the red square
      j--; // Decrement the index to account for the removed square
      lives--; // Decrease the number of lives
      playerShipHit = true;
      
           

      // Create explosion particles (stars)
      createExplosion(playerShipCenterX, playerShipCenterY, 1000); // Adjust the number of particles as needed
      playExplosionSound();
    }
  }
  for (let y = 0; y < enemiesMiniBoss.length; y++) {
    const square = enemiesMiniBoss[y];

    // Calculate the center of the player's ship
    const playerShipCenterX = shipX + shipWidth / 2;
    const playerShipCenterY = shipY + shipHeight / 2;

    // Calculate the center of the red square
    const squareCenterX = square.x + square.size / 2;
    const squareCenterY = square.y + square.size / 2;

    // Calculate the distance between the centers of the ship and the square
    const distance = Math.sqrt(
      (playerShipCenterX - squareCenterX) ** 2 +
      (playerShipCenterY - squareCenterY) ** 2
    );

    // Check if the ship and square overlap (collision)
    if (distance < (shipWidth + square.size) / 2) {
      // Collision detected
      enemiesMiniBoss.splice(y, 1); // Remove the red square
      y--; // Decrement the index to account for the removed square
      lives--; // Decrease the number of lives
      playerShipHit = true;
      
           

      // Create explosion particles (stars)
      createExplosion(playerShipCenterX, playerShipCenterY, 1000); // Adjust the number of particles as needed
      playExplosionSound();
    }
  }

  for (let h = 0; h < enemySideShips.length; h++) {
    const square = enemySideShips[h];

    // Calculate the center of the player's ship
    const playerShipCenterX = shipX + shipWidth / 2;
    const playerShipCenterY = shipY + shipHeight / 2;

    // Calculate the center of the red square
    const squareCenterX = square.x + square.size / 2;
    const squareCenterY = square.y + square.size / 2;

    // Calculate the distance between the centers of the ship and the square
    const distance = Math.sqrt(
      (playerShipCenterX - squareCenterX) ** 2 +
      (playerShipCenterY - squareCenterY) ** 2
    );

    // Check if the ship and square overlap (collision)
    if (distance < (shipWidth + square.size) / 2) {
      // Collision detected
      enemySideShips.splice(h, 1); // Remove the red square
      h--; // Decrement the index to account for the removed square
      lives--; // Decrease the number of lives
      playerShipHit = true;

      // Create explosion particles (stars)
      createExplosion(playerShipCenterX, playerShipCenterY, 1000); // Adjust the number of particles as needed
      playExplosionSound();
    }
  }


  }

let weaponHasCollided = false;

// Function to handle collisions between fired weapons and red squares
function handleWeaponExplosionCollisions() {

  

  for (let i = 0; i < weapons.length; i++) {
    const weapon = weapons[i];

    
      // Check collisions between non-laser bullets and red squares
      for (let j = 0; j < enemiesSmall.length; j++) {
        const square = enemiesSmall[j];

        // Calculate the center of the weapon
        const weaponCenterX = weapon.x + weapon.width / 2;
        const weaponCenterY = weapon.y + weapon.height / 2;

        // Calculate the center of the red square
        const squareCenterX = square.x + square.size / 2;
        const squareCenterY = square.y + square.size / 2;

        // Calculate the distance between the centers of the weapon and the square
        const weaponDistance = Math.sqrt(
          (weaponCenterX - squareCenterX) ** 2 +
          (weaponCenterY - squareCenterY) ** 2
        );

        // Check collision between weapon and square
        if (weaponDistance < (weapon.width + square.size) / 2) {

          weaponHasCollided = true;
          // Collision detected with a red square
          weapons.splice(i, 1); // Remove the weapon
          i--; // Decrement the index to account for the removed weapon
          enemiesSmall.splice(j, 1); // Remove the red square
          j--; // Decrement the index to account for the removed square
          score += 10; // Increase the score
          hitDetection = true;

          if(Math.random() <= smallCoinPercentage / 100){
            const smallCoin = {
              image: smallCoinImage,
              width: smallCoinWidth,
              height: smallCoinHeight,
              x: squareCenterX - smallCoinWidth / 2,
              y: squareCenterY - smallCoinHeight / 2,
            };
    
            dropablesCoins.push(smallCoin);
          }
          
          // Create explosion particles (stars)
          createExplosion(weaponCenterX, weaponCenterY, 1000); // Adjust the number of particles as needed
          playExplosionSound();
        } 
      }

      for (let k = 0; k < enemiesMedium.length; k++) {
        const square = enemiesMedium[k];

        // Calculate the center of the weapon
        const weaponCenterX = weapon.x + weapon.width / 2;
        const weaponCenterY = weapon.y + weapon.height / 2;

        // Calculate the center of the blue square
        const squareCenterX = square.x + square.size / 2;
        const squareCenterY = square.y + square.size / 2;

        // Calculate the distance between the centers of the weapon and the square
        const weaponDistance = Math.sqrt(
          (weaponCenterX - squareCenterX) ** 2 +
          (weaponCenterY - squareCenterY) ** 2
        );

        // Check collision between weapon and square
        if (weaponDistance < (weapon.width + square.size) / 2) {

          weaponHasCollided = true;
          // Collision detected with a blue square
          weapons.splice(i, 1); 
          i--;
          square.hitPoints--;
          

          if(square.hitPoints <= 0){
          enemiesMedium.splice(k, 1); // Remove the blue square
          k--; // Decrement the index to account for the removed square
          score += 10; // Increase the score
          hitDetection = true;
          createExplosion(weaponCenterX, weaponCenterY, 10); // Adjust the number of particles as needed
          playExplosionSound();

          if(Math.random() <= smallCoinPercentage / 100){
            const smallCoin = {
              image: smallCoinImage,
              width: smallCoinWidth,
              height: smallCoinHeight,
              x: squareCenterX - smallCoinWidth / 2,
              y: squareCenterY - smallCoinHeight / 2,
            };
    
            dropablesCoins.push(smallCoin);
          }
        }

          // Create explosion particles (stars)
          createExplosion(weaponCenterX, weaponCenterY, 1000); // Adjust the number of particles as needed
          playExplosionSound();
        }
      
      }
      for (let x = 0; x < boss1Array.length; x++) {
        const square = boss1Array[x];
      
        // Calculate the center of the weapon
        const weaponCenterX = weapon.x + weapon.width / 2;
        const weaponCenterY = weapon.y + weapon.height / 2;
      
        // Calculate the center of the blue square
        const squareCenterX = square.x + square.size / 2;
        const squareCenterY = square.y + square.size / 2;
      
        // Calculate the distance between the centers of the weapon and the square
        const weaponDistance = Math.sqrt(
          (weaponCenterX - squareCenterX) ** 2 +
          (weaponCenterY - squareCenterY) ** 2
        );
      
        // Check collision between weapon and square
        if (weaponDistance < (weapon.width + square.size) / 2) {

          weaponHasCollided = true;
          // Collision detected with a blue square
          weapons.splice(i, 1); // Remove the weapon
          i--; // Decrement the index to account for the removed weapon
      
          square.hitPoints--;
      
          if (square.hitPoints <= 0) {
            // Remove the blue square
            boss1Array.splice(x, 1);
            x--; // Decrement the index to account for the removed square
            score += 1500; // Increase the score
            bossDestroyed = true;

            // Create explosion particles (stars)
            createExplosion(weaponCenterX, weaponCenterY, 1000); // Adjust the number of particles as needed
      
            if (Math.random() <= smallCoinPercentage / 100) {
              const smallCoin = {
                image: smallCoinImage,
                width: smallCoinWidth,
                height: smallCoinHeight,
                x: squareCenterX - smallCoinWidth / 2,
                y: squareCenterY - smallCoinHeight / 2,
              };
      
              dropablesCoins.push(smallCoin);
            }
          }

          createExplosion(weaponCenterX, weaponCenterY, 1); 
      
          playExplosionSound();
        }}

        for (let z = 0; z < enemiesMiniBoss.length; z++) {
          const square = enemiesMiniBoss[z];
  
          // Calculate the center of the weapon
          const weaponCenterX = weapon.x + weapon.width / 2;
          const weaponCenterY = weapon.y + weapon.height / 2;
  
          // Calculate the center of the blue square
          const squareCenterX = square.x + square.size / 2;
          const squareCenterY = square.y + square.size / 2;
  
          // Calculate the distance between the centers of the weapon and the square
          const weaponDistance = Math.sqrt(
            (weaponCenterX - squareCenterX) ** 2 +
            (weaponCenterY - squareCenterY) ** 2
          );
  
          // Check collision between weapon and square
          if (weaponDistance < (weapon.width + square.size) / 2) {

            weaponHasCollided = true;
            // Collision detected with a blue square
            weapons.splice(i, 1); 
            i--;
            square.hitPoints--;
            
            createExplosion(weaponCenterX, weaponCenterY, 1); // Adjust the number of particles as needed
            playExplosionSound();
  
            if(square.hitPoints <= 0){
            enemiesMiniBoss.splice(z, 1); // Remove the blue square
            z--; // Decrement the index to account for the removed square
            score += 10; // Increase the score
            hitDetection = true;
            createExplosion(weaponCenterX, weaponCenterY, 1); // Adjust the number of particles as needed
            playExplosionSound();
  
            if(Math.random() <= smallCoinPercentage / 100){
              const smallCoin = {
                image: smallCoinImage,
                width: smallCoinWidth,
                height: smallCoinHeight,
                x: squareCenterX - smallCoinWidth / 2,
                y: squareCenterY - smallCoinHeight / 2,
              };
      
              
              dropablesCoins.push(smallCoin);
            }
            // Create explosion particles (stars)
            createExplosion(weaponCenterX, weaponCenterY, 1000); // Adjust the number of particles as needed
            playExplosionSound();
          }
  
            
            
          }
        
        }

        for (let h = 0; h < weapons.length; h++) {
          const weapon = weapons[h];
      
          
            // Check collisions between non-laser bullets and red squares
            for (let h = 0; h < enemySideShips.length; h++) {
              const square = enemySideShips[h];
      
              // Calculate the center of the weapon
              const weaponCenterX = weapon.x + weapon.width / 2;
              const weaponCenterY = weapon.y + weapon.height / 2;
      
              // Calculate the center of the red square
              const squareCenterX = square.x + square.size / 2;
              const squareCenterY = square.y + square.size / 2;
      
              // Calculate the distance between the centers of the weapon and the square
              const weaponDistance = Math.sqrt(
                (weaponCenterX - squareCenterX) ** 2 +
                (weaponCenterY - squareCenterY) ** 2
              );
      
              // Check collision between weapon and square
              if (weaponDistance < (weapon.width + square.size) / 2) {
      
                weaponHasCollided = true;
                // Collision detected with a red square
                weapons.splice(i, 1); // Remove the weapon
                i--; // Decrement the index to account for the removed weapon
                enemySideShips.splice(h, 1); // Remove the red square
                h--; // Decrement the index to account for the removed square
                score += 10; // Increase the score
                hitDetection=true;
      
                if(Math.random() <= smallCoinPercentage / 100){
                  const smallCoin = {
                    image: smallCoinImage,
                    width: smallCoinWidth,
                    height: smallCoinHeight,
                    x: squareCenterX - smallCoinWidth / 2,
                    y: squareCenterY - smallCoinHeight / 2,
                  };
          
                  dropablesCoins.push(smallCoin);
                }
                
                // Create explosion particles (stars)
                createExplosion(weaponCenterX, weaponCenterY, 1000); // Adjust the number of particles as needed
                playExplosionSound();
              } 
            }
      

     

      
          }
   
  
  }
}

function handleDefenceWeaponExplosionCollision() {
  for (let i = 0; i < defenceWeapons.length; i++) {
    const weapon = defenceWeapons[i];
    let weaponCenterX, weaponCenterY; // Define them here

    // Calculate the center of the weapon
    weaponCenterX = weapon.x + weapon.width / 2;
    weaponCenterY = weapon.y + weapon.height / 2;

    // Check collision with medium-sized enemies (blue squares)
    for (let k = 0; k < enemiesMedium.length; k++) {
      const square = enemiesMedium[k];

      // Calculate the center of the blue square
      const squareCenterX = square.x + square.size / 2;
      const squareCenterY = square.y + square.size / 2;

      // Calculate the distance between the centers of the weapon and the square
      const weaponDistance = Math.sqrt(
        (weaponCenterX - squareCenterX) ** 2 +
        (weaponCenterY - squareCenterY) ** 2
      );

      // Check collision between weapon and square
      if (weaponDistance < (weapon.width + square.size) / 2) {
        // Collision detected with a blue square
        defenceWeapons.splice(i, 1); // Remove the weapon
        i--; // Decrement the index to account for the removed weapon
        enemiesMedium.splice(k, 1); // Remove the blue square
        k--; // Decrement the index to account for the removed square
        score += 10; // Increase the score
        hitDetection = true;

        if (Math.random() <= smallCoinPercentage / 100) {
          const smallCoin = {
            image: smallCoinImage,
            width: smallCoinWidth,
            height: smallCoinHeight,
            x: squareCenterX - smallCoinWidth / 2,
            y: squareCenterY - smallCoinHeight / 2,
          };

          dropablesCoins.push(smallCoin);
        }

        // Create explosion particles (stars)
        createExplosion(weaponCenterX, weaponCenterY, 1000); // Adjust the number of particles as needed
        playExplosionSound();
      }
    }

    // Check collision with small enemies (red squares)
    for (let j = 0; j < enemiesSmall.length; j++) {
      const square = enemiesSmall[j];

      // Calculate the center of the red square
      const squareCenterX = square.x + square.size / 2;
      const squareCenterY = square.y + square.size / 2;

      // Calculate the distance between the centers of the weapon and the square
      const weaponDistance = Math.sqrt(
        (weaponCenterX - squareCenterX) ** 2 +
        (weaponCenterY - squareCenterY) ** 2
      );

      // Check collision between weapon and square
      if (weaponDistance < (weapon.width + square.size) / 2) {
        // Collision detected with a red square
        defenceWeapons.splice(i, 1); // Remove the weapon
        i--; // Decrement the index to account for the removed weapon
        enemiesSmall.splice(j, 1); // Remove the red square
        j--; // Decrement the index to account for the removed square
        score += 10; // Increase the score
        hitDetection = true;

        if (Math.random() <= smallCoinPercentage / 100) {
          const smallCoin = {
            image: smallCoinImage,
            width: smallCoinWidth,
            height: smallCoinHeight,
            x: squareCenterX - smallCoinWidth / 2,
            y: squareCenterY - smallCoinHeight / 2,
          };

          dropablesCoins.push(smallCoin);
        }

        // Create explosion particles (stars)
        createExplosion(weaponCenterX, weaponCenterY, 1000); // Adjust the number of particles as needed
        playExplosionSound();
      }
    }
  }
  // Check collision with small enemies (red squares)
  for (let y = 0; y < enemiesMiniBoss; y++) {
    const square = enemiesMiniBoss[y];

    // Calculate the center of the red square
    const squareCenterX = square.x + square.size / 2;
    const squareCenterY = square.y + square.size / 2;

    // Calculate the distance between the centers of the weapon and the square
    const weaponDistance = Math.sqrt(
      (weaponCenterX - squareCenterX) ** 2 +
      (weaponCenterY - squareCenterY) ** 2
    );

    // Check collision between weapon and square
    if (weaponDistance < (weapon.width + square.size) / 2) {
      // Collision detected with a red square
      defenceWeapons.splice(i, 1); // Remove the weapon
      i--; // Decrement the index to account for the removed weapon
      enemiesMiniBoss.splice(y, 1); // Remove the red square
      y--; // Decrement the index to account for the removed square
      score += 10; // Increase the score
      hitDetection = true;

      if (Math.random() <= smallCoinPercentage / 100) {
        const smallCoin = {
          image: smallCoinImage,
          width: smallCoinWidth,
          height: smallCoinHeight,
          x: squareCenterX - smallCoinWidth / 2,
          y: squareCenterY - smallCoinHeight / 2,
        };

        dropablesCoins.push(smallCoin);
      }

      // Create explosion particles (stars)
      createExplosion(weaponCenterX, weaponCenterY, 1000); // Adjust the number of particles as needed
      playExplosionSound();
    }
  }
}




function handleWeaponExplosionCollisionsStation() {
  for (let i = 0; i < enemyWeapons.length; i++) {
    const weapon = enemyWeapons[i];

    

    // Check if the weapon is a laser bullet and if it's in the ship's vicinity
    if (weapon.image === laserBulletImage || weapon.image === miniBossWeaponImage) {
      

      if (
        weapon.x <= cubixStationX &&
        weapon.y > cubixStationY 
        
      ) {
        

        // Collision detected with player's station
        enemyWeapons.splice(i, 1); // Remove the laser bullet
        playStationHitSound();
        i--; // Decrement the index to account for the removed bullet
        CubixStationLives= CubixStationLives - 2; // Decrease the number of lives

        // Create explosion particles (stars)
        createExplosion(weapon.x, cubixStationY , 10); // Adjust the number of particles as needed
      }
    }
  }
}





// Function to create explosion particles (stars)
function createExplosion(x, y, numParticles) {
  for (let i = 0; i < numParticles; i++) {
    const size = Math.random() * 4 + 2; // Random particle size
    const color = getRandomColor(); // Random particle color
    const speed = Math.random() * 2 + 1; // Random particle speed

    explosionParticles.push({
      x,
      y,
      size,
      color,
      speed,
      alpha: 1, // Initial opacity
    });
  }
}

// Function to get a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to animate explosion particles (stars)
function animateExplosionParticles() {
  for (let i = 0; i < explosionParticles.length; i++) {
    const particle = explosionParticles[i];

    // Move the particle outward
    particle.x += particle.speed * Math.cos(Math.random() * 2 * Math.PI);
    particle.y += particle.speed * Math.sin(Math.random() * 2 * Math.PI);

    // Reduce particle opacity (fade out)
    particle.alpha -= 0.02;

    // Remove faded out particles
    if (particle.alpha <= 0) {
      explosionParticles.splice(i, 1);
      i--; // Decrement the index to account for the removed particle
    } else {
      // Draw the particle
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      ctx.globalAlpha = 1; // Reset global alpha
    }
  }
}

// Function to handle collisions between laser bullets and the player's ship
function handleLaserBulletShipCollisions() {
  for (let i = 0; i < enemyWeapons.length; i++) {
    const weapon = enemyWeapons[i];

    

    if(weapon.image === laserBulletImage || weapon.image === miniBossWeaponImage){
    if (
      weapon.x + weapon.width > shipX &&
      weapon.x < shipX + shipWidth &&
      weapon.y + weapon.height > shipY &&
      weapon.y < shipY + shipHeight
    ) {animateSmallEnemies
     
      enemyWeapons.splice(i, 1);
      i--;
      lives--;
      playerShipHit = true;

      // Create explosion particles (stars)
      createExplosion(shipX + shipWidth / 2, shipY + shipHeight / 2, 1000); // Adjust the number of particles as needed
      playExplosionSound();

      
       

      
    }
  }
  
  
  }
  
  for (let j = 0; j < boss1Weapons.length; j++) {
    const weapon = boss1Weapons[j];
  
  if(weapon.image === boss1LaserImage){

    
    if (
      weapon.x + weapon.width > shipX &&
      weapon.x < shipX + shipWidth &&
      weapon.y + weapon.height > shipY &&
      weapon.y < shipY + shipHeight
    ) {animateSmallEnemies
     
      boss1Weapons.splice(j, 1);
      j--;
      lives--;
      playerShipHit = true;

      // Create explosion particles (stars)
      createExplosion(shipX + shipWidth / 2, shipY + shipHeight / 2, 1000); // Adjust the number of particles as needed
      playExplosionSound();

      
       

      
    }
  }
}}

// Function to handle droppable coin and ship collision

function handleDroppableCoinCollisions(){
  for(let i =0;i<dropablesCoins.length;i++){
    const coin = dropablesCoins[i];
    if(
      coin.x + coin.width > shipX &&
      coin.x < shipX + shipWidth &&
      coin.y + coin.height > shipY &&
      coin.y < shipY + shipHeight
    ){
      dropablesCoins.splice(i, 1);
      i--;
      score += 100;
      playCollectCoinSound();
    }
  }
}

function showGameOverPopup() {
  gameOver = true; // Set gameOver to true when the game is over
  const userResponse = confirm('Game Over! Play again?');

  if (userResponse === true) {
    // If the user clicks "OK," redirect to index.html to restart the game
    window.location.href = 'index.html';
  }
}

let canShoot = true; // Flag to track if the player can shoot
let leftArrowPressed = false;
let rightArrowPressed = false;
let upArrowPressed = false;
let downArrowPressed = false;

let isCircularWeaponInCooldown = false;

// Function to handle keydown events
document.addEventListener('keydown', (event) => {
  if (event.keyCode === 37) {
    leftArrowPressed = true;
  }

  if (event.keyCode === 39) {
    rightArrowPressed = true;
  }

  // Handle "up" arrow key (keyCode 38)
  if (event.keyCode === 38) {
    upArrowPressed = true;
  }

  // Handle "down" arrow key (keyCode 40)
  if (event.keyCode === 40) {
    downArrowPressed = true;
  }

  if (event.keyCode === 32 && canShoot && score<5000) {

    const pulseCannon = {
      image: pulseCannonImage,
      width: pulseCannonWidth,
      height: pulseCannonHeight,
      x: shipX + shipWidth / 2 - pulseCannonWidth / 2,
      y: shipY,
      fired: true,
    };
    weapons.push(pulseCannon);
    playWeaponFireSound();

    // Set canShoot to false to prevent rapid shooting
    canShoot = false;
  } 

  if(event.keyCode === 32 && canShoot && score >= 5001 && score <=10000){

    const pulseCannonUpgrade = {
      image: pulseCannonUpgradeImage,
      width: pulseCannonUpgradeWidth,
      height: pulseCannonUpgradeHeight,
      x: shipX + shipWidth / 2 - pulseCannonUpgradeWidth / 2,
      y: shipY,
      fired: true,
    };
    weapons.push(pulseCannonUpgrade);
    playWeaponFireSound();

    canShoot = false;
  }

  if (event.keyCode === 32 && canShoot && score >= 10001) {
    // Set a flag to indicate that this weapon is in cooldown
    
  
    if (!isCircularWeaponInCooldown) {
      // Set the flag to prevent repeated firing during cooldown
      isCircularWeaponInCooldown = true;
  
      // Define circular weapon parameters
      const numProjectiles = 4;  // Number of projectiles in the circle
      const projectileSpeed = 5; // Speed of individual projectiles
      const circleRadius = 20;   // Radius of the circular pattern
  
      // Calculate the angle between each projectile
      const angleStep = (2 * Math.PI) / numProjectiles;
  
      for (let i = 0; i < numProjectiles; i++) {
        const angle = i * angleStep;
  
        // Calculate the position of the projectile in the circular pattern
        const x = shipX + shipWidth / 2 - laserBoomerangWidth / 2 + circleRadius * Math.cos(angle);
        const y = shipY + circleRadius * Math.sin(angle);
  
        // Create individual projectile
        const laserBoomerang = {
          image: laserBoomerangImage,
          width: laserBoomerangWidth,
          height: laserBoomerangWidth,
          x: x,
          y: y,
          velocityX: projectileSpeed * Math.cos(angle),
          velocityY: projectileSpeed * Math.sin(angle),
          fired: true,
        };
  
        // Add the individual projectile to the weapons array
        weapons.push(laserBoomerang);
      }
  
      playWeaponFireSound();
  
      // Set a timeout for the cooldown (e.g., 1000 milliseconds = 1 second)
      setTimeout(() => {
        // Reset the flag to allow firing again after the cooldown
        isCircularWeaponInCooldown = false;
      }, 500);
    }
  }


});

// Function to handle keyup events
document.addEventListener('keyup', (event) => {
  if (event.keyCode === 37) {
    leftArrowPressed = false;
  }

  if (event.keyCode === 39) {
    rightArrowPressed = false;
  }

   // Handle releasing "up" arrow key (keyCode 38)
   if (event.keyCode === 38) {
    upArrowPressed = false;
  }

  // Handle releasing "down" arrow key (keyCode 40)
  if (event.keyCode === 40) {
    downArrowPressed = false;
  }

  if (event.keyCode === 32) {
    // When the spacebar is released, allow shooting again
    canShoot = true;
  }
});

// Function to move the ship
function moveShip(currentTime) {

  const deltaTime = currentTime - lastFrameTime;

  
  if (leftArrowPressed && shipX > 0) {

    
    shipX -= 10;

    if (deltaTime >= frameInterval) {

      
     
      currentFrame = (currentFrame + 7) % totalFrames;
    ctx.drawImage(playerShipImage, currentFrame, 2*frameHeight, frameWidth, frameHeight , shipX, shipY, shipWidth, shipHeight);
   
    }

    lastFrameTime = currentTime;

  }

  if (rightArrowPressed && shipX < canvas.width - shipWidth) {
    shipX += 10;

    if (deltaTime >= frameInterval) {

      
      
      currentFrame = (currentFrame + 7) % totalFrames;
      ctx.drawImage(playerShipImage, currentFrame, 1*frameHeight, frameWidth, frameHeight , shipX, shipY, shipWidth, shipHeight);
   
    }

    lastFrameTime = currentTime;
  }

  if (upArrowPressed && shipY > 0) {
    shipY -= 10;

    
  }

  // Move the ship down if "down" arrow key is pressed
  if (downArrowPressed && shipY < canvas.height - shipHeight) {
    shipY += 10;

    
    lastFrameTime = currentTime;
  }

  
  
  
}


  








// Event listener for the Enter key press
document.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) { // 13 is the keycode for the Enter key
    togglePause();
  }
});

// Function to check and award an extra life
let lastScoreThresholdForExtraLife = 0;

function checkAndAwardExtraLife() {
  const scoreThreshold = 8000; // Set the threshold for earning an extra life
  
  // Calculate how many extra lives the player should receive based on their score
  const extraLivesToAdd = Math.floor(score / scoreThreshold);

  // Check if there are extra lives to add and if the player hasn't received one at this threshold yet
  if (extraLivesToAdd > 0 && score >= lastScoreThresholdForExtraLife + scoreThreshold) {
    lives = lives + 1; // Increment the player's lives
    CubixStationLives = CubixStationLives + 200;
    lastScoreThresholdForExtraLife = scoreThreshold * extraLivesToAdd; // Update the last threshold
    playExtraLifeSound();
  }
}




function animateGame() {

  console.log(hitTime);

  if (lives === 0 || CubixStationLives <=0) {
    showGameOverPopup();
    return; // End the game loop
  }

  

  if (isGamePaused ) {
    // Game is paused, don't update the game state
    requestAnimationFrame(animateGame);
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  
  animateAsteroids();
  animatePlanets();
  animateCubixStation();
  animateTurret();
  
  
  // Draw the red squares before the player's ship

  animateMediumEnemies();
  animateSmallEnemies();
  animateMediumPurpleEnemies();
  animateMiniBossEnemies();
  animateBoss();
  increaseDifficulty();

  // Move the ship based on arrow key presses
  moveShip(currentTime);
  

  // Draw the player's ship

  if(playerShipHit===true){
    // Redraw the player ship after a short delay (1 second)
    ctx.clearRect(shipX, shipY, shipWidth, shipHeight);
    setTimeout(() => {

      
      ctx.drawImage(playerShipImage, currentFrame * frameWidth, 2 * frameHeight, frameWidth, frameHeight, shipX, shipY, shipWidth, shipHeight);
      playerShipHit = false;
    }, 2000); // 1000 milliseconds = 1 second
      }else if (leftArrowPressed === false && rightArrowPressed === false ){
    
    ctx.drawImage(playerShipImage, 0, 0, frameWidth, frameHeight, shipX, shipY, shipWidth, shipHeight);
    
      }

  

  

  animateWeapons();
  animateDefenceWeapons();
  animateEnemyWeapons();
  animateBoss1Weapons();
  animateCoins();
  displayLivesAndScore();
  handleShipSquareCollisions();
  handleDefenceWeaponExplosionCollision();
  handleWeaponExplosionCollisions();
  handleWeaponExplosionCollisionsStation();
  handleLaserBulletShipCollisions();
  handleDroppableCoinCollisions();
  animateExplosionParticles();
  checkAndAwardExtraLife();
  resetHitDetection();
  updateElapsedTime();
  requestAnimationFrame(animateGame);

  

 
}





// Check if the page is being refreshed
if (performance.navigation.type === 1) {
  // Page is refreshed, reset the game
  resetGame();
}

// Function to reset the game
function resetGame() {
  // Redirect to the index.html file to start over
  window.location.href = 'index.html';
}


// Sounds
const weaponFireSound = new Audio('src/audio/plasmacannon.mp3');
const explosionSound = new Audio('src/audio/low-impact.mp3');
const collectCoinSound = new Audio('src/audio/collectCoin.mp3');
const extraLifeSound = new Audio('src/audio/extra-life.mp3');
const gameStartSound = new Audio('src/audio/game-start.mp3');
const stationHitSound = new Audio('src/audio/boom_c_06-102838.mp3');
const warningSound1 = new Audio('src/audio/beep-warning-6387.mp3');
const boss1WeaponSound = new Audio('src/audio/laser-zap-90575.mp3');
const bossWarningSound = new Audio('src/audio/warning-sound-by-prettysleepy-art-12395.mp3');
const congratulationSound = new Audio('src/audio/congratulations-deep-voice-172193.mp3');






// Functions to play sound effects
function playWeaponFireSound() {
  weaponFireSound.currentTime = 0; // Rewind the sound to the beginning (in case it's already playing)
  weaponFireSound.play();
}

function playExplosionSound() {
  explosionSound.currentTime = 0; // Rewind the sound to the beginning (in case it's already playing)
  explosionSound.play();
}



function playCollectCoinSound() {
  collectCoinSound.currentTime = 0; // Rewind the sound to the beginning (in case it's already playing)
  collectCoinSound.play();
}

function playExtraLifeSound(){
  extraLifeSound.currentTime = 0; // Rewind the sound to the beginning (in case it's already playing)
  extraLifeSound.play();
}

function playGameStartSound(){
  gameStartSound.currentTime = 0; // Rewind the sound to the beginning (in case it's already playing)
  gameStartSound.play();
}

function playStationHitSound(){
  stationHitSound.currentTime = 0; // Rewind the sound to the beginning (in case it's already playing)
  stationHitSound.play();
}


function playWarningSound1(){
  warningSound1.currentTime = 0; // Rewind the sound to the beginning (in case it's already playing)
  warningSound1.play();
}

function playBoss1WeaponSound(){

  boss1WeaponSound.currentTime = 0; // Rewind the sound to the beginning
  boss1WeaponSound.play();
}

function playBossWarningSound(){
  bossWarningSound.currentTime = 0; // Rewind the sound to the beginning (in case it's already playing)
  bossWarningSound.play();
}

function playCongratulationSound(){
  congratulationSound.currentTime = 0;
  congratulationSound.play();
}



// Background music settings
// Array of song URLs
const backgroundMusicList = [
  'src/audio/mp3/Sci-Fi 1.mp3',
  'src/audio/mp3/Sci-Fi 2.mp3',
  'src/audio/mp3/Sci-Fi 3.mp3',
  'src/audio/mp3/Sci-Fi 4.mp3',
  'src/audio/mp3/Sci-Fi 5.mp3',
  'src/audio/mp3/Sci-Fi 6.mp3',
  'src/audio/mp3/Sci-Fi 7.mp3',
  'src/audio/mp3/Sci-Fi 8.mp3',

  
  
  // Add more songs as needed
];

// Create an audio element for background music
const backgroundMusic = new Audio();

// Function to play background music
function playBackgroundMusic() {
  // Select a random song from the array
  const randomIndex = Math.floor(Math.random() * backgroundMusicList.length);
  const randomSong = backgroundMusicList[randomIndex];

  // Set the audio element's source to the selected song
  backgroundMusic.src = randomSong;

  // Play the selected song
  backgroundMusic.play();
}

// Function to stop background music
function stopBackgroundMusic() {
  backgroundMusic.pause();
}

// Event listener to automatically play the next song when the current song ends
backgroundMusic.addEventListener('ended', playNextBackgroundMusic);

// Function to play the next song in the array
function playNextBackgroundMusic() {
  // Pause the current song
  backgroundMusic.pause();

  // Select the next song
  const currentIndex = backgroundMusicList.indexOf(backgroundMusic.src);
  const nextIndex = (currentIndex + 1) % backgroundMusicList.length;
  const nextSong = backgroundMusicList[nextIndex];

  // Set the audio element's source to the next song
  backgroundMusic.src = nextSong;

  // Play the next song
  backgroundMusic.play();
}





// Define a variable to track whether the game is paused
let isGamePaused = false;

let enemySpawnIntervalId;
let asteroidSpawnIntervalId;
let planetsSpawnIntervalId;
let boss1SpawnIntervalId;
let enemyShipsPurpleSpawnIntervalId;

// Function to toggle the game pause state
function togglePause() {
  isGamePaused = !isGamePaused;

  if (isGamePaused) {
    stopBackgroundMusic(); // Pause background music (if any)
    // You can add more pause-related actions here
    clearInterval(enemySpawnIntervalId);
    clearInterval(asteroidSpawnIntervalId);
    clearInterval(planetsSpawnIntervalId);
    clearInterval(boss1SpawnIntervalId);
    clearInterval(enemyShipsPurpleSpawnIntervalId);

    // Clear the arrays of enemies when the game is paused
    enemiesSmall.length = 0;
    enemiesMedium.length = 0;
  } else {
    
    // You can add more unpause-related actions here
    playBackgroundMusic(); 
    // Remove any existing enemies from the arrays
    enemiesSmall.length = 0;
    enemiesMedium.length = 0;
    
    // Resume enemy and asteroid spawning intervals
    enemySpawnIntervalId = setInterval(spawnEnemies, 2000);
    asteroidSpawnIntervalId = setInterval(spawnAsteroid, 10000);
    planetsSpawnIntervalId = setInterval(spawnPlanet, 20000);
  }
}


function startGame() {
  // Hide the Play button and High Scores button
  const playButton = document.getElementById('button');
  const highScoresButton = document.getElementById('HighScoresButton');
  playButton.style.display = 'none';
  highScoresButton.style.display = 'none';

  hideTitle();
  playGameStartSound();
  playBackgroundMusic();
  animateGame();

  setTimeout(() => {
    
    enemySpawnIntervalId = setInterval(spawnEnemies, 2000);
    asteroidSpawnIntervalId = setInterval(spawnAsteroid, 10000);
    planetsSpawnIntervalId = setInterval(spawnPlanet, 20000);
    boss1SpawnIntervalId = setInterval(spawnBoss, 600000); //

    if (bossDestroyed === true){

      enemyShipsPurpleSpawnIntervalId = setInterval (spawnMediumPurpleEnemy, 620000)
    }
  }, 3000); // 2000 milliseconds (2 seconds) delay

  
}

