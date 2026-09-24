const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const keys = {};

document.addEventListener("keydown", function (e) {
    keys[e.key] = true;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key.toLowerCase() === "r") {
        restartGame();
    }
});

document.addEventListener("keyup", function (e) {
    keys[e.key] = false;
});

let level = 1;
let score = 0;
let lives = 3;
let cameraX = 0;
let gameWon = false;
let gameOver = false;
let message = "";

const player = {
    x: 60,
    y: 300,
    width: 36,
    height: 42,
    speed: 5,
    velocityY: 0,
    jumpPower: 14,
    onGround: false,
    invincible: 0,
    speedBoost: 0,
    strongJump: false
};

let platforms = [];
let coins = [];
let enemies = [];
let spikes = [];
let powerUps = [];
let boss = null;
let flag = null;

const gravity = 0.7;

function touching(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function createLevel(number) {
    platforms = [];
    coins = [];
    enemies = [];
    spikes = [];
    powerUps = [];
    boss = null;

    if (number === 1) {
        platforms = [
            { x: 0, y: 400, width: 800, height: 50 },
            { x: 850, y: 350, width: 220, height: 20 },
            { x: 1150, y: 300, width: 220, height: 20 },
            { x: 1450, y: 350, width: 220, height: 20 },
            { x: 1750, y: 280, width: 220, height: 20 },
            { x: 2050, y: 350, width: 300, height: 20 },
            { x: 2400, y: 400, width: 500, height: 50 }
        ];

        coins = [
            { x: 250, y: 350, taken: false },
            { x: 900, y: 300, taken: false },
            { x: 1200, y: 250, taken: false },
            { x: 1500, y: 300, taken: false },
            { x: 1800, y: 230, taken: false },
            { x: 2150, y: 300, taken: false },
            { x: 2600, y: 350, taken: false }
        ];

        enemies = [
            makeEnemy(600, 360, 500, 750, 2),
            makeEnemy(1250, 260, 1150, 1350, 2.5),
            makeEnemy(1800, 240, 1750, 1950, 3)
        ];

        spikes = [
            { x: 780, y: 380, width: 40, height: 20 },
            { x: 1375, y: 380, width: 50, height: 20 },
            { x: 2350, y: 380, width: 50, height: 20 }
        ];

        powerUps = [
            { x: 1000, y: 310, type: "health", taken: false },
            { x: 1600, y: 310, type: "speed", taken: false }
        ];

        flag = { x: 2800, y: 320, width: 30, height: 80 };
    }

    if (number === 2) {
        platforms = [
            { x: 0, y: 400, width: 500, height: 50 },
            { x: 600, y: 330, width: 180, height: 20 },
            { x: 850, y: 250, width: 180, height: 20 },
            { x: 1100, y: 330, width: 180, height: 20 },
            { x: 1400, y: 240, width: 180, height: 20 },
            { x: 1700, y: 320, width: 220, height: 20 },
            { x: 2050, y: 250, width: 220, height: 20 },
            { x: 2400, y: 400, width: 600, height: 50 }
        ];

        coins = [
            { x: 650, y: 280, taken: false },
            { x: 900, y: 200, taken: false },
            { x: 1150, y: 280, taken: false },
            { x: 1450, y: 190, taken: false },
            { x: 1800, y: 270, taken: false },
            { x: 2150, y: 200, taken: false },
            { x: 2600, y: 350, taken: false }
        ];

        enemies = [
            makeEnemy(650, 290, 600, 750, 3),
            makeEnemy(900, 210, 850, 1000, 3),
            makeEnemy(1150, 290, 1100, 1250, 3.5),
            makeEnemy(1750, 280, 1700, 1880, 4),
            makeEnemy(2100, 210, 2050, 2230, 4)
        ];

        spikes = [
            { x: 500, y: 380, width: 70, height: 20 },
            { x: 1030, y: 380, width: 70, height: 20 },
            { x: 1280, y: 380, width: 100, height: 20 },
            { x: 1920, y: 380, width: 100, height: 20 },
            { x: 2270, y: 380, width: 100, height: 20 }
        ];

        powerUps = [
            { x: 1450, y: 190, type: "jump", taken: false },
            { x: 2200, y: 200, type: "health", taken: false }
        ];

        flag = { x: 2850, y: 320, width: 30, height: 80 };
    }

    if (number === 3) {
        platforms = [
            { x: 0, y: 400, width: 700, height: 50 },
            { x: 850, y: 330, width: 220, height: 20 },
            { x: 1200, y: 250, width: 220, height: 20 },
            { x: 1550, y: 330, width: 220, height: 20 },
            { x: 1900, y: 250, width: 220, height: 20 },
            { x: 2250, y: 330, width: 220, height: 20 },
            { x: 2600, y: 400, width: 700, height: 50 }
        ];

        coins = [
            { x: 300, y: 350, taken: false },
            { x: 900, y: 280, taken: false },
            { x: 1250, y: 200, taken: false },
            { x: 1600, y: 280, taken: false },
            { x: 1950, y: 200, taken: false },
            { x: 2300, y: 280, taken: false }
        ];

        enemies = [
            makeEnemy(550, 360, 400, 650, 3.5),
            makeEnemy(900, 290, 850, 1030, 4),
            makeEnemy(1250, 210, 1200, 1380, 4),
            makeEnemy(1600, 290, 1550, 1730, 4.5),
            makeEnemy(1950, 210, 1900, 2080, 4.5)
        ];

        spikes = [
            { x: 720, y: 380, width: 80, height: 20 },
            { x: 1070, y: 380, width: 100, height: 20 },
            { x: 1420, y: 380, width: 100, height: 20 },
            { x: 1770, y: 380, width: 100, height: 20 },
            { x: 2120, y: 380, width: 100, height: 20 },
            { x: 2470, y: 380, width: 100, height: 20 }
        ];

        powerUps = [
            { x: 1350, y: 200, type: "health", taken: false },
            { x: 2000, y: 200, type: "speed", taken: false }
        ];

        boss = {
            x: 2850,
            y: 300,
            width: 100,
            height: 100,
            health: 10,
            maxHealth: 10,
            direction: -1,
            speed: 2,
            attackTimer: 0,
            fireballs: []
        };

        flag = { x: 3200, y: 320, width: 30, height: 80 };
    }

    resetPlayer();
}

function makeEnemy(x, y, minX, maxX, speed) {
    return {
        x,
        y,
        width: 40,
        height: 40,
        minX,
        maxX,
        speed,
        alive: true
    };
}

function resetPlayer() {
    player.x = 60;
    player.y = 300;
    player.velocityY = 0;
    player.onGround = false;
    player.invincible = 60;
    cameraX = 0;
}

function restartGame() {
    level = 1;
    score = 0;
    lives = 3;
    gameWon = false;
    gameOver = false;
    player.speed = 5;
    player.jumpPower = 14;
    player.speedBoost = 0;
    player.strongJump = false;
    createLevel(level);
}

function hurtPlayer() {
    if (player.invincible > 0) {
        return;
    }

    lives--;
    player.invincible = 90;

    if (lives <= 0) {
        gameOver = true;
    } else {
        resetPlayer();
    }
}

function nextLevel() {
    if (level < 3) {
        level++;
        createLevel(level);
    } else {
        gameWon = true;
    }
}

function update() {
    if (gameWon || gameOver) {
        return;
    }

    if (player.invincible > 0) {
        player.invincible--;
    }

    if (player.speedBoost > 0) {
        player.speedBoost--;
    }

    let currentSpeed = player.speed;

    if (player.speedBoost > 0) {
        currentSpeed = 8;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        player.x += currentSpeed;
    }

    if (keys["ArrowLeft"] || keys["a"]) {
        player.x -= currentSpeed;
    }

    if (
        (keys[" "] || keys["ArrowUp"] || keys["w"]) &&
        player.onGround
    ) {
        player.velocityY = -player.jumpPower;
        player.onGround = false;
    }

    if (player.x < 0) {
        player.x = 0;
    }

    player.velocityY += gravity;
    player.y += player.velocityY;
    player.onGround = false;

    for (let p of platforms) {
        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height <= p.y + 15 &&
            player.y + player.height + player.velocityY >= p.y
        ) {
            player.y = p.y - player.height;
            player.velocityY = 0;
            player.onGround = true;
        }
    }

    if (player.y > canvas.height + 100) {
        hurtPlayer();
    }

    coins.forEach(function (coin) {
        if (
            !coin.taken &&
            player.x < coin.x + 20 &&
            player.x + player.width > coin.x &&
            player.y < coin.y + 20 &&
            player.y + player.height > coin.y
        ) {
            coin.taken = true;
            score++;
        }
    });

    enemies.forEach(function (enemy) {
        if (!enemy.alive) {
            return;
        }

        enemy.x += enemy.speed;

        if (enemy.x < enemy.minX || enemy.x > enemy.maxX) {
            enemy.speed *= -1;
        }

        if (touching(player, enemy)) {
            if (player.velocityY > 0 && player.y + player.height - enemy.y < 20) {
                enemy.alive = false;
                player.velocityY = -10;
                score += 2;
            } else {
                hurtPlayer();
            }
        }
    });

    spikes.forEach(function (spike) {
        if (touching(player, spike)) {
            hurtPlayer();
        }
    });

    powerUps.forEach(function (powerUp) {
        if (
            !powerUp.taken &&
            touching(player, {
                x: powerUp.x,
                y: powerUp.y,
                width: 25,
                height: 25
            })
        ) {
            powerUp.taken = true;

            if (powerUp.type === "health") {
                lives++;
                message = "Extra life!";
            }

            if (powerUp.type === "speed") {
                player.speedBoost = 600;
                message = "Speed boost!";
            }

            if (powerUp.type === "jump") {
                player.jumpPower = 19;
                player.strongJump = true;
                message = "Super jump!";
            }
        }
    });

    if (boss) {
        boss.x += boss.speed * boss.direction;

        if (boss.x < 2750 || boss.x > 3100) {
            boss.direction *= -1;
        }

        boss.attackTimer++;

        if (boss.attackTimer > 90) {
            boss.attackTimer = 0;

            boss.fireballs.push({
                x: boss.x,
                y: boss.y + 40,
                width: 20,
                height: 20,
                speed: -6
            });
        }

        boss.fireballs.forEach(function (fireball) {
            fireball.x += fireball.speed;

            if (touching(player, fireball)) {
                hurtPlayer();
                fireball.x = -100;
            }
        });

        if (touching(player, boss)) {
            if (player.velocityY > 0 && player.y + player.height - boss.y < 25) {
                boss.health--;
                player.velocityY = -12;
            } else {
                hurtPlayer();
            }
        }

        if (boss.health <= 0) {
            boss = null;
            message = "Boss defeated!";
        }
    }

    if (flag && touching(player, flag) && !boss) {
        nextLevel();
    }

    cameraX = player.x - 250;

    if (cameraX < 0) {
        cameraX = 0;
    }

    if (cameraX > 2500) {
        cameraX = 2500;
    }
}

function drawBackground() {
    ctx.fillStyle = level === 1 ? "#87ceeb" : level === 2 ? "#d7bde2" : "#34495e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = level === 3 ? "#566573" : "#76d7c4";

    for (let i = 0; i < 12; i++) {
        let x = i * 180 - cameraX * 0.3;

        ctx.beginPath();
        ctx.arc(x, 420, 100, Math.PI, 0);
        ctx.fill();
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Level " + level, 20, 95);
}

function drawPlayer() {
    if (player.invincible > 0 && Math.floor(player.invincible / 5) % 2 === 0) {
        return;
    }

    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "#f5b041";
    ctx.fillRect(player.x + 6, player.y + 5, 24, 12);

    ctx.fillStyle = "black";
    ctx.fillRect(player.x + 8, player.y + 8, 4, 4);
    ctx.fillRect(player.x + 24, player.y + 8, 4, 4);

    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(player.x + 5, player.y + 30, 10, 12);
    ctx.fillRect(player.x + 22, player.y + 30, 10, 12);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    ctx.save();
    ctx.translate(-cameraX, 0);

    platforms.forEach(function (platform) {
        ctx.fillStyle = "#27ae60";
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        ctx.fillStyle = "#145a32";
        ctx.fillRect(platform.x, platform.y, platform.width, 6);
    });

    coins.forEach(function (coin) {
        if (!coin.taken) {
            ctx.fillStyle = "#f1c40f";
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#b7950b";
            ctx.fillRect(coin.x - 2, coin.y - 7, 4, 14);
        }
    });

    enemies.forEach(function (enemy) {
        if (enemy.alive) {
            ctx.fillStyle = "#8e44ad";
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

            ctx.fillStyle = "white";
            ctx.fillRect(enemy.x + 8, enemy.y + 8, 8, 8);
            ctx.fillRect(enemy.x + 24, enemy.y + 8, 8, 8);
        }
    });

    spikes.forEach(function (spike) {
        ctx.fillStyle = "#7f8c8d";

        for (let x = spike.x; x < spike.x + spike.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, spike.y + spike.height);
            ctx.lineTo(x + 10, spike.y);
            ctx.lineTo(x + 20, spike.y + spike.height);
            ctx.closePath();
            ctx.fill();
        }
    });

    powerUps.forEach(function (powerUp) {
        if (!powerUp.taken) {
            ctx.fillStyle =
                powerUp.type === "health"
                    ? "#e74c3c"
                    : powerUp.type === "speed"
                    ? "#3498db"
                    : "#f1c40f";

            ctx.fillRect(powerUp.x, powerUp.y, 25, 25);

            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            ctx.fillText(
                powerUp.type === "health"
                    ? "+"
                    : powerUp.type === "speed"
                    ? "S"
                    : "J",
                powerUp.x + 6,
                powerUp.y + 18
            );
        }
    });

    if (boss) {
        ctx.fillStyle = "#641e16";
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);

        ctx.fillStyle = "yellow";
        ctx.fillRect(boss.x + 15, boss.y + 20, 20, 20);
        ctx.fillRect(boss.x + 65, boss.y + 20, 20, 20);

        boss.fireballs.forEach(function (fireball) {
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(
                fireball.x + 10,
                fireball.y + 10,
                10,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });

        ctx.fillStyle = "black";
        ctx.fillRect(boss.x, boss.y - 20, boss.width, 10);

        ctx.fillStyle = "red";
        ctx.fillRect(
            boss.x,
            boss.y - 20,
            boss.width * (boss.health / boss.maxHealth),
            10
        );
    }

    if (flag) {
        ctx.fillStyle = "black";
        ctx.fillRect(flag.x, flag.y, 5, flag.height);

        ctx.fillStyle = "#f1c40f";
        ctx.beginPath();
        ctx.moveTo(flag.x + 5, flag.y);
        ctx.lineTo(flag.x + 40, flag.y + 15);
        ctx.lineTo(flag.x + 5, flag.y + 30);
        ctx.closePath();
        ctx.fill();
    }

    drawPlayer();

    ctx.restore();

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Coins: " + score, 20, 30);
    ctx.fillText("Lives: " + lives, 20, 60);
    ctx.fillText("Arrow keys/WASD: Move", 500, 30);
    ctx.fillText("Space/Up: Jump", 500, 55);
    ctx.fillText("R: Restart", 500, 80);

    if (message !== "") {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText(message, 300, 120);
    }

    if (gameWon) {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.fillText("YOU WIN!", 280, 190);

        ctx.font = "25px Arial";
        ctx.fillText("You defeated the boss!", 270, 240);
        ctx.fillText("Press R to play again", 280, 290);
    }

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.fillText("GAME OVER", 245, 190);

        ctx.font = "25px Arial";
        ctx.fillText("Press R to try again", 285, 250);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

createLevel(1);
gameLoop();