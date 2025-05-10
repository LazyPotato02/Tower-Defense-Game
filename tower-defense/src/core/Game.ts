
import { Grid } from './Grid';
import { Enemy } from '../entities/Enemy';
import { Tower } from '../entities/Tower';
import * as PIXI from 'pixi.js';

export class Game {
    private readonly tileSize = 64;
    private gameStarted = false;
    private grid: Grid;
    private enemies: Enemy[] = [];
    private towers: Tower[] = [];
    private money = 100;
    private moneyText: PIXI.Text;
    private waveTimer = 5;
    private waveCooldown = 5;
    private waveNumber = 1;
    private lives = 5;
    private livesBar: PIXI.Graphics;


    constructor(private app: PIXI.Application) {
        this.grid = new Grid(app);
        this.grid.onBuildRequest = (x, y) => this.tryBuildTower(x, y);
        this.spawnEnemy();

        this.moneyText = new PIXI.Text(`Money: ${this.money}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
        });
        this.moneyText.x = 20;
        this.moneyText.y = 20;
        this.app.stage.addChild(this.moneyText);
        this.livesBar = new PIXI.Graphics();
        this.livesBar.x = 20;
        this.livesBar.y = 60;
        this.app.stage.addChild(this.livesBar);
        this.updateLivesBar();
        this.showStartScreen();
    }
    private updateLivesBar() {
        this.livesBar.clear();
        const width = 200;
        const height = 20;
        const percent = Math.max(this.lives, 0) / 5;

        this.livesBar.lineStyle(2, 0xffffff);
        this.livesBar.beginFill(0xff4444);
        this.livesBar.drawRect(0, 0, width * percent, height);
        this.livesBar.endFill();
    }
    private showStartScreen() {
        const overlay = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.8);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        overlay.addChild(bg);

        const title = new PIXI.Text('Tower Defense', {
            fontSize: 48,
            fill: '#ffffff',
            fontWeight: 'bold',
        });
        title.anchor.set(0.5);
        title.x = this.app.screen.width / 2;
        title.y = this.app.screen.height / 2 - 60;
        overlay.addChild(title);

        const button = new PIXI.Graphics();
        button.beginFill(0xffffff);
        button.drawRoundedRect(-100, -25, 200, 50, 10);
        button.endFill();
        button.x = this.app.screen.width / 2;
        button.y = this.app.screen.height / 2 + 20;
        button.eventMode = 'static';
        button.cursor = 'pointer';

        const buttonText = new PIXI.Text('Start Game', {
            fontSize: 24,
            fill: 0x000000,
            fontWeight: 'bold',
        });
        buttonText.anchor.set(0.5);
        button.addChild(buttonText);

        button.on('pointerdown', () => {
            this.app.stage.removeChild(overlay);
            this.gameStarted = true;
        });

        overlay.addChild(button);
        this.app.stage.addChild(overlay);
    }


    update(delta: number) {
        if (!this.gameStarted) return;
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(delta);
            return enemy.isAlive();
        });
        this.waveTimer -= delta / 60;
        if (this.waveTimer <= 0) {
            this.spawnWave();
            this.waveTimer = this.waveCooldown;
        }
        for (const tower of this.towers) {
            tower.update(delta);
        }
    }
    spawnWave() {
        for (let i = 0; i < this.waveNumber + 2; i++) {
            setTimeout(() => {
                const enemy = new Enemy(this.app, this.grid.getPath(), this.tileSize);
                enemy.setOnDeath((escaped) => {
                    this.enemies = this.enemies.filter(e => e.isAlive());

                    if (escaped) {
                        this.lives--;
                        this.updateLivesBar();
                        if (this.lives <= 0) {
                            this.showGameOverScreen();
                            this.app.ticker.stop();
                        }
                    } else {
                        this.addMoney(15);
                        this.updateMoneyText();
                    }
                });
                this.enemies.push(enemy);
            }, i * 500);
        }
        this.waveNumber++;
    }
    private spawnEnemy() {
        const path = this.grid.getPath();
        const enemy = new Enemy(this.app, path, 64);
        enemy.setOnDeath((escaped) => {
            this.enemies = this.enemies.filter(e => e.isAlive());

            if (escaped) {
                this.lives--;
                this.updateLivesBar();
                if (this.lives <= 0) {
                    this.showGameOverScreen();
                    this.app.ticker.stop();
                }
            } else {
                this.addMoney(15);
                this.updateMoneyText();
            }
        });



        this.enemies.push(enemy);
    }

    private addMoney(amount: number) {
        this.money += amount;
        this.updateMoneyText();
        console.log(`💰 +${amount} (Total: ${this.money})`);
    }

    private spendMoney(amount: number): boolean {
        if (this.money >= amount) {
            this.money -= amount;
            this.updateMoneyText();
            console.log(`💸 -${amount} (Left: ${this.money})`);
            return true;
        }
        console.log("🚫 Not enough money to build tower.");
        return false;
    }

    private tryBuildTower(x: number, y: number): boolean {
        if (!this.gameStarted) return false;

        const tileSize = 64;
        const cost = 50;

        if (this.spendMoney(cost)) {
            const tower = new Tower(
                this.app,
                x * tileSize,
                y * tileSize,
                () => this.enemies
            );
            tower.setOnClick(() => {
                if (this.spendMoney(50)) {
                    tower.upgradeFireRate();
                }
            });
            this.towers.push(tower);
            return true;
        }

        return false;
    }

    private updateMoneyText() {
        this.moneyText.text = `Money: ${this.money}`;
    }
    private showGameOverScreen() {
        const overlay = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.8);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        overlay.addChild(bg);

        const style = new PIXI.TextStyle({
            fontSize: 48,
            fill: '#ffffff',
            fontWeight: 'bold',
        });

        const gameOverText = new PIXI.Text('GAME OVER', style);
        gameOverText.anchor.set(0.5);
        gameOverText.x = this.app.screen.width / 2;
        gameOverText.y = this.app.screen.height / 2 - 60;
        overlay.addChild(gameOverText);

        const button = new PIXI.Graphics();
        button.beginFill(0xffffff);
        button.drawRoundedRect(-100, -25, 200, 50, 10);
        button.endFill();
        button.x = this.app.screen.width / 2;
        button.y = this.app.screen.height / 2 + 20;
        button.eventMode = 'static';
        button.cursor = 'pointer';
        button.on('pointerdown', () => {
            location.reload();
        });

        const buttonText = new PIXI.Text('Play Again', {
            fontSize: 24,
            fill: 0x000000,
            fontWeight: 'bold',
        });
        buttonText.anchor.set(0.5);
        button.addChild(buttonText);

        overlay.addChild(button);

        this.app.stage.addChild(overlay);
    }
}
