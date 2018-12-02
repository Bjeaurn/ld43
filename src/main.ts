import {
  Gine,
  Config,
  Scene,
  DEFAULT_CONFIG,
  IConfigArguments,
  SpriteOptions
} from 'gine'
import { Scene001 } from './scenes/001'
import { filter } from 'rxjs/operators'
import { Player } from './player'
import { MapManager } from './map'
import { Scene000 } from './scenes/000'

const cfg: Config = new Config(
  <HTMLCanvasElement>document.querySelector('#game'),
  Object.assign(DEFAULT_CONFIG, {
    width: 600,
    height: 400,
    tickRate: 120,
    maxFps: 60,
    tileSize: 32
  } as IConfigArguments)
)

const game = new Gine(cfg)

const assets: any[] = [
  { name: 'player', src: 'player.png' },
  { name: 'player-dead', src: 'player-dead.png' },
  { name: 'guard-aiming', src: 'guard-gun-aiming.png' },
  { name: 'dialog-left', src: 'dialog-left.png' },
  { name: 'dialog-main', src: 'dialog-main.png' },
  { name: 'dialog-right', src: 'dialog-right.png' },
  { name: 'guard-fire', src: 'guard-gun-fire.png' }
]

assets.forEach(d => {
  Gine.store.image(d.name, d.src)
})

Gine.store.sprite('enter-button', 'button-sprite.png', {
  widthPerImage: 32,
  heightPerImage: 32,
  imagesPerRow: 2,
  numberOfFrames: 2,
  ticksPerFrame: 48
})

Gine.store.sprite('map-sprite', 'map-sprite.png', {
  widthPerImage: 32,
  heightPerImage: 32,
  imagesPerRow: 5,
  numberOfFrames: 10
})

Gine.store.store('level', new MapManager())
Gine.store.store('player', new Player())

Gine.keyboard.key$.subscribe()
// Gine.mouse.mouse$.subscribe()

const mainScene = new Scene000()
// const mainScene = new Scene001()
game.changeScene(mainScene)
game.start()

Gine.events
  .pipe(filter(ev => ev === Scene.DESTROY_CURRENT_SCENE))
  .subscribe(ev => {
    game.changeScene(mainScene)
  })

Gine.events.subscribe(ev => console.log(ev))
