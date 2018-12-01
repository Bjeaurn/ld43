import { Gine, Config, Scene, DEFAULT_CONFIG, IConfigArguments } from 'gine'
import { MainScene } from './scenes/main'
import { filter } from 'rxjs/operators'
import { Player } from './player'
import { MapManager } from './map'

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
  { name: 'dead-grass', src: 'dead-grass.png' },
  { name: 'dirt', src: 'dirt.png' },
  { name: 'tree', src: 'tree.png' },
  { name: 'fence', src: 'fence.png' },
  { name: 'guard', src: 'guard-gun.png' },
  { name: 'player-dead', src: 'player-dead.png' },
  { name: 'guard-aiming', src: 'guard-gun-aiming.png' }
]

assets.forEach(d => {
  Gine.store.image(d.name, d.src)
})

Gine.store.store('level', new MapManager())
Gine.store.store('player', new Player())

Gine.keyboard.key$.subscribe()
Gine.mouse.mouse$.subscribe()

const mainScene = new MainScene()
game.changeScene(mainScene)
game.start()

Gine.events
  .pipe(filter(ev => ev === Scene.DESTROY_CURRENT_SCENE))
  .subscribe(ev => {
    game.changeScene(mainScene)
  })

Gine.events.subscribe(ev => console.log(ev))
