import * as PIXI from 'pixi.js';
import { Game } from './core/Game';

const app = new PIXI.Application({
    width: 960,
    height: 640,
    backgroundColor: 0x1e1e1e,
});

document.body.appendChild(app.view as HTMLCanvasElement);

const game = new Game(app);
app.ticker.add((delta) => game.update(delta));
