import * as PIXI from 'pixi.js';

interface Point {
    x: number;
    y: number;
}

export class Grid {
    private readonly cols = 15;
    private readonly rows = 10;
    private readonly tileSize = 64;
    private app: PIXI.Application;

    private grassTexture: PIXI.Texture;
    private roadTexture: PIXI.Texture;
    // @ts-ignore
    private buildTexture: PIXI.Texture;

    public onBuildRequest?: (x: number, y: number) => boolean;

    private readonly path: Point[] = [
        { x: 0, y: 5 },
        { x: 1, y: 5 },
        { x: 2, y: 5 },
        { x: 3, y: 5 },
        { x: 4, y: 5 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
        { x: 4, y: 2 },
        { x: 4, y: 1 },
        { x: 5, y: 1 },
        { x: 6, y: 1 },
        { x: 7, y: 1 },
        { x: 8, y: 1 },
        { x: 8, y: 2 },
        { x: 8, y: 3 },
        { x: 8, y: 4 },
        { x: 8, y: 5 },
        { x: 8, y: 6 },
        { x: 8, y: 7 },
        { x: 9, y: 7 },
        { x: 10, y: 7 },
        { x: 11, y: 7 },
        { x: 12, y: 7 },
        { x: 13, y: 7 },
        { x: 14, y: 7 },
        { x: 14, y: 8 },
        { x: 14, y: 9 },
    ];

    private readonly buildableSpots: Point[] = [
        { x: 2, y: 4 },
        { x: 3, y: 3 },
        { x: 5, y: 2 },
        { x: 6, y: 4 },
        { x: 9, y: 3 },
        { x: 10, y: 6 },
        { x: 11, y: 5 },
        { x: 12, y: 8 },
    ];

    constructor(app: PIXI.Application) {
        this.app = app;

        this.grassTexture = PIXI.Texture.from('assets/grass.png');
        this.roadTexture = PIXI.Texture.from('assets/dirt.png');
        this.buildTexture = PIXI.Texture.from('assets/tower.png');

        this.drawGrid();
    }

    getPath(): Point[] {
        return this.path;
    }

    private drawGrid(): void {
        const builtMap = new Set<string>(); // за да пазим дали вече е построено на това поле

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const isPath = this.path.some(p => p.x === x && p.y === y);
                const isBuildable = this.buildableSpots.some(s => s.x === x && s.y === y);

                let sprite: PIXI.Sprite;
                if (isPath) {
                    sprite = new PIXI.Sprite(this.roadTexture);
                } else if (isBuildable) {

                    const gfx = new PIXI.Graphics();
                    gfx.beginFill(0x000000);
                    gfx.drawRect(0, 0, this.tileSize, this.tileSize);
                    gfx.endFill();
                    gfx.x = x * this.tileSize;
                    gfx.y = y * this.tileSize;

                    gfx.eventMode = 'static';
                    gfx.cursor = 'pointer';

                    gfx.on('pointerdown', () => {
                        const key = `${x},${y}`;
                        if (builtMap.has(key)) return;

                        if (this.onBuildRequest && this.onBuildRequest(x, y)) {
                            builtMap.add(key);
                            const tower = PIXI.Sprite.from('assets/tower.png');
                            tower.width = this.tileSize;
                            tower.height = this.tileSize;
                            tower.x = x * this.tileSize;
                            tower.y = y * this.tileSize;
                            this.app.stage.addChild(tower);
                        }
                    });


                    this.app.stage.addChild(gfx);
                    continue;
                } else {
                    sprite = new PIXI.Sprite(this.grassTexture);
                }

                sprite.width = this.tileSize;
                sprite.height = this.tileSize;
                sprite.x = x * this.tileSize;
                sprite.y = y * this.tileSize;
                this.app.stage.addChild(sprite);
            }
        }
    }


}
