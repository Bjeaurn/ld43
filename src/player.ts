import { ImageAsset, Gine, KEYCODES } from 'gine'

export class Player {
  x: number
  y: number
  lastPos: { x: number; y: number } = { x: 0, y: 0 }
  image: ImageAsset
  moveSpeed: number = 20
  canMove: boolean[] = [true, true, true, true]

  constructor() {
    this.x = 0
    this.y = 0
    this.setLastPosition()
    this.image = Gine.store.get('player') as ImageAsset
  }

  private setLastPosition() {
    this.lastPos = { x: this.x, y: this.y }
  }

  resetLastPosition() {
    this.x = this.lastPos.x
    this.y = this.lastPos.y
  }

  updateTick(delta: number, isCollided: boolean = false) {
    if (!isCollided) {
      this.setLastPosition()
    } else {
      this.resetLastPosition()
    }
    if (Gine.keyboard.isPressed(KEYCODES.A)) {
      this.x -= this.moveSpeed * delta
    }
    if (Gine.keyboard.isPressed(KEYCODES.D)) {
      this.x += this.moveSpeed * delta
    }
    if (Gine.keyboard.isPressed(KEYCODES.S)) {
      this.y += this.moveSpeed * delta
    }
    if (Gine.keyboard.isPressed(KEYCODES.W)) {
      this.y -= this.moveSpeed * delta
    }
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
