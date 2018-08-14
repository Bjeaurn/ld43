import { Gine, Config, SCENE_EMPTY, GineAsset } from "gine";

import { LoadingScene } from "./scenes/loading";
const cfg: Config = {
  canvas: <HTMLCanvasElement>document.querySelector("#game"),
  height: 400,
  maxFps: 60,
  tickRate: 110,
  tileSize: 16,
  usesTiles: true,
  width: 600
};
const game = new Gine(cfg);

const assets: any[] = [{ name: "coin", src: "coin.png" }];

const loadingScene = LoadingScene;
loadingScene.parse(assets);
console.log(loadingScene);
console.log(Gine.store);

game.changeScene(loadingScene);
game.start();
