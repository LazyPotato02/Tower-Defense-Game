import { Grid } from './Grid';
import { Enemy } from '../entities/Enemy';
import { Tower } from '../entities/Tower';
import * as PIXI from 'pixi.js';

export class Game {
    private grid: Grid;
    private enemies: Enemy[] = [];
    private towers: Tower[] = [];

    constructor(app: PIXI.Application) {
        this.grid = new Grid(app);

        const path = this.grid.getPath();
        const enemy = new Enemy(app, path, 64);
        this.enemies.push(enemy);

        const tower = new Tower(app, 5 * 64 + 32, 4 * 64 + 32, this.enemies);
        this.towers.push(tower);
    }

    update(delta: number) {
        this.enemies = this.enemies.filter(e => {
            e.update(delta);
            return e.isAlive();
        });

        for (const tower of this.towers) {
            tower.update(delta);
        }
    }
}
