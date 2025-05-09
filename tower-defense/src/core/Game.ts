
import { Grid } from './Grid';
import { Enemy } from '../entities/Enemy';
import { Tower } from '../entities/Tower';
import * as PIXI from 'pixi.js';

export class Game {
    private readonly tileSize = 64;
    private grid: Grid;
    private enemies: Enemy[] = [];
    private towers: Tower[] = [];
    private money = 100;
    private moneyText: PIXI.Text;
    private waveTimer = 5;
    private waveCooldown = 5;
    private waveNumber = 1;



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
    }

    update(delta: number) {
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
                enemy.setOnDeath(() => {
                    this.enemies = this.enemies.filter(e => e.isAlive());
                    this.money += 20;
                    this.moneyText.text = `Money: ${this.money}`;
                });
                this.enemies.push(enemy);
            }, i * 500); // закъснение между враговете
        }
        this.waveNumber++;
    }
    private spawnEnemy() {
        const path = this.grid.getPath();
        const enemy = new Enemy(this.app, path, 64);
        enemy.setOnDeath(() => this.addMoney(50));
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

    private tryBuildTower(x: number, y: number) {
        const tileSize = 64;
        const cost = 50;

        if (this.spendMoney(cost)) {
            const tower = new Tower(
                this.app,
                x * tileSize,
                y * tileSize,
                () => this.enemies
            );
            this.towers.push(tower);
            console.log(`🛡️ Built tower at (${x}, ${y})`);
        }
    }
    private updateMoneyText() {
        this.moneyText.text = `Money: ${this.money}`;
    }
}
