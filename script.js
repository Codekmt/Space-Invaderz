let mySquare = document.getElementById('mySquare');
const gameArea = document.querySelector('.gameArea');

let lives = 3;
const livesDisplay = document.getElementById('lives');

let timer = document.getElementById('difference');

let speed = 1.4;

const hiscores = JSON.parse(localStorage.getItem('hiscores')) || [];
const scoreList = document.querySelector('.scoreTable');

let moveBy = 10;

const gameAreaSize = 640;
const playerSize = 40;

let playerX = parseInt(window.getComputedStyle(mySquare).getPropertyValue('left'));
let playerY = parseInt(window.getComputedStyle(mySquare).getPropertyValue('top'));
let enemies = [];

let score = 0;
setInterval(function() {
    score++;
    timer.innerHTML = score;
    updateSpeedInterval();
}, 100)

function updateSpeedInterval() {

    if (score % 50 === 0) {
        speed += 0.1;
    }
    // console.log('speed value:', speed);
}

// document.addEventListener('keydown', (e) => {
//     switch (e.key) {
//         case 'ArrowUp':
//             if (playerY > 0) playerY -= moveBy;
//             break;
//         case 'ArrowDown':
//             if (playerY < gameAreaSize - 40) playerY += moveBy;
//             break;
//         case 'ArrowLeft':
//             if (playerX > 0) playerX -= moveBy;
//             break;
//         case 'ArrowRight':
//             if (playerX < gameAreaSize - 40) playerX += moveBy;
//             break;
//     }
//     mySquare.style.left = playerX + 'px';
//     mySquare.style.top = playerY + 'px';
// });

// let keysPressed = {};

// document.addEventListener('keydown', (event) => {
//    keysPressed[event.key] = true;

//    if (keysPressed['ArrowUp'] && event.key == 'ArrowRight') {
//     playerX -= moveBy;
//     playerY += moveBy;
//    }
//    if (keysPressed['ArrowUp'] && event.key == 'ArrowLeft') {
//     playerX -= moveBy;
//     playerY -=moveBy;
//    }
//    if (keysPressed['ArrowDown'] && event.key == 'ArrowLeft') {
//     playerX += moveBy;
//     playerY -=moveBy;
//    }
//    if (keysPressed['ArrowDown'] && event.key == 'ArrowRight') {
//     playerX += moveBy;
//     playerY +=moveBy;
//    }
//    mySquare.style.left = playerX + 'px';
//    mySquare.style.top = playerY + 'px';
// });

let keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        keys.up = true;
    }
    if (e.key === 'ArrowDown') {
        keys.down = true;
    }
    if (e.key === 'ArrowLeft') {
        keys.left = true;
    }
    if (e.key === 'ArrowRight') {
        keys.right = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        keys.up = false;
    }
    if (e.key === 'ArrowDown') {
        keys.down = false;
    }
    if (e.key === 'ArrowLeft') {
        keys.left = false;
    }
    if (e.key === 'ArrowRight') {
        keys.right = false;
    }
});



// window.addEventListener('keyup', (e) => {
//     switch(e.key){
//         case 'ArrowLeft':
//             mySquare.style.left = parseInt(mySquare.style.left) - moveBy + 'px';
//             break;
//             case 'ArrowRight':
//                 mySquare.style.left = parseInt(mySquare.style.left) + moveBy + 'px';
//                 break;
//                 case 'ArrowUp':
//                     mySquare.style.top = parseInt(mySquare.style.top) - moveBy + 'px';
//                     break;
//                     case 'ArrowDown':
//                         mySquare.style.top = parseInt(mySquare.style.top) + moveBy + 'px';
//                         break;
//     }
// })

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');

    const spawnEdge = Math.floor(Math.random() * 4);
    let enemyX, enemyY;


    switch (spawnEdge) {
        case 0: 
            enemyX = Math.random() * (gameAreaSize - 30);
            enemyY = 0;
            break;
        case 1: 
            enemyX = gameAreaSize - 30;
            enemyY = Math.random() * (gameAreaSize - 60);
            break;
        case 2: 
            enemyX = Math.random() * (gameAreaSize - 30);
            enemyY = gameAreaSize - 60;
            break;
        case 3: 
            enemyX = 0;
            enemyY = Math.random() * (gameAreaSize - 60);
            break;
    }

    enemy.style.left = enemyX +'px';
    enemy.style.top = enemyY + 'px';
    gameArea.appendChild(enemy);
    enemies.push({ element:enemy, x: enemyX, y: enemyY})
}

function moveEnemies() {
    enemies.forEach((enemyData, index) => {
        const separationDistance = 20;
        const enemy = enemyData.element;
        
        const dx = playerX - enemyData.x;
        const dy = playerY - enemyData.y;

        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        let velocity = 2;
        if (score > 150) {
            velocity += 1;
        } if (score > 300 ) {
            velocity += 1;
        } if (score > 450) {
            velocity += 1;
        } if (score > 600) {
            velocity += 1;
        } if (score > 750) {
            velocity += 1;
        }
        let moveX = (dx / distanceToPlayer) * velocity;
        let moveY = (dy / distanceToPlayer) * velocity;


        enemies.forEach((otherEnemyData, otherIndex) => {
            if (index !== otherIndex) {
                const otherDx = enemyData.x - otherEnemyData.x;
                const otherDy = enemyData.y - otherEnemyData.y;
                const distanceToOtherEnemy = Math.sqrt(otherDx * otherDx + otherDy * otherDy);

                if (distanceToOtherEnemy < separationDistance && distanceToOtherEnemy > 0) {
                    const repulsionForce = separationDistance / distanceToOtherEnemy;

                    moveX += (otherDx / distanceToOtherEnemy) * repulsionForce;
                    moveY += (otherDy / distanceToOtherEnemy) * repulsionForce;
                }
            }
        });
        enemyData.x += moveX;
        enemyData.y += moveY;

        enemy.style.left = enemyData.x + 'px';
        enemy.style.top = enemyData.y + 'px';

        if (
            enemyData.x < playerX + 25 &&
            enemyData.x + 15 > playerX &&
            enemyData.y < playerY + 25 &&
            enemyData.y + 15 > playerY
        ) {
            loseLife()
        }

    })
}

setInterval(() => {
    if (keys.up && playerY > 0) {
        playerY -= speed;
    }
    if (keys.down && playerY < gameAreaSize - 50) {
        playerY += speed;
    }
    if (keys.left && playerX > 0) {
        playerX -= speed;
    }
    if (keys.right && playerX < gameAreaSize - 50) {
        playerX += speed;
    }
    mySquare.style.left = playerX + 'px';
    mySquare.style.top = playerY + 'px';
    console.log('speed value:',speed);
}, speed);


function loseLife() {
    lives--;
    livesDisplay.textContent = `Lives: ${lives}`

    playerX = 310;
    playerY = 310;
    mySquare.style.left = playerX + 'px';
    mySquare.style.top = playerY + 'px';

    if (lives <= 0) {
        resetEnemies();
        window.location.reload();
        checkScore();
        alert(`Game Over! Points: ${score}`);
    }else{
        resetEnemies();
    }
}

function resetEnemies() {
    enemies.forEach(enemy => {
        gameArea.removeChild(enemy.element)
    });
    enemies = [];
}


function populateTable() {
    scoreList.innerHTML = hiscores.map((row) => {
      return `<tr class="addedScores"><td>${row.clicker}</td><td>${row.score}</tr>`;
    }).join('');
  }

function checkScore() {
    let worstScore = 0;
    if (hiscores.length > 4) {
      worstScore = hiscores[hiscores.length - 1].score;
    }
    if (score > worstScore) {
        let clicker = window.prompt(`${score} – Top score! What's your name?`);

        while (clicker.length > 3) {
            clicker = window.prompt(`${score} – Please try again, max 3 characters`);
        }

        if (clicker) {
            hiscores.push({score, clicker});
        }
      }
      hiscores.sort((a, b) => a.score > b.score ? -1 : 1);
      if (hiscores.length > 5) {
        hiscores.pop();
      }
      populateTable();
  localStorage.setItem('hiscores', JSON.stringify(hiscores));
    }

function clearScores() {
        hiscores.splice(0, hiscores.length);
        localStorage.setItem('hiscores', JSON.stringify(hiscores));
        populateTable();
      }

function gameLoop() {
    moveEnemies();
    requestAnimationFrame(gameLoop);
}

setInterval(createEnemy, 1000);
populateTable();
gameLoop();