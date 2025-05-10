import * as PIXI from 'pixi.js';
import { Enemy } from './Enemy';
import { Projectile } from "./Projectiles.ts";

export class Tower {
    private readonly sprite: PIXI.Graphics;
    private fireCooldown = 25;
    private timer = 0;
    private range = 130;
    private x: number;
    private y: number;
    private projectiles: Projectile[] = [];
    private app: PIXI.Application;
    private getEnemies: () => Enemy[];
    private level = 1;
    private onClick?: () => void;
    private text: PIXI.Text;

    constructor(
        app: PIXI.Application,
        x: number,
        y: number,
        getEnemies: () => Enemy[]
    ) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.getEnemies = getEnemies;

        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0x00ccff);
        this.sprite.drawCircle(32, 32, 20);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;
        this.text = new PIXI.Text('', {
            fontSize: 16,
            fill: 0xffcc00,
            fontWeight: 'bold',
        });
        this.text.anchor.set(0.5);
        this.text.x = this.x + 30;
        this.text.y = this.y - 10;
        this.app.stage.addChild(this.text);
        this.timer = this.fireCooldown;
        app.stage.addChild(this.sprite);
    }
    upgradeFireRate(): boolean {
        if (this.level >= 5) {
            this.text.text = 'Max Level!';
            console.log('🚫 Tower is already at max level.');
            return false;
        }

        if (this.fireCooldown > 5) {
            this.fireCooldown -= 5;
        }

        this.level += 1;

        if (this.level === 5) {
            this.text.text = 'Max Level!';
        } else {
            this.text.text = '';
        }

        console.log(`⬆️ Tower upgraded! Level: ${this.level}, cooldown: ${this.fireCooldown}`);
        return true;
    }
    update(delta: number) {
        this.timer += delta;

        if (this.timer >= this.fireCooldown) {
            const enemies = this.getEnemies();
            const target = enemies.find((enemy) => {
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
    setOnClick(callback: () => void) {
        this.onClick = callback;
        this.sprite.eventMode = 'static';
        this.sprite.cursor = 'pointer';
        this.sprite.on('pointerdown', () => {
            if (this.onClick) this.onClick();
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
        projectile.update(1);
        this.projectiles.push(projectile);
    }
}
