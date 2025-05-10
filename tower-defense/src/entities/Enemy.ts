import * as PIXI from 'pixi.js';

interface Point {
    x: number;
    y: number;
}

export class Enemy {
    private readonly sprite: PIXI.Sprite;
    private speed = 1.5;
    private readonly path: Point[];
    private currentIndex = 0;
    private hp = 4;
    private isDead = false;
    private isBoss:boolean = false;
    private onDeathCallback?: (escaped: boolean) => void;

    constructor(app: PIXI.Application, path: Point[], tileSize: number, isBoss = false) {
        this.path = path;
        this.isBoss = isBoss;

        const texture = isBoss
            ? PIXI.Texture.from('assets/boss.png')
            : PIXI.Texture.from('assets/enemy.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.width = tileSize;
        this.sprite.height = tileSize;

        this.sprite.x = path[0].x * tileSize + tileSize / 2;
        this.sprite.y = path[0].y * tileSize + tileSize / 2;

        if (isBoss) {
            this.hp = 20;
            this.speed = 0.8;
        }

        app.stage.addChild(this.sprite);
    }
    getX() {
        return this.isDead ? -99999 : this.sprite.x;
    }

    getY() {
        return this.isDead ? -99999 : this.sprite.y;
    }
    setHp(hp: number) {
        this.hp = hp;
    }
    hit(damage: number) {
        this.hp -= damage;

        // if (this.isBoss) {
        //     console.log(`💥 BOSS hit! Remaining HP: ${this.hp}`);
        // } else {
        //     console.log(`🧟 Enemy hit! Remaining HP: ${this.hp}`);
        // }
        if (this.hp <= 0) {
            this.destroy();
            if (this.onDeathCallback) this.onDeathCallback(false); // убит
        }
    }

    destroy() {
        if (this.isDead) return;
        this.isDead = true;
        this.sprite.destroy();
    }

    isAlive(): boolean {
        return !this.isDead;
    }

    update(delta: number) {
        if (this.isDead) return;
        if (this.currentIndex >= this.path.length - 1) {
            if (!this.isDead) {
                this.destroy();
                if (this.onDeathCallback) this.onDeathCallback(true);
            }
            return;
        }


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
        if (this.isBoss) {
            this.sprite.alpha = 0.7 + 0.3 * Math.sin(Date.now() / 200);
        }
        const vx = (dx / dist) * this.speed * delta;
        const vy = (dy / dist) * this.speed * delta;
        this.sprite.rotation = Math.atan2(vy, vx);
        this.sprite.x += vx;
        this.sprite.y += vy;
    }

    setOnDeath(cb: (escaped: boolean) => void) {
        this.onDeathCallback = cb;
    }
}
