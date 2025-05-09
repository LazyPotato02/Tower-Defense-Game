import * as PIXI from 'pixi.js';

export class Grid {
    onBuildRequest: ((x: number, y: number) => void) | null = null;
    private buildableSpots = [
        { x: 2, y: 4 },
        { x: 3, y: 4 },
        { x: 7, y: 3 },
    ];

    private readonly cols = 15;
    private readonly rows = 10;
    private readonly tileSize = 64;

    private readonly path = [
        { x: 0, y: 5 },
        { x: 5, y: 5 },
        { x: 5, y: 9 },
        { x: 10, y: 9 },
    ];

    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.drawGrid();
        this.drawPath();
    }
    getPath() {
        return this.path;
    }
    private drawGrid() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const rect = new PIXI.Graphics();
                const isBuildable = this.buildableSpots.some(s => s.x === x && s.y === y);

                rect.lineStyle(1, 0x444444);
                rect.beginFill(isBuildable ? 0x0044ff : 0x2c2c2c);
                rect.drawRect(0, 0, this.tileSize, this.tileSize);
                rect.endFill();

                rect.eventMode = 'static';
                rect.cursor = 'pointer';
                rect.on('pointerdown', () => {
                    if (isBuildable && this.onBuildRequest) {
                        this.onBuildRequest(x, y);
                    }
                });

                rect.x = x * this.tileSize;
                rect.y = y * this.tileSize;
                this.app.stage.addChild(rect);
            }
        }
    }


    private drawPath() {
        for (const point of this.path) {
            const rect = new PIXI.Graphics();
            rect.beginFill(0xeeee22);
            rect.drawRect(0, 0, this.tileSize, this.tileSize);
            rect.endFill();
            rect.x = point.x * this.tileSize;
            rect.y = point.y * this.tileSize;
            this.app.stage.addChild(rect);
        }
    }
}
