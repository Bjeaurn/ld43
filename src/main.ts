import { Gine, Config, GineAsset, DEFAULT_CONFIG } from 'gine'

import { LoadingScene } from './scenes/loading'
const cfg: Config = new Config(
  <HTMLCanvasElement>document.querySelector('#game'),
  Object.assign(DEFAULT_CONFIG, { width: 600, height: 400 })
)

const game = new Gine(cfg)

const assets: any[] = [{ name: 'logo', src: 'logo.png' }]
assets.forEach(d => {
  Gine.store.image(d.name, d.src)
})

const loadingScene = new LoadingScene()

game.changeScene(loadingScene)
game.start()

Gine.events.events.subscribe(ev => console.log(ev))
