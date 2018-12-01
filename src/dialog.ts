import { Gine, ImageAsset, Font } from 'gine'

export class Dialog {
  static dialogs: Dialog[] = []
  static id: number = 0
  static add(dialog: Dialog): number {
    Dialog.dialogs.push(dialog)
    Dialog.id++
    return Dialog.id
  }

  static get(): Dialog | null {
    if (Dialog.dialogs[0]) {
      return Dialog.dialogs[0]
    }
    return null
  }

  static primaryDialog(): Dialog | false {
    if (Dialog.dialogs.length > 0) {
      return Dialog.dialogs[0]
    } else {
      return false
    }
  }

  static handleUpdate(delta: number): void {
    const dialog = Dialog.primaryDialog()
    if (dialog) {
      dialog.update(delta)
    }
  }

  static handleDraw(): void {
    const dialog = Dialog.primaryDialog()
    if (dialog) {
      dialog.draw()
    }
  }

  private timer: number = 0
  private images: ImageAsset[] = []

  private readonly id: number
  private x: number
  private y: number
  private width: number
  public active: boolean
  constructor(
    readonly message: string,
    readonly acknowledgement: boolean = true,
    readonly duration?: number
  ) {
    this.x = Gine.CONFIG.width / 2
    this.y = Gine.CONFIG.height - 140
    this.images.push(Gine.store.get('dialog-left'))
    this.images.push(Gine.store.get('dialog-main'))
    this.images.push(Gine.store.get('dialog-right'))
    this.active = false
    this.id = Dialog.add(this)
    this.width = Gine.handle.handle.measureText(this.message).width
  }

  draw() {
    Gine.handle.draw(this.images[0], this.x - this.width - 10, this.y)

    Gine.handle.handle.drawImage(
      this.images[1].image,
      this.x - 82,
      this.y,
      this.width + 100,
      100
    )
    Gine.handle.draw(this.images[2], this.x + this.width + 10, this.y)
    Gine.handle.setColor(255, 255, 255, 1)
    Gine.handle.setFont(new Font('Helvetica'), 10)
    Gine.handle.text(this.message, this.x - this.width + 4, this.y + 28)
  }

  update(delta: number) {
    if (!this.acknowledgement) {
      this.timer += delta
      if (this.duration) {
        if (this.timer >= this.duration) {
          this.destroy()
        }
      }
    }
  }

  destroy() {
    Dialog.dialogs.splice(
      Dialog.dialogs.findIndex((d: Dialog) => {
        return d.id === this.id
      }),
      1
    )
  }
}
