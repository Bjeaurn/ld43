import { Scene, Gine } from 'gine'
import { Player } from '../player'
import { MapManager } from '../map'
import { Dialog } from '../dialog'

export class Scene000 extends Scene {
  player: Player
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
    new Dialog(
      'Hello there everybody!\n How are you doing today?\n Are you having a good time?',
      true
    )
    const arr = new Array(this.tiles.x * this.tiles.y)
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 6; j++) {
        arr[i + 6 + this.tiles.x * j] = 5
      }

      arr[8 + this.tiles.x * 0] = 8

      arr[6 + this.tiles.x * 1] = 6
      arr[6 + this.tiles.x * 3] = 6
      arr[6 + this.tiles.x * 5] = 6
      arr[10 + this.tiles.x * 1] = 6
      arr[10 + this.tiles.x * 3] = 6
      arr[10 + this.tiles.x * 5] = 6
      this.map.loadMap(arr, 0, [
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        false,
        false
      ])

      this.player.controlsEnabled = false
      this.player.setPosition(
        6 * Gine.CONFIG.tileSize + 16,
        4 * Gine.CONFIG.tileSize + 8
      )
    }
  }

  tick(delta: number) {
    const collision: boolean[] = this.map.isColliding(
      this.player.x - this.player.image.width / 2,
      this.player.y - this.player.image.height / 2,
      this.player.image.width,
      this.player.image.height
    )
    this.player.updateTick(delta, collision[0])

    if (!Dialog.handleUpdate(delta) && !this.player.controlsEnabled) {
      this.player.controlsEnabled = true
    }
  }

  frame() {
    this.map.draw({ default: -1 })
    this.player.draw()
    Dialog.handleDraw()
  }
}
