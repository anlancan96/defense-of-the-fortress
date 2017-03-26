var Dotf = Dotf || {};

Dotf.configs = {
    GAME_WIDTH_MAX: 1366,
    GAME_HEIGHT_MAX: 768,
    GAME_WIDTH_MIN: 320,
    GAME_HEIGHT_MIN: 480,
    GAME_WORLD_WIDTH: 2960,
    GAME_WORLD_HEIGHT: 2160,
    gun: {
        bulletSpeed: 1500
        // TODO add types of gun
    },
    player: {
        speed: 200
    },
    enemy: {
        position: {
            x: Math.floor(Math.random() * 2960) + 1,
            y: Math.floor(Math.random() * 2160) + 1
            // reference GAME_WIDTH_MAX, GAME_HEIGHT_MAX
        }
    }
};

window.onload = function() {
    Dotf.game = new Phaser.Game(Dotf.configs.GAME_WIDTH_MAX, Dotf.configs.GAME_HEIGHT_MAX, Phaser.CANVAS, '', {
        preload: preload,
        create: create,
        update: update,
        render: render
    }, false, false);
};

// preparations before game starts
const preload = () => {
    Dotf.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    Dotf.game.scale.pageAlignHorizontally = true;
    Dotf.game.scale.pageAlignVertically = true;
    Dotf.game.scale.setScreenSize = true;
    // TODO fix responsive
    Dotf.game.time.advancedTiming = true;
    // Dotf.game.load.atlasJSONHash('assets', 'Assets/assets.png', 'Assets/assets.json');
    Dotf.game.load.image('background', 'Assets/maps/map1.png');
    Dotf.game.load.image('cursor', 'Assets/cursors/1crosshair.png');
    //TODO create a spritesheet including all animations of an object.
    // <GUN TYPE>
    Dotf.game.load.image('gun', 'Assets/guns/flamthrower/flamethrower_down.png');
    // <CONTRUCTIONS>
    Dotf.game.load.image('fountain', 'Assets/other/base.png');
    Dotf.game.load.image('healthBar', 'Assets/other/healthBar.png');
    Dotf.game.load.image('healthBarBG', 'Assets/other/healthBarBG.png');
    // <BULLET TYPE>
    Dotf.game.load.image('bulleta', 'Assets/other/bulleta.png', 32, 32);
    // <ANIMATION>
    Dotf.game.load.spritesheet('character1_animation', 'Assets/spritesheet/character1.png', 16, 21);
    Dotf.game.load.spritesheet('flaming_gun_animation', 'Assets/guns/flamthrower/flaming_gun.png', 21, 16);
    // <ENEMY>
    Dotf.game.load.spritesheet('enemy', 'Assets/monster/slime1_front.png', 16, 16);

};

// initialize the game
const create = () => {

    Dotf.game.physics.startSystem(Phaser.Physics.ARCADE);
    Dotf.keyboard = Dotf.game.input.keyboard;
    Dotf.game.input.mouse.capture = true;
    Dotf.game.world.setBounds(0, 0, Dotf.configs.GAME_WORLD_WIDTH, Dotf.configs.GAME_WORLD_HEIGHT);

    Dotf.background1 = Dotf.game.add.tileSprite(0, 0, Dotf.configs.GAME_WORLD_WIDTH, Dotf.configs.GAME_WORLD_HEIGHT, 'background');
    Dotf.background1.scale.setTo(2);


    // physic Groups
    Dotf.constructions = Dotf.game.add.physicsGroup();
    Dotf.playerGroup = Dotf.game.add.physicsGroup();
    Dotf.gunGroup = Dotf.game.add.physicsGroup();
    Dotf.playerBulletGroup = Dotf.game.add.physicsGroup();
    Dotf.enemiesGroup = Dotf.game.add.physicsGroup();

    Dotf.greenEnemies = [];
    // TODO Create TowerController class. TownerGroup.
    Dotf.base = new BaseController(1880, 500, Dotf.constructions, 'fountain', {});

    Dotf.player = new PlayerController(Dotf.playerGroup, 'character1_animation', {
        up: Phaser.Keyboard.W,
        down: Phaser.Keyboard.S,
        left: Phaser.Keyboard.A,
        right: Phaser.Keyboard.D,
        speed: Dotf.configs.player.speed
    });

    setInterval(function() {
        new EnemyController({
                x: Math.floor(Math.random() * 2960) + 1,
                y: Math.floor(Math.random() * 2160) + 1
                // reference GAME_WIDTH_MAX, GAME_HEIGHT_MAX
            },
            'enemy',
            Dotf.enemiesGroup, {
                speed: 100
            });
    }, 2000);

}

var onEnemyHitBase = (enemySprite, BaseSprite) => {
    BaseSprite.damage(enemySprite.setDamage);
    enemySprite.kill();
}

var onBulletHitEnemy = (playerBulletSprite, enemySprite) => {
    enemySprite.damage(playerBulletSprite.setDamage);
    playerBulletSprite.kill();
}

// update game state each frame
const update = () => {
    Dotf.player.update();
    Dotf.base.update();

    Dotf.greenEnemies.forEach(enemy => enemy.update());

    Dotf.game.physics.arcade.overlap(
        Dotf.enemiesGroup,
        Dotf.constructions,
        onEnemyHitBase
    );

    Dotf.game.physics.arcade.overlap(
        Dotf.playerBulletGroup,
        Dotf.enemiesGroup,
        onBulletHitEnemy
    );

};

// before camera render (mostly for debug)
const render = () => {};
