import { Scene, Gine } from 'gine'
import { Player } from '../player'
import { MapManager } from '../map'
import { Dialog } from '../dialog'
import { LOAD_001 } from './001'

export const LOAD_000 = 'LOAD_000'

export class Scene000 extends Scene {
  player: Player
  map: MapManager
  tiles: { x: number; y: number }
  seenDialog: boolean = false
  secondsWaited: number = 0
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
      "What's that noise outside?\nI better check it out!\n(Press ENTER to dismiss dialog)",
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

  second() {
    if (this.player.controlsEnabled) {
      this.secondsWaited++
      if (
        this.secondsWaited === 3 &&
        this.player.x === 6 * Gine.CONFIG.tileSize + 16 &&
        this.player.y === 4 * Gine.CONFIG.tileSize + 8
      ) {
        new Dialog('(Use WSAD to move)', true)
      }
    }
    const currentTile = this.map.xyToTile(this.player.x, this.player.y)
    if (currentTile === 8) {
      if (Dialog.primaryDialog() === false && this.seenDialog === true) {
        this.destroy()
      } else {
        this.player.controlsEnabled = false
        new Dialog('Something is happening', true)
        this.seenDialog = true
      }
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

  destroy() {
    Gine.sendEvent(LOAD_001)
  }
}
