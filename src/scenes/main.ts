import { Scene, ImageAsset, Gine, KEYCODES, Tile } from 'gine'
import { Player } from '../player'
import { MapManager } from '../map'
import { Util } from '../util'
import { Guard } from '../guard'
import { MOVE, HOLD } from '../task'

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
    this.guards.push(
      new Guard(80, 24, 180, [
        { task: MOVE, x: 400, y: 24 },
        { task: HOLD, time: 5, direction: 180 },
        { task: MOVE, x: 80, y: 24 },
        { task: HOLD, time: 5, direction: 180}
      ])
    )
    const arr = new Array(this.tiles.x * this.tiles.y)
    arr[5 + this.tiles.x * 6] = 2
    for (var i = 0; i < this.tiles.x; i++) {
      arr[i + this.tiles.x * 2] = 3
    }
    this.map.loadMap(arr)
  }

  tick(delta: number) {
    const collision: number[] = this.map.isColliding(
      this.player.x - this.player.image.width / 2,
      this.player.y - this.player.image.height / 2,
      this.player.image.width,
      this.player.image.height
    )
    if (collision[0]) {
      this.player.updateTick(delta, true)
    } else {
      this.player.updateTick(delta, false)
    }
    this.guards.forEach(g => g.update(delta))
  }

  frame() {
    this.map.draw()
    this.guards.forEach(g => Util.rotate(g.image, g.x, g.y, g.direction))
    Util.rotate(
      this.player.image,
      this.player.x,
      this.player.y,
      this.player.direction
    )
    // Gine.handle.draw(this.player.image, this.player.x, this.player.y)
  }
}
