
import { Grid } from './Grid';
import { Enemy } from '../entities/Enemy';
import { Tower } from '../entities/Tower';
import * as PIXI from 'pixi.js';

export class Game {
    private grid: Grid;
    private enemies: Enemy[] = [];
    private towers: Tower[] = [];
    private money = 100;

    constructor(private app: PIXI.Application) {
        this.grid = new Grid(app);
        this.grid.onBuildRequest = (x, y) => this.tryBuildTower(x, y);
        this.spawnEnemy();
    }

    update(delta: number) {
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(delta);
            return enemy.isAlive();
        });

        for (const tower of this.towers) {
            tower.update(delta);
        }
    }

    private spawnEnemy() {
        const path = this.grid.getPath();
        const enemy = new Enemy(this.app, path, 64);
        enemy.setOnDeath(() => this.addMoney(50));
        this.enemies.push(enemy);
    }

    private addMoney(amount: number) {
        this.money += amount;
        console.log(`💰 +${amount} (Total: ${this.money})`);
    }

    private spendMoney(amount: number): boolean {
        if (this.money >= amount) {
            this.money -= amount;
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
                x * tileSize + tileSize / 2,
                y * tileSize + tileSize / 2,
                this.enemies
            );
            this.towers.push(tower);
            console.log(`🛡️ Built tower at (${x}, ${y})`);
        }
    }
}
