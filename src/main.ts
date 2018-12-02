import {
  Gine,
  Config,
  Scene,
  DEFAULT_CONFIG,
  IConfigArguments,
  SpriteOptions
} from 'gine'
import { Scene001, LOAD_001 } from './scenes/001'
import { filter } from 'rxjs/operators'
import { Player } from './player'
import { MapManager } from './map'
import { Scene000, LOAD_000 } from './scenes/000'

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
  { name: 'guard', src: 'guard-gun.png' },
  { name: 'guard-aiming', src: 'guard-gun-aiming.png' },
  { name: 'dialog-left', src: 'dialog-left.png' },
  { name: 'dialog-main', src: 'dialog-main.png' },
  { name: 'dialog-right', src: 'dialog-right.png' },
  { name: 'guard-fire', src: 'guard-gun-fire.png' },
  { name: 'prisoner-1', src: 'prisoner-1.png' },
  { name: 'prisoner-2', src: 'prisoner-2.png' },
  { name: 'prisoner-3', src: 'prisoner-3.png' }
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

const Scene_000 = new Scene000()
const Scene_001 = new Scene001()

game.changeScene(Scene_000)
game.start()

const eventList: { [key: string]: any } = {
  LOAD_000: Scene_000,
  LOAD_001: Scene_001
}

Gine.events
  .pipe(filter(ev => ev === Scene.DESTROY_CURRENT_SCENE))
  .subscribe(ev => {})

// FIXME Put this in the engine in a proper way?
Gine.events.subscribe(ev => {
  if (eventList[ev]) {
    game.changeScene(eventList[ev])
  } else {
    console.warn(`${ev} has not been found in eventList`)
  }
})
