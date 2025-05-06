import * as PIXI from 'pixi.js';
import { Enemy } from './Enemy';

export class Projectile {
    private sprite: PIXI.Graphics;
    private speed = 16;
    private radius = 6;
    private isDestroyed = false;
    private target: Enemy;
    private damage: number;
    private app: PIXI.Application;
    constructor(
        app: PIXI.Application,
        target: Enemy,
        x: number,
        y: number,
       damage: number
    ) {
        this.app=app
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xf70505);
        this.sprite.drawCircle(0, 0, this.radius);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;

        this.target = target;
        this.damage = damage

        this.app.stage.addChild(this.sprite);
    }

    update(delta: number) {
        if (this.isDestroyed) return;

        const dx = this.target.getX() - this.sprite.x;
        const dy = this.target.getY() - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.radius + 4) {
            this.target.hit(this.damage);
            this.destroy();
            return;
        }

        const vx = (dx / dist) * this.speed * delta;
        const vy = (dy / dist) * this.speed * delta;

        this.sprite.x += vx;
        this.sprite.y += vy;
    }

    destroy() {
        this.app.stage.removeChild(this.sprite);
        this.isDestroyed = true;
    }

    isAlive() {
        return !this.isDestroyed;
    }
}
