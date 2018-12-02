import { ImageAsset, Gine, KEYCODES, Font } from 'gine'
import { Util } from './util'

export class Player {
  x: number
  y: number
  alpha: number = 0
  direction: number = 0
  lastPos: { x: number; y: number } = { x: 0, y: 0 }
  image: ImageAsset
  moveSpeed: number = 20
  canMove: boolean[] = [true, true, true, true]
  controlsEnabled: boolean = true
  alive: boolean = true
  constructor() {
    this.x = 0
    this.y = 0
    this.setLastPosition()
    this.image = Gine.store.get('player')
  }

  private setLastPosition() {
    this.lastPos = { x: this.x, y: this.y }
  }

  hit() {
    this.alive = false
    this.image = Gine.store.get('player-dead')
  }

  checkDead() {
    if (!this.alive) {
      Gine.handle.setFont(new Font('Lucida Console, Monaco, monospace', 40))
      Gine.handle.setColor(255, 0, 0, this.alpha)
      Gine.handle.text(
        'YOU DIED',
        Gine.CONFIG.width / 2 - 80,
        Gine.CONFIG.height / 2
      )
    }
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    this.setLastPosition()
  }

  resetLastPosition() {
    this.x = this.lastPos.x
    this.y = this.lastPos.y
  }

  updateTick(delta: number, isCollided: boolean = false) {
    if (this.alive) {
      if (!isCollided) {
        this.setLastPosition()
      } else {
        this.resetLastPosition()
      }
      let direction = []
      if (this.controlsEnabled) {
        if (Gine.keyboard.isPressed(KEYCODES.A)) {
          this.x -= this.moveSpeed * delta
          direction.push(270)
        }
        if (Gine.keyboard.isPressed(KEYCODES.D)) {
          this.x += this.moveSpeed * delta
          direction.push(90)
        }
        if (Gine.keyboard.isPressed(KEYCODES.S)) {
          this.y += this.moveSpeed * delta
          direction.push(180)
        }
        if (Gine.keyboard.isPressed(KEYCODES.W)) {
          this.y -= this.moveSpeed * delta
          direction.push(360)
        }
      }
      if (direction.length > 0) {
        this.direction = direction.reduce((p, c) => p + c, 0) / direction.length
      }
    }
    if (!this.alive && this.alpha < 0.9) {
      this.alpha += delta
    }
  }

  draw() {
    Util.rotate(this.image, this.x, this.y, this.direction)
    this.checkDead()
  }

  setColliding(collision: number[]) {
    // North
    if (collision[1]) {
      this.canMove[0] = false
    } else {
      this.canMove[0] = true
    }

    // East
    if (collision[2]) {
      this.canMove[1] = false
    } else {
      this.canMove[1] = true
    }

    // South
    if (collision[3]) {
      this.canMove[2] = false
    } else {
      this.canMove[2] = true
    }

    // West
    if (collision[4]) {
      this.canMove[3] = false
    } else {
      this.canMove[3] = true
    }
  }
}
