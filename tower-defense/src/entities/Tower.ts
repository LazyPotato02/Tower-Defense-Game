import * as PIXI from 'pixi.js';
import { Enemy } from './Enemy';

export class Tower {
    private sprite: PIXI.Graphics;
    private fireCooldown = 60; // кадри между изстрели
    private timer = 0;
    private range = 100;
    private x: number;
    private y: number;
    private enemies: Enemy[]

    constructor(
        app: PIXI.Application,
        x: number,
        y: number,
        enemies: Enemy[]
    ) {
        this.x = x;
        this.y = y;
        this.enemies = enemies;
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0x00ccff);
        this.sprite.drawRect(-16, -16, 32, 32);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;

        app.stage.addChild(this.sprite);
    }

    update(delta: number) {
        this.timer += delta;
        if (this.timer < this.fireCooldown) return;

        const target = this.enemies.find((enemy) => {
            const dx = enemy.getX() - this.x;
            const dy = enemy.getY() - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return dist < this.range;
        });

        if (target) {
            this.fireAt(target);
            this.timer = 0;
        }
    }

    fireAt(enemy: Enemy) {
        console.log('💥 Fire at enemy!');
        enemy.hit(1);
        // По-късно ще добавим projectile sprite
    }
}
