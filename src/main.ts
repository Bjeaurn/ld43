import { Gine, Config } from 'gine';

const config: Config = new Config(600, 400, document.getElementById('game') as HTMLCanvasElement);

const game = new Gine(config);
console.log(game);
game.start();