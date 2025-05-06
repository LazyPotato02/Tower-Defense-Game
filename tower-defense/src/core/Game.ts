import { Grid } from './Grid';
import { Enemy } from '../entities/Enemy';
import * as PIXI from 'pixi.js';

export class Game {
    private grid: Grid;
    private enemies: Enemy[] = [];

    constructor(app: PIXI.Application) {
        this.grid = new Grid(app);

        const path = this.grid.getPath(); // ще добавим тази функция
        const enemy = new Enemy(app, path, 64);
        this.enemies.push(enemy);
    }

    update(delta: number) {
        for (const enemy of this.enemies) {
            enemy.update(delta);
        }
    }
}
