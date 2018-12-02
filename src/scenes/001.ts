import { Scene, ImageAsset, Gine, KEYCODES, Tile, Font } from 'gine'
import { Player } from '../player'
import { MapManager } from '../map'
import { Util } from '../util'
import { Guard } from '../guard'
import { MOVE, HOLD } from '../task'
import { Dialog } from '../dialog'
import { Prisoner } from '../prisoner'
import { LOAD_CREDITS } from './credits'

export const LOAD_001 = 'LOAD_001'

export class Scene001 extends Scene {
  player: Player
  guards: Guard[] = []
  prisoners: Prisoner[] = []
  map: MapManager
  tiles: { x: number; y: number }
  seconds: number = 0
  dialogOn: boolean = false
  hasEaten: number = -1
  sharedSecret: number = 0
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
    // if (this.seconds > 1 && !this.dialogOn) {
    //   this.dialogOn = true
    //   new Dialog(
    //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n Nulla sagittis sagittis nisl, eu tincidunt urna convallis nec.\n Aenean fermentum justo nisi, id vestibulum nunc bibendum eum.\n Nulla dignissim feugiat dui vitae fermentum.\n Morbi blandit est nec massa maximus, dignissim ',
    //     true,
    //     10
    //   )
    // }
    this.guards.forEach(g => {
      g.prisonersToLookFor = this.prisoners.filter((p: Prisoner) => {
        return p.alive && g.isInVicinity(p.x, p.y, g.visionRange)
      })
    })
    if (this.seconds === 1) {
      new Dialog("Don't get any closer!\nI will shoot you!", false, 3)
    }
    if (this.hasEaten > -1) {
      if (this.hasEaten > 0) {
        this.hasEaten--
      }
      if (this.hasEaten === 1) {
        this.prisoners[4].jobs = [{ task: HOLD, direction: 0, time: 60 }]
        this.prisoners[4].currentTask = { task: MOVE, x: 490, y: 360 }
        new Dialog('Hey you there,\nmeet me behind one of the tents', true)
      }
      if (
        this.sharedSecret === 0 &&
        this.prisoners[4].isInVicinity(490, 360, 20) &&
        this.prisoners[4].isInVicinity(this.player.x, this.player.y, 20)
      ) {
        new Dialog(
          'You seem to be fit enough to get out of here\nTake this steelcutter and get out of here!\nThere is a weakness in the fence up north',
          true
        )
        this.sharedSecret = 1
        this.prisoners[4].jobs = [{ task: 'LOITER' }, { task: HOLD, time: 3 }]
        this.prisoners[4].currentTask = { task: MOVE, x: 490, y: 260 }
        this.map.map[14 + this.tiles.x * 2] = 11
        this.map.map[0] = 12
        this.map.map[0 + this.tiles.x * 1] = 12
        this.guards[0].jobs.push(
          { task: MOVE, x: 540, y: 24 },
          { task: HOLD, time: 1, direction: 90 }
        )
      }
      if (this.sharedSecret === 1) {
        if (Util.inVicinity(this.player, 32, 32, 24)) {
          this.destroy()
        }
      }
    }
  }

  init() {
    this.player.setPosition(332, 316)
    this.guards.push(
      new Guard(80, 24, 180, [
        { task: HOLD, time: 1.5, direction: 180 },
        { task: MOVE, x: 400, y: 24 },
        { task: HOLD, time: 5, direction: 180 },
        { task: MOVE, x: 80, y: 24 },
        { task: HOLD, time: 3.5, direction: 180 }
      ]),
      new Guard(16, 112, 90, [
        { task: HOLD, time: 4, direction: 90 },
        { task: MOVE, x: 16, y: 312 },
        { task: HOLD, time: 6, direction: 90 },
        { task: MOVE, x: 16, y: 112 }
      ])
    )

    this.prisoners.push(
      new Prisoner(1, 400, 200, 0, [
        { task: 'LOITER' },
        { task: HOLD, time: Math.random() * 5 }
      ]),
      new Prisoner(2, 180, 180, 0, [
        // This one is doing something
        { task: HOLD, time: 1 },
        { task: MOVE, x: 180, y: 0 }
      ]),
      new Prisoner(3, 260, 220, 0, [
        { task: 'LOITER' },
        { task: HOLD, time: Math.random() * 5 }
      ]),
      new Prisoner(1, 300, 340, 0, [
        { task: 'LOITER' },
        { task: HOLD, time: Math.random() * 5 }
      ]),
      new Prisoner(2, 480, 240, 0, [
        { task: 'LOITER' },
        { task: HOLD, time: Math.random() * 5 }
      ]),
      new Prisoner(3, 430, 160, 0, [
        { task: 'LOITER' },
        { task: HOLD, time: Math.random() * 5 }
      ]),
      new Prisoner(1, 200, 280, 0, [
        { task: 'LOITER' },
        { task: HOLD, time: Math.random() * 5 }
      ]),
      new Prisoner(2, 230, 280, 0, [
        { task: 'LOITER' },
        { task: HOLD, time: Math.random() * 5 }
      ]),
      new Prisoner(3, 260, 280, 0, [
        { task: 'LOITER' },
        { task: HOLD, time: Math.random() * 5 }
      ])
    )
    const arr = new Array(this.tiles.x * this.tiles.y)
    for (var i = 0; i < this.tiles.x; i++) {
      arr[i + this.tiles.x * 2] = 3
    }
    for (var j = 3; j < 13; j++) {
      arr[2 + this.tiles.x * j] = 9
    }
    arr[7 + this.tiles.x * 10] = 4
    arr[10 + this.tiles.x * 10] = 4
    arr[13 + this.tiles.x * 10] = 4
    arr[15 + this.tiles.x * 6] = 10
    this.map.loadMap(arr, 0, Gine.store.get('map-sprite-collision'), {
      default: 0
    })
  }

  tick(delta: number) {
    const collision: boolean[] = this.map.isColliding(
      this.player.x - this.player.image.width / 2,
      this.player.y - this.player.image.height / 2,
      this.player.image.width,
      this.player.image.height
    )
    this.player.updateTick(delta, collision[0])

    this.guards.forEach(g => {
      g.update(delta)
      g.checkCollision(this.map)
    })
    this.prisoners.forEach(p => {
      p.checkCollision(this.map)
      p.update(delta)
    })
    Dialog.handleUpdate(delta)
  }

  frame() {
    if (this.map.xyToTile(this.player.x, this.player.y) === 10) {
      if (this.hasEaten === -1) {
        this.hasEaten = 10
        this.player.moveSpeed += 10
        new Dialog(
          'You have received your morning rations of food.\n\n(Your speed has increased)',
          true
        )
      }
    }
    this.map.draw()
    this.prisoners.forEach(p => Util.rotate(p.image, p.x, p.y, p.direction))
    this.guards.forEach(g => Util.rotate(g.image, g.x, g.y, g.direction))
    this.player.draw()
    Dialog.handleDraw()
    // Gine.handle.draw(this.player.image, this.player.x, this.player.y)
  }

  destroy() {
    Gine.sendEvent(LOAD_CREDITS)
  }
}
