const k = kaboom({
    width: 800,
    height: 450,
    scale: 1,
    background: [20, 18, 31],
    debug: false,
});

// ==========================================
// ASSET LOADING
// ==========================================

// Player Skins
k.loadSprite("gato", "sprites/gato.png");
k.loadSprite("gato_robin", "sprites/gato_robin.png");
k.loadSprite("gato_warrior", "sprites/gato_warrior.png"); // Lv 8
k.loadSprite("gato_linkzelda", "sprites/gato_linkzelda.png"); // Lv 10
k.loadSprite("gato_luigi", "sprites/gato_luigi.png"); // Lv 14
k.loadSprite("gato_megaman", "sprites/gato_megaman.png"); // Lv 16
k.loadSprite("gato_karateca", "sprites/gato_karateca.png"); // Lv 18
k.loadSprite("gato_poderestudio", "sprites/gato_poderestudio.png"); // Boss Final
k.loadSprite("gato_daño", "sprites/gato_dano.png"); // Player Hit

// Enemies
k.loadSprite("bug", "sprites/bug.png");
k.loadSprite("rata_rapida", "sprites/rata_rapida.png");
k.loadSprite("perro", "sprites/perro.png");
k.loadSprite("bug_boss", "sprites/bug_boss.png");
k.loadSprite("error_boss", "sprites/error_boss.png"); // Filler

// Boss Sprites & Phases
k.loadSprite("boss_normal", "sprites/boss_inmune.png"); // Placeholder init
k.loadSprite("boss_win", "sprites/boss_win.png");
k.loadSprite("boss_espejismo", "sprites/boss_espejismo.png");
k.loadSprite("boss_invulnerable", "sprites/boss_invulnerable.png");
k.loadSprite("boss_inmune", "sprites/boss_inmune.png");
k.loadSprite("boss_doblepistola", "sprites/boss_doblepistola.png");
k.loadSprite("boss_enrage", "sprites/boss_enrage.png");
k.loadSprite("boss_reylibro", "sprites/boss_reylibro.png");
k.loadSprite("boss_cafe", "sprites/boss_cafe.png");
k.loadSprite("boss_joystick", "sprites/boss_joystick.png");
k.loadSprite("boss_debilitado", "sprites/bos_debilitado.png");
k.loadSprite("boss_muerto", "sprites/boss_muerto.png");
k.loadSprite("boss_hacha", "sprites/boss_hacha.png");
k.loadSprite("boss_gameover", "sprites/boss_gameover.png");

// Projectiles & Effects
k.loadSprite("ataque_key", "sprites/ataque_key.png");
k.loadSprite("bola_mago", "sprites/bola_mago.png");
k.loadSprite("daño_warrior", "sprites/daño_warrior.png");
k.loadSprite("churu", "sprites/churu.png");
k.loadSprite("churu_special", "sprites/churu.png"); // Big Churu Reuse
k.loadSprite("libro_boss", "sprites/libro_boss.png");
k.loadSprite("efecto_explosion", "sprites/efecto_explosion.png");
k.loadSprite("explosion", "sprites/explosion.png");
k.loadSprite("efecto_rosa", "sprites/efecto_rosa.png");

// UI
k.loadSprite("final_feliz2", "sprites/final_feliz2.png");

// Music
k.loadSound("music_boss", "sounds/music_boss.mp3");
k.loadSound("music_game", "sounds/musicgame.mp3");
k.loadSound("final_song", "sounds/finalsong.mp3");

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
    SCALE: {
        PLAYER: 1.0,
        ENEMY_SMALL: 0.4,
        ENEMY_MEDIUM: 1.0,
        BOSS: 1.5,
        PROJECTILE: 0.4,
        EFFECT: 0.5,
        CHURU: 0.8
    },
    XP_PER_LEVEL: 150,
    BOSS_HP: [5000, 12000, 35000], // Boss 1: medio, Boss 2: muy dificil, Boss 3: EXTREMO
    BOSS_DROPS: { min: 8, max: 15 },
    PLAYER_MAX_HP: 5,
    PLAYER_SPEED: 220
};

// Progression - CYCLING SKINS
const SKINS_LIST = [
    "gato_warrior", // Lv 1 (Basic)
    "gato_robin",
    "gato_luigi",
    "gato_megaman",
    "gato_karateca",
    "gato_linkzelda"
];

// Attack configs - BUFFED DAMAGE
const ATTACK_STATS = {
    gato: { sprite: "ataque_key", dmg: 10, cd: 0.5, speed: 400 },
    gato_warrior: { sprite: "daño_warrior", dmg: 20, cd: 0.6, speed: 450 }, // 3 hits to kill Perro (60HP)
    gato_robin: { sprite: "ataque_key", dmg: 25, cd: 0.4, speed: 500 },
    gato_luigi: { sprite: "ataque_key", dmg: 30, cd: 0.3, speed: 600 },
    gato_megaman: { sprite: "bola_mago", dmg: 35, cd: 0.2, speed: 700 }, // Shreds
    gato_karateca: { sprite: "bola_mago", dmg: 45, cd: 0.2, speed: 800 },
    gato_linkzelda: { sprite: "bola_mago", dmg: 40, cd: 0.4, speed: 500 },
    gato_poderestudio: { sprite: "efecto_rosa", dmg: 100, cd: 0.15, speed: 900 } // OP Final
};

let gameState = {
    level: 1,
    xp: 0,
    score: 0,
    bossesDefeated: 0,
    churusEaten: 0,
    enemiesKilled: 0,
    enemiesSpawned: 0
};

// ==========================================
// SCENES
// ==========================================

let currentMusic = null;

function playMusic(id, vol = 0.3) {
    if (currentMusic) {
        try { currentMusic.stop(); } catch (e) { }
    }
    currentMusic = k.play(id, { loop: true, volume: vol });
}

k.scene("start", () => {
    k.add([k.text("GATO QUEST", { size: 48 }), k.pos(k.width() / 2, 100), k.anchor("center")]);
    k.add([k.text("CLICK PARA INICIAR", { size: 24 }), k.pos(k.width() / 2, 300), k.anchor("center")]);
    k.onMousePress(() => {
        gameState = {
            level: 1,
            xp: 0,
            totalXP: 0,
            score: 0,
            bossesDefeated: 0,
            churusEaten: 0,
            enemiesKilled: 0,
            enemiesSpawned: 0
        };
        k.go("game");
    });
});

k.scene("game", () => {
    k.add([k.rect(k.width(), k.height()), k.pos(0, 0), k.color(20, 18, 31)]);

    let currentMusic = null;
    let bossActive = false;
    let isTripleShotPermanent = false;
    let isPaused = false;

    // We rely on the global playMusic for music, but the pause logic needs to pause "whatever is playing"
    // The previous implementation used 'currentMusic' global variable which is good.


    // Start initial game music using global helper
    playMusic("music_game", 0.3);

    // PAUSE MENU
    const pauseMenu = k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(0, 0, 0),
        k.opacity(0.8),
        k.z(1000),
        k.fixed()
    ]);
    pauseMenu.hidden = true;

    const pauseText = k.add([
        k.text("PAUSA", { size: 48 }),
        k.pos(k.width() / 2, k.height() / 2 - 40),
        k.anchor("center"),
        k.z(1001),
        k.fixed()
    ]);
    pauseText.hidden = true;

    const resumeText = k.add([
        k.text("Presiona ESC o Click para continuar", { size: 16 }),
        k.pos(k.width() / 2, k.height() / 2 + 20),
        k.anchor("center"),
        k.z(1001),
        k.fixed()
    ]);
    resumeText.hidden = true;

    function togglePause() {
        isPaused = !isPaused;
        pauseMenu.hidden = !isPaused;
        pauseText.hidden = !isPaused;
        resumeText.hidden = !isPaused;

        // FREEZE GAME LOOP using timeScale AND explicit state
        k.timeScale = isPaused ? 0 : 1;

        // Also pause music
        if (currentMusic) {
            currentMusic.paused = isPaused;
        }
    }

    k.onKeyPress("escape", togglePause);
    k.onClick(() => { if (isPaused) togglePause(); });

    // HUD
    const uiHP = k.add([k.text("ERROR"), k.pos(20, 20), k.fixed(), k.color(255, 50, 50), k.z(100)]);
    const uiInfo = k.add([k.text(""), k.pos(20, 60), k.fixed(), k.scale(0.8), k.z(100)]);

    // GAME TIMER (top right)
    let gameTime = 0;
    const uiTimer = k.add([k.text("00:00"), k.pos(k.width() - 20, 20), k.anchor("topright"), k.fixed(), k.z(100)]);
    k.onUpdate(() => {
        if (!isPaused) {
            gameTime += k.dt();
            const mins = Math.floor(gameTime / 60);
            const secs = Math.floor(gameTime % 60);
            uiTimer.text = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    });

    // Messages with position control (yPos: "top", "center", "bottom")
    function showMsg(text, col, time, yPos) {
        let y = k.height() / 2; // default center
        if (yPos === "top") y = 100;
        if (yPos === "bottom") y = k.height() - 80;
        k.add([k.text(text, { size: 28 }), k.pos(k.width() / 2, y), k.anchor("center"), k.color(col), k.lifespan(time || 2), k.move(0, -30), k.z(1000)]);
    }

    // Player - STARTS AS WARRIOR
    const playerSkin = "gato_warrior"; // Initial skin
    const player = k.add([
        k.sprite(playerSkin),
        k.pos(120, k.height() / 2),
        k.anchor("center"),
        k.area({ scale: 0.7 }),
        k.scale(CONFIG.SCALE.PLAYER),
        k.body(),
        "player",
        k.z(50),
        {
            hp: CONFIG.PLAYER_MAX_HP,
            skin: playerSkin,
            multiShot: 1,
            powerupTime: 0,
            cd: 0
        }
    ]);

    // Movement - check pause only
    k.onKeyDown("left", () => { if (!isPaused) player.move(-CONFIG.PLAYER_SPEED, 0); });
    k.onKeyDown("right", () => { if (!isPaused) player.move(CONFIG.PLAYER_SPEED, 0); });
    k.onKeyDown("up", () => { if (!isPaused) player.move(0, -CONFIG.PLAYER_SPEED); });
    k.onKeyDown("down", () => { if (!isPaused) player.move(0, CONFIG.PLAYER_SPEED); });

    // Update Logic
    player.onUpdate(() => {
        if (!isPaused && player.cd > 0) player.cd -= k.dt();
        if (player.powerupTime > 0) {
            player.powerupTime -= k.dt();
            if (player.powerupTime <= 0 && !isTripleShotPermanent) {
                player.multiShot = 1;
                showMsg("Powerup Finalizado", k.rgb(255, 100, 100), 1.5, "bottom");
                k.add([k.text("X CHURU FIN"), k.pos(player.pos.sub(0, 50)), k.lifespan(1), k.scale(0.5)]);
            }
        }

        uiHP.text = "❤ ".repeat(Math.ceil(player.hp));
        uiHP.text = "❤ ".repeat(Math.ceil(player.hp));
        uiInfo.text = `XP: ${gameState.totalXP} | LVL: ${gameState.level}\nCHURUS: ${gameState.churusEaten}\nSCORE: ${gameState.score}`;

        // Progression
        let targetSkin = SKINS_LIST[(gameState.level - 1) % SKINS_LIST.length];
        if (bossActive && gameState.bossesDefeated === 2) targetSkin = "gato_poderestudio";

        // SPRITE SWAP LOGIC - Explicit State Check
        if (player.skin !== targetSkin && player.skin !== "gato_daño") {
            player.use(k.sprite(targetSkin));
            player.skin = targetSkin;
            // NO MSG, NO EXPLOSION
        }
    });

    // AUTO-FIRE SYSTEM - Hold space to shoot continuously
    let isShooting = false;
    k.onKeyDown("space", () => { isShooting = true; });
    k.onKeyRelease("space", () => { isShooting = false; });

    // Shooting logic in update loop (more efficient)
    player.onUpdate(() => {
        if (isPaused || !isShooting || player.cd > 0) return;

        let attackSourceSkin = player.skin;
        if (attackSourceSkin === "gato_daño") {
            attackSourceSkin = SKINS_LIST[(gameState.level - 1) % SKINS_LIST.length];
            if (bossActive && gameState.bossesDefeated === 2) attackSourceSkin = "gato_poderestudio";
        }

        const stats = ATTACK_STATS[attackSourceSkin] || ATTACK_STATS["gato_warrior"];

        player.cd = stats.cd / (1 + (player.multiShot * 0.1));

        const shots = isTripleShotPermanent ? Math.max(3, player.multiShot) : player.multiShot;

        // Vertical offsets for multi-shot (all go FORWARD)
        let offsets = [0]; // Single shot = center
        if (shots === 2) offsets = [-15, 15];
        if (shots === 3) offsets = [-20, 0, 20];
        if (shots === 4) offsets = [-30, -10, 10, 30];
        if (shots >= 5) offsets = [-40, -20, 0, 20, 40].slice(0, shots);

        offsets.forEach(yOff => {
            k.add([
                k.sprite(stats.sprite),
                k.pos(player.pos.add(30, yOff)),
                k.anchor("center"),
                k.scale(CONFIG.SCALE.PROJECTILE),
                k.area(),
                k.move(0, stats.speed),
                "projectile",
                { dmg: stats.dmg }
            ]);
        });
    });

    // Enemies - CUMULATIVE (all types always spawn, perros included)
    function spawnEnemy() {
        // Don't spawn during boss fight
        if (bossActive) return;

        // ALL enemies always in pool - CUMULATIVE system
        let pool = [
            { s: "bug", hp: 8, spd: 120, weight: 25 },
            { s: "rata_rapida", hp: 10, spd: 200, weight: 20 },
            { s: "bug_boss", hp: 25, spd: 180, weight: 15 },
            { s: "error_boss", hp: 15, spd: k.rand(150, 280), weight: 15 },
            { s: "perro", hp: 40, spd: 100, tank: true, weight: 25 } // PERROS ALWAYS SPAWN
        ];

        // Weighted random selection
        const totalWeight = pool.reduce((sum, e) => sum + e.weight, 0);
        let r = k.rand() * totalWeight;
        let selected = pool[0];
        for (const e of pool) {
            r -= e.weight;
            if (r <= 0) { selected = e; break; }
        }

        const scale = selected.tank ? 0.5 : k.rand(0.25, 0.4);

        k.add([
            k.sprite(selected.s),
            k.scale(scale),
            k.pos(k.width() + 50, k.rand(50, k.height() - 50)),
            k.anchor("center"),
            k.area({ scale: 0.6 }),
            k.move(180, selected.spd),
            "enemy",
            { hp: selected.hp, maxHp: selected.hp, tank: selected.tank }
        ]);
        gameState.enemiesSpawned++;
    }

    // BOSS SYSTEM VARIABLES - declared here to be accessible everywhere
    let bossesSpawned = 0;
    let gameEnded = false;

    // SPAWN LOOP - AGGRESSIVE PROGRESSION
    function scheduleEnemySpawn() {
        if (bossActive || isPaused || gameEnded) {
            k.wait(1, scheduleEnemySpawn);
            return;
        }

        // AGGRESSIVE curve - more enemies
        let baseInterval = 1.5;
        if (gameState.bossesDefeated >= 1) baseInterval = 1.0;
        if (gameState.bossesDefeated >= 2) baseInterval = 0.7;

        let interval = Math.max(0.4, baseInterval - (gameState.level * 0.04));
        spawnEnemy();

        // Extra enemies at higher levels
        if (gameState.level >= 5 && k.rand() < 0.3) spawnEnemy();
        if (gameState.level >= 10 && k.rand() < 0.2) spawnEnemy();

        k.wait(interval, scheduleEnemySpawn);
    }
    scheduleEnemySpawn();

    // Bullet Hit - SINGLE TARGET (destroy on first hit)
    k.onCollide("projectile", "enemy", (b, e) => {
        k.destroy(b); // Destroy bullet immediately on first hit
        e.hp -= b.dmg;
        k.add([k.sprite("efecto_explosion"), k.pos(e.pos), k.scale(0.4), k.lifespan(0.15)]);

        if (e.hp <= 0) {
            k.destroy(e);
            gameState.enemiesKilled++;
            gameState.xp += 20;
            gameState.totalXP += 20;
            gameState.score += 50;

            // DEATH EFFECT - efecto_rosa
            const deathScale = e.tank ? 1.2 : 0.5;
            k.add([k.sprite("efecto_rosa"), k.pos(e.pos), k.scale(deathScale), k.lifespan(0.5)]);

            if (gameState.xp >= gameState.level * CONFIG.XP_PER_LEVEL) {
                gameState.level++;
                gameState.xp -= (gameState.level - 1) * CONFIG.XP_PER_LEVEL; // Carry over excess XP
            }

            if (e.tank) {
                player.powerupTime += 5;
                showMsg("+TIEMPO DISPARO", k.rgb(200, 200, 255), 1, "bottom");
                spawnChuru(e.pos, false);
            } else if (k.rand() < 0.05) { // 5% Chance dropped from ANY enemy
                spawnChuru(e.pos, false);
            }
        }
    });

    // Player Hit
    k.onCollide("enemy", "player", (e, p) => hitPlayer());
    k.onCollide("enemy_projectile", "player", (e, p) => { k.destroy(e); hitPlayer(); });

    function hitPlayer() {
        player.hp -= 1;
        k.shake(20);
        showMsg("¡DAÑO!", k.rgb(255, 0, 0));

        let restoreSkin = SKINS_LIST[(gameState.level - 1) % SKINS_LIST.length];
        if (bossActive && gameState.bossesDefeated === 2) restoreSkin = "gato_poderestudio";

        player.use(k.sprite("gato_daño"));
        player.skin = "gato_daño";

        k.wait(0.5, () => {
            if (player.hp > 0) {
                player.use(k.sprite(restoreSkin));
                player.skin = restoreSkin;
            }
        });

        if (player.hp <= 0) {
            if (player.hp <= 0) {
                if (currentMusic) currentMusic.paused = true;
                k.go("gameover");
            }
        }
    }

    // Churus - 4 SECOND LIFESPAN WITH BLINK
    function spawnChuru(pos, special) {
        const ch = k.add([
            k.sprite(special ? "churu_special" : "churu"),
            k.scale(special ? 1.2 : 0.8),
            k.pos(pos),
            k.anchor("center"),
            k.area(),
            "pickup",
            { special: special, timer: 4, blinking: false }
        ]);
        // Blink and disappear after 4 seconds
        ch.onUpdate(() => {
            ch.timer -= k.dt();
            if (ch.timer < 1.5 && !ch.blinking) {
                ch.blinking = true;
            }
            if (ch.blinking) {
                ch.opacity = Math.sin(k.time() * 15) > 0 ? 1 : 0.3;
            }
            if (ch.timer <= 0) k.destroy(ch);
        });
    }

    function scheduleChuru() {
        // Spawns more often at high levels
        let interval = Math.max(3, 8 - (gameState.level * 0.3));

        spawnChuru(k.vec2(k.rand(100, 700), k.rand(50, 400)), k.rand() < 0.1);
        k.wait(interval, scheduleChuru);
    }
    scheduleChuru();

    k.onCollide("player", "pickup", (p, c) => {
        k.destroy(c);
        gameState.churusEaten++;
        k.add([k.sprite("efecto_rosa"), k.pos(player.pos), k.lifespan(0.5)]);

        if (c.special) {
            isTripleShotPermanent = true;
            showMsg("¡DISPARO TRIPLE PERMANENTE!", k.rgb(255, 215, 0), 2, "bottom");
        } else {
            player.powerupTime = 10;
            if (player.multiShot < 6) player.multiShot++;
            showMsg(`¡CHURU POWER! x${player.multiShot}`, k.rgb(255, 105, 180), 1.5, "bottom");
        }
    });

    // BOSS SYSTEM

    k.wait(30, () => spawnBoss(0));

    function spawnBoss(tier) {
        console.log("spawnBoss called with tier:", tier, "bossesSpawned:", bossesSpawned, "gameEnded:", gameEnded);

        // ONLY check gameEnded - remove other blocks
        if (gameEnded) {
            console.log("Game ended, not spawning");
            return;
        }

        console.log("SPAWNING BOSS TIER", tier);
        bossActive = true;
        bossesSpawned++;

        // STOP ALL music before starting boss music
        playMusic("music_boss", 0.4);

        const boss = k.add([
            k.sprite("boss_normal"),
            k.scale(CONFIG.SCALE.BOSS),
            k.pos(k.width() - 150, k.height() / 2),
            k.anchor("center"),
            k.area({ scale: 0.8 }),
            k.body({ isStatic: true }),
            "boss",
            {
                hp: CONFIG.BOSS_HP[tier],
                maxHp: CONFIG.BOSS_HP[tier],
                tier: tier,
                timer: 0,
                currentPhase: "normal",
                invulnerable: false,
                immune: false,
                phaseTimer: 0, // Timer for defensive phases
                isDead: false, // Prevent multiple death calls
                msgCooldown: 0 // Cooldown for blocked/resist messages
            }
        ]);

        // HP BAR and NAME
        const barBg = k.add([k.rect(500, 20), k.pos(k.width() / 2, 50), k.anchor("center"), k.color(50, 0, 0), "bossUI"]);
        const bar = k.add([k.rect(500, 20), k.pos(k.width() / 2, 50), k.anchor("center"), k.color(255, 0, 0), "bossUI"]);
        const bossName = k.add([k.text(tier === 2 ? "JEFE FINAL" : `BOSS ${tier + 1}`), k.pos(k.width() / 2, 20), k.anchor("center"), "bossUI", k.z(150)]);

        boss.onUpdate(() => {
            if (isPaused) return; // Strict pause check

            bar.width = (boss.hp / boss.maxHp) * 500;
            boss.timer -= k.dt();
            boss.phaseTimer -= k.dt();

            const pct = boss.hp / boss.maxHp;
            let targetPhase = "normal";
            let phaseSkin = "boss_normal";
            let invulnerable = false;
            let immune = false;

            // --- PHASE LOGIC ---
            if (tier < 2) {
                if (pct < 0.2) { targetPhase = "enrage"; phaseSkin = "boss_enrage"; }
                else if (pct < 0.3) { targetPhase = "pistola"; phaseSkin = "boss_doblepistola"; }
                else if (pct < 0.5) { targetPhase = "inmune"; phaseSkin = "boss_inmune"; immune = true; }
                else if (pct < 0.6) { targetPhase = "invuln"; phaseSkin = "boss_invulnerable"; invulnerable = true; }
                else if (pct < 0.8) { targetPhase = "mirror"; phaseSkin = "boss_espejismo"; }
            } else {
                if (pct < 0.1) { targetPhase = "joystick"; phaseSkin = "boss_joystick"; }
                else if (pct < 0.2) { targetPhase = "cafe"; phaseSkin = "boss_cafe"; }
                else if (pct < 0.3) { targetPhase = "libro"; phaseSkin = "boss_reylibro"; }
                else if (pct < 0.4) { targetPhase = "enrage"; phaseSkin = "boss_enrage"; }
                else if (pct < 0.5) { targetPhase = "pistola"; phaseSkin = "boss_doblepistola"; }
                else if (pct < 0.6) { targetPhase = "inmune"; phaseSkin = "boss_inmune"; immune = true; }
                else if (pct < 0.7) { targetPhase = "invuln"; phaseSkin = "boss_invulnerable"; invulnerable = true; }
                else if (pct < 0.9) { targetPhase = "mirror"; phaseSkin = "boss_espejismo"; }

                // MESSAGE FOR FINAL BOSS when getting weak
                if (pct <= 0.5 && pct > 0.4 && !boss.msg50) {
                    boss.msg50 = true;
                    showMsg("¡JEFE FINAL DÉBIL, DISPARA!", k.rgb(0, 255, 0), 2, "center");
                }
            }

            // ANTI FLICKER + PHASE TIMER
            if (boss.currentPhase !== targetPhase) {
                boss.currentPhase = targetPhase;
                boss.invulnerable = invulnerable;
                boss.immune = immune;
                boss.phaseTimer = 5; // 5 SECONDS for defensive phases

                boss.use(k.sprite(phaseSkin));
                k.shake(5);
                k.add([k.sprite("efecto_explosion"), k.pos(boss.pos), k.scale(1.5), k.lifespan(0.3)]);

                showMsg(invulnerable ? "¡INVULNERABLE 5s!" : (immune ? "¡ESCUDO 5s!" : "¡NUEVA FASE!"), k.rgb(255, 100, 100), 1, "top");
            }

            // AUTO-DISABLE DEFENSIVE STATES AFTER 3 SECONDS
            if (boss.phaseTimer <= 0 && (boss.invulnerable || boss.immune)) {
                boss.invulnerable = false;
                boss.immune = false;
                showMsg("¡VULNERABLE!", k.rgb(0, 255, 0), 1, "top");
            }

            // ATTACKS - ENRAGE = SPAM LIBROS
            if (boss.timer <= 0 && !boss.isDead) {
                const isEnrage = boss.currentPhase === "enrage";
                const n = k.rand();

                if (isEnrage) {
                    // ENRAGE MODE: 50% libros, 30% keys, 20% bugs
                    if (n < 0.50) {
                        k.add([k.sprite("libro_boss"), k.pos(boss.pos), k.move(k.rand(160, 200), 280), "enemy_projectile", { dmg: 1 }, k.area(), k.scale(0.45), k.lifespan(4)]);
                    } else if (n < 0.80) {
                        k.add([k.sprite("ataque_key"), k.pos(boss.pos), k.move(k.rand(150, 210), 300), "enemy_projectile", { dmg: 1 }, k.area(), k.scale(0.4), k.lifespan(3)]);
                    } else {
                        k.add([k.sprite("bug_boss"), k.pos(boss.pos), k.move(k.rand(150, 210), k.rand(150, 220)), "enemy", { hp: 8, tank: false }, k.area(), k.scale(0.25), k.lifespan(5)]);
                    }
                    boss.timer = 0.4; // FASTER attacks in enrage
                } else {
                    // Normal attacks
                    if (n < 0.10) {
                        k.add([k.sprite("libro_boss"), k.pos(boss.pos), k.move(180, 250), "enemy_projectile", { dmg: 1 }, k.area(), k.scale(0.4), k.lifespan(4)]);
                    } else if (n < 0.20) {
                        k.add([k.sprite("ataque_key"), k.pos(boss.pos), k.move(k.rand(160, 200), 280), "enemy_projectile", { dmg: 1 }, k.area(), k.scale(0.35), k.lifespan(3)]);
                    } else {
                        k.add([k.sprite("bug_boss"), k.pos(boss.pos), k.move(k.rand(150, 210), k.rand(150, 220)), "enemy", { hp: 10, tank: false }, k.area(), k.scale(0.3), k.lifespan(6)]);
                    }
                    boss.timer = Math.max(0.8, 2.0 * pct);
                }
            }
        });

        k.onCollide("projectile", "boss", (b, boss) => {
            k.destroy(b);
            if (boss.isDead) return;

            // Message cooldown to prevent spam
            boss.msgCooldown -= k.dt();

            if (boss.invulnerable) {
                if (boss.msgCooldown <= 0) {
                    showMsg("¡BLOQUEADO!", k.rgb(100, 100, 255), 0.5, "top");
                    boss.msgCooldown = 0.8; // Only show every 0.8 seconds
                }
                return;
            }
            let dmg = b.dmg;
            if (boss.immune) {
                dmg *= 0.1;
                if (boss.msgCooldown <= 0) {
                    showMsg("¡RESISTIDO!", k.rgb(200, 200, 200), 0.5, "top");
                    boss.msgCooldown = 0.8;
                }
            }
            boss.hp -= dmg;
            k.add([k.sprite("efecto_explosion"), k.pos(b.pos), k.lifespan(0.2)]);

            if (boss.hp <= 0 && !boss.isDead) {
                boss.isDead = true;
                console.log("Boss died! Calling destroyBoss with tier:", boss.tier);
                destroyBoss(boss, boss.tier); // Use boss.tier property
            }
        });
    }

    function destroyBoss(bossObj, tier) {
        bossObj.hp = 0;
        // Global music handled below contextually

        // CLEANUP: Destroy ALL boss UI and projectiles
        k.get("enemy_projectile").forEach(p => k.destroy(p));
        k.get("bossUI").forEach(ui => k.destroy(ui));

        bossActive = false;
        gameState.bossesDefeated++;
        showMsg("¡BOSS DERROTADO!", k.rgb(255, 215, 0), 3, "top");
        spawnChuru(bossObj.pos, true);

        // Save position before destroying
        const deathPos = bossObj.pos.clone();

        // Destroy boss object immediately (no invisible wall)
        k.destroy(bossObj);

        // Create visual-only death animation (no collision)
        const deathSprite = k.add([
            k.sprite("boss_debilitado"),
            k.pos(deathPos),
            k.anchor("center"),
            k.scale(CONFIG.SCALE.BOSS),
            k.opacity(1)
        ]);

        k.wait(1, () => {
            deathSprite.use(k.sprite("boss_muerto"));
            deathSprite.onUpdate(() => {
                deathSprite.opacity -= k.dt() / 2;
                if (deathSprite.opacity <= 0) {
                    k.destroy(deathSprite);
                }
            });
        });

        // Music management - restart game music for non-final boss
        if (tier < 2) {
            playMusic("music_game", 0.4);
        }

        // Next boss or WIN SCREEN
        console.log("=== DESTROY BOSS ===");
        console.log("Boss tier:", tier);
        console.log("Boss.tier property:", bossObj.tier);
        console.log("gameEnded flag:", gameEnded);
        console.log("Checking if tier >= 2:", tier >= 2);

        if (tier >= 2 || bossObj.tier >= 2) {
            // *** FINAL BOSS DEFEATED ***
            console.log("*** FINAL BOSS VICTORY TRIGGERED ***");

            gameEnded = true;
            bossActive = false;
            // Music stops via scene change or explicit stop if needed, 
            // but we leave it playing until win scene for dramatic effect or stop it:
            if (currentMusic) currentMusic.stop();

            k.get("enemy").forEach(e => k.destroy(e));
            k.get("enemy_projectile").forEach(p => k.destroy(p));
            showMsg("¡JEFE FINAL MUERTO!", k.rgb(255, 215, 0), 3, "center");

            k.wait(3, () => {
                console.log("Executing k.go('win')");
                k.go("win");
            });
        } else {
            // MESSAGES ONLY AFTER BOSS 2 (tier 1)
            bossActive = false;

            if (tier === 1) {
                // This is Boss 2, next is Final Boss
                k.wait(20, () => {
                    if (gameEnded) return;
                    showMsg("¡10 SEGUNDOS PARA EL JEFE FINAL!", k.rgb(255, 0, 0), 3, "center");
                });

                k.wait(25, () => {
                    if (gameEnded) return;
                    showMsg("¡PREPÁRATE!", k.rgb(255, 100, 0), 2, "center");
                });
            }

            // Spawn next boss at 30s
            k.wait(30, () => {
                if (gameEnded) return;
                console.log("30s elapsed, spawning boss tier", tier + 1);
                spawnBoss(tier + 1);
            });
        }
    }
});

k.scene("win", () => {
    playMusic("final_song", 0.5);

    // Full black background
    k.add([k.rect(k.width(), k.height()), k.pos(0, 0), k.color(0, 0, 0), k.opacity(0.95), k.z(150)]);

    k.wait(0.5, () => {
        // 1. TITLE (Top Center)
        k.add([
            k.text("¡FELICITACIONES!", { size: 48, align: "center" }),
            k.pos(k.width() / 2, 50),
            k.anchor("center"),
            k.color(255, 215, 0),
            k.z(200)
        ]);

        // 2. LAYOUT: SIDE BY SIDE to prevent overlap
        // Image on the Left (approx 1/3 width) - MOVED FURTHER LEFT AND SMALLER
        const img2 = k.add([
            k.sprite("final_feliz2"),
            k.pos(k.width() * 0.25, k.height() / 2), // Left quarter
            k.anchor("center"),
            k.scale(0.8), // Reduced scale
            k.opacity(0),
            k.z(160)
        ]);
        img2.onUpdate(() => { if (img2.opacity < 1) img2.opacity += k.dt(); });

        // Stats on the Right (approx 2/3 width) - MOVED FURTHER RIGHT
        k.add([
            k.text(`Experiencia Total:\n${gameState.totalXP}\n\nChurus Comidos:\n${gameState.churusEaten}`, { size: 28, align: "center" }),
            k.pos(k.width() * 0.75, k.height() / 2), // Right quarter
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(200)
        ]);

        // 3. CREDITS (Bottom)
        const creditsText = "Juego desarrollado con fines académicos por: Paz Molina\nDuoc UC - Ing. en Informática 2025";
        k.add([
            k.text(creditsText, { size: 18, align: "center", width: 700 }),
            k.pos(k.width() / 2, k.height() - 60),
            k.anchor("center"),
            k.z(200)
        ]);

        k.add([
            k.text("Click para reiniciar", { size: 16 }),
            k.pos(k.width() / 2, k.height() - 20),
            k.anchor("center"),
            k.z(200),
            k.color(100, 100, 100)
        ]);

        // Decor (Small churus around the stats?)
        k.add([k.sprite("churu"), k.pos(k.width() * 0.75, k.height() / 2 - 80), k.scale(1), k.anchor("center"), k.z(170)]);
    });
    k.onClick(() => k.go("start"));
});

k.scene("gameover", () => {
    playMusic("final_song", 0.5);
    k.add([k.sprite("boss_gameover"), k.pos(k.width() / 2, k.height() / 2), k.anchor("center"), k.scale(2.0)]);
    k.add([k.text("REPROBADO", { size: 48, color: k.rgb(255, 0, 0) }), k.pos(k.width() / 2, 100), k.anchor("center")]);
    k.onMousePress(() => k.go("start"));
});

k.go("start");
