import { Gine, Config, SCENE_EMPTY, GineAsset, DEFAULT_CONFIG } from 'gine'

import { LoadingScene } from './scenes/loading'
const cfg: Config = new Config(
  <HTMLCanvasElement>document.querySelector('#game'),
  Object.assign(DEFAULT_CONFIG, { width: 600, height: 400 })
)

const game = new Gine(cfg)

const assets: any[] = [{ name: 'logo', src: 'logo.png' }]

const loadingScene = LoadingScene
loadingScene.parse(assets)

game.changeScene(loadingScene)
game.start()
