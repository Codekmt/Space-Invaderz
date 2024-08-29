let mySquare = document.getElementById('mySquare');
const gameArea = document.querySelector('.gameArea');
let lives = 3;
const livesDisplay = document.getElementById('lives');
let timer = document.getElementById('difference');
let speed = 40;

let moveBy = 10;

const gameAreaSize = 640;
const playerSize = 40;

let playerX = parseInt(window.getComputedStyle(mySquare).getPropertyValue('left'));
let playerY = parseInt(window.getComputedStyle(mySquare).getPropertyValue('top'));
let enemies = [];

// const formatDate = (difference) => {
//     let seconds = Math.floor((difference % (1000 * 60)) / 1000);
//     timeElapsed.innerHTML = seconds;
// }
// let start = new Date();
// let end = new Date();
// let difference = end - start;
// formatDate(difference);

// setInterval(formatDate(difference), 1000)
let timeElapsed = 0;
setInterval(function() {
    timeElapsed++;
    timer.innerHTML = timeElapsed

}, 100)

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
        const separationDistance = 30;
        const enemy = enemyData.element;
        let speed;
        
        const dx = playerX - enemyData.x;
        const dy = playerY - enemyData.y;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        let velocity = 2;
        if (timeElapsed > 200) {
            velocity += 1;
        } if (timeElapsed > 400 ) {
            velocity += 1;
        } if (timeElapsed > 600) {
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
            enemyData.x + 20 > playerX &&
            enemyData.y < playerY + 25 &&
            enemyData.y + 15 > playerY
        ) {
            loseLife()
        }

    })
}

setInterval(() => {
    if (keys.up && playerY > 0) {
        playerY -= moveBy;
    }
    if (keys.down && playerY < gameAreaSize - 50) {
        playerY += moveBy;
    }
    if (keys.left && playerX > 0) {
        playerX -= moveBy;
    }
    if (keys.right && playerX < gameAreaSize - 50) {
        playerX += moveBy;
    }
    mySquare.style.left = playerX + 'px';
    mySquare.style.top = playerY + 'px';
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
        alert(`Game Over! Points: ${timeElapsed}`);
        window.location.reload();
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

setInterval(createEnemy, 1000);

function gameLoop() {
    moveEnemies();
    requestAnimationFrame(gameLoop);
}

gameLoop();