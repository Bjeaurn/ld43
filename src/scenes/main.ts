import { Scene, ImageAsset, Gine, KEYCODES, Tile } from 'gine'
import { Player } from '../player'
import { MapManager } from '../map'
import { Util } from '../util'
import { Guard } from '../guard'

export class MainScene extends Scene {
  player: Player
  guards: Guard[] = []
  map: MapManager
  tiles: { x: number; y: number }

  constructor() {
    super()
    this.player = Gine.store.get('player')
    this.map = Gine.store.get('level')
    this.tiles = {
      x: Math.ceil(Gine.CONFIG.width / Gine.CONFIG.tileSize),
      y: Math.ceil(Gine.CONFIG.height / Gine.CONFIG.tileSize)
    }
  }

  init() {
    this.player.x = 200
    this.player.y = 200
    this.guards.push(new Guard(80, 24))
    const arr = new Array(this.tiles.x * this.tiles.y)
    arr[5 + this.tiles.x * 6] = 2
    for (var i = 0; i < this.tiles.x; i++) {
      arr[i + this.tiles.x * 2] = 3
    }
    this.map.loadMap(arr)
  }

  tick(delta: number) {
    const collision: number[] = this.map.isColliding(
      this.player.x,
      this.player.y,
      this.player.image.width,
      this.player.image.height
    )
    if (collision[0]) {
      this.player.updateTick(delta, true)
    } else {
      this.player.updateTick(delta, false)
    }
  }

  frame() {
    this.map.draw()
    this.guards.forEach(g => Gine.handle.draw(g.image, g.x, g.y))
    Gine.handle.draw(this.player.image, this.player.x, this.player.y)
  }
}
