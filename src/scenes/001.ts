import { Scene, ImageAsset, Gine, KEYCODES, Tile, Font } from 'gine'
import { Player } from '../player'
import { MapManager } from '../map'
import { Util } from '../util'
import { Guard } from '../guard'
import { MOVE, HOLD } from '../task'
import { Dialog } from '../dialog'

export const LOAD_001 = 'LOAD_001'

export class Scene001 extends Scene {
  player: Player
  guards: Guard[] = []
  map: MapManager
  tiles: { x: number; y: number }
  seconds: number = 0
  dialogOn: boolean = false
  constructor() {
    super()
    this.player = Gine.store.get('player')
    this.map = Gine.store.get('level')
    this.tiles = {
      x: Math.ceil(Gine.CONFIG.width / Gine.CONFIG.tileSize),
      y: Math.ceil(Gine.CONFIG.height / Gine.CONFIG.tileSize)
    }
  }

  second() {
    this.seconds++
    if (this.seconds > 1 && !this.dialogOn) {
      this.dialogOn = true
      new Dialog(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n Nulla sagittis sagittis nisl, eu tincidunt urna convallis nec.\n Aenean fermentum justo nisi, id vestibulum nunc bibendum eum.\n Nulla dignissim feugiat dui vitae fermentum.\n Morbi blandit est nec massa maximus, dignissim ',
        true,
        10
      )
    }
  }

  init() {
    console.log(this.player)
    this.player.setPosition(300, 300)
    this.guards.push(
      new Guard(80, 24, 180, [
        { task: MOVE, x: 400, y: 24 },
        { task: HOLD, time: 5, direction: 180 },
        { task: MOVE, x: 80, y: 24 },
        { task: HOLD, time: 5, direction: 180 }
      ]),
      new Guard(16, 112, 90, [
        { task: HOLD, time: 4, direction: 90 },
        { task: MOVE, x: 16, y: 312 },
        { task: HOLD, time: 6, direction: 90 },
        { task: MOVE, x: 16, y: 112 }
      ])
    )
    const arr = new Array(this.tiles.x * this.tiles.y)
    arr[5 + this.tiles.x * 6] = 2
    for (var i = 0; i < this.tiles.x; i++) {
      arr[i + this.tiles.x * 2] = 3
    }
    arr[9 + this.tiles.x * 9] = 4
    this.map.loadMap(
      arr,
      0,
      [false, true, false, true, true, false, true, false, false],
      {
        default: 0
      }
    )
  }

  tick(delta: number) {
    const collision: boolean[] = this.map.isColliding(
      this.player.x - this.player.image.width / 2,
      this.player.y - this.player.image.height / 2,
      this.player.image.width,
      this.player.image.height
    )
    this.player.updateTick(delta, collision[0])

    this.guards.forEach(g => g.update(delta))
    Dialog.handleUpdate(delta)
  }

  frame() {
    this.map.draw()
    this.guards.forEach(g => Util.rotate(g.image, g.x, g.y, g.direction))
    this.player.draw()
    Dialog.handleDraw()
    // Gine.handle.draw(this.player.image, this.player.x, this.player.y)
  }
}
