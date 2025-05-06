import * as PIXI from 'pixi.js';
import { Enemy } from './Enemy';
import {Projectile} from "./Projectiles.ts";

export class Tower {
    private sprite: PIXI.Graphics;
    private fireCooldown = 20; // кадри между изстрели
    private timer = 0;
    private range = 100;
    private x: number;
    private y: number;
    private enemies: Enemy[]
    private projectiles: Projectile[] = [];
    private app: PIXI.Application;
    constructor(
        app: PIXI.Application,
        x: number,
        y: number,
        enemies: Enemy[]
    ) {
        this.app = app
        this.x = x;
        this.y = y;
        this.enemies = enemies;
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0x00ccff);
        this.sprite.drawRect(-16, -16, 32, 32);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;
        this.timer = this.fireCooldown;
        app.stage.addChild(this.sprite);
    }

    update(delta: number) {
        this.timer += delta;
        if (this.timer >= this.fireCooldown) {
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

        this.projectiles = this.projectiles.filter(p => {
            p.update(delta);
            return p.isAlive();
        });
    }

    fireAt(enemy: Enemy) {
        const projectile = new Projectile(
            this.app,
            enemy,
            this.x,
            this.y,
            1
        );
        projectile.update(1); // ← минимално движение
        this.projectiles.push(projectile);
    }
}
