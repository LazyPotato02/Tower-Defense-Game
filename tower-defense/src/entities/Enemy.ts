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
    private hp = 4;
    private isDead = false;

    private onDeathCallback?: () => void;

    constructor(app: PIXI.Application, path: Point[], tileSize: number) {
        this.path = path;

        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xff3333);
        this.sprite.drawCircle(0, 0, tileSize / 4);
        this.sprite.endFill();

        this.sprite.x = path[0].x * tileSize + tileSize / 2;
        this.sprite.y = path[0].y * tileSize + tileSize / 2;

        app.stage.addChild(this.sprite);
    }

    getX() {
        return this.isDead ? -99999 : this.sprite.x;
    }

    getY() {
        return this.isDead ? -99999 : this.sprite.y;
    }

    hit(damage: number) {
        this.hp -= damage;
        console.log(`🧟 Enemy hit! HP left: ${this.hp}`);
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    destroy() {
        if (this.isDead) return;
        this.isDead = true;
        this.sprite.destroy(); // ❗️само веднъж
        if (this.onDeathCallback) this.onDeathCallback();
    }

    isAlive(): boolean {
        return !this.isDead;
    }

    update(delta: number) {
        if (this.isDead) return; // ✅ важно: спираме ъпдейта напълно

        const color = this.hp <= 2 ? 0xaa0000 : 0xff3333;
        this.sprite.clear();
        this.sprite.beginFill(color);
        this.sprite.drawCircle(0, 0, 20);
        this.sprite.endFill();

        const tileSize = 64;
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

    setOnDeath(cb: () => void) {
        this.onDeathCallback = cb;
    }
}
