import * as PIXI from 'pixi.js';

interface Point {
    x: number;
    y: number;
}

export class Enemy {
    private sprite: PIXI.Graphics;
    private speed = 1.5;
    private path: Point[];
    private currentIndex = 0;

    constructor(app: PIXI.Application, path: Point[], tileSize: number) {
        this.path = path;

        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xff3333);
        this.sprite.drawCircle(0, 0, tileSize / 4);
        this.sprite.endFill();

        // Начална позиция
        this.sprite.x = path[0].x * tileSize + tileSize / 2;
        this.sprite.y = path[0].y * tileSize + tileSize / 2;

        app.stage.addChild(this.sprite);
    }

    getX() {
        return this.sprite.x;
    }

    getY() {
        return this.sprite.y;
    }

    hit(damage: number) {
        console.log(`🧟 Enemy hit! Damage: ${damage}`);
        // По-късно ще имаме HP и умиране
    }

    update(delta: number) {
        if (this.currentIndex >= this.path.length - 1) return;

        const tileSize = 64; // или подай като параметър
        const target = this.path[this.currentIndex + 1];
        const tx = target.x * tileSize + tileSize / 2;
        const ty = target.y * tileSize + tileSize / 2;

        const dx = tx - this.sprite.x;
        const dy = ty - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) {
            this.currentIndex++;
            return;
        }

        const vx = (dx / dist) * this.speed * delta;
        const vy = (dy / dist) * this.speed * delta;

        this.sprite.x += vx;
        this.sprite.y += vy;
    }
}
