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
      true,
      10
    )
    const arr = new Array(this.tiles.x * this.tiles.y)
    arr[6 + this.tiles.x * 0] = 1
    this.map.loadMap(arr)
  }

  frame() {
    this.map.draw()
    Dialog.handleDraw()
  }
}
