import { Gine, ImageAsset, Font, KEYCODES, SpriteAsset } from 'gine'

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
  public actualMessage: string[] = []
  private enterButton: SpriteAsset | null = null
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
    this.actualMessage = this.message.split('\n')
    this.width = Gine.handle.handle.measureText(
      longestString(this.actualMessage)
    ).width
    if (this.x < 10) {
      this.x = 20
    }
    if (this.acknowledgement) {
      this.enterButton = Gine.store.get('enter-button')
    }
  }

  draw() {
    Gine.handle.handle.drawImage(
      this.images[1].image,
      this.x - this.width - 2,
      this.y,
      this.width + 16,
      100
    )

    Gine.handle.draw(this.images[0], this.x - this.width - 8, this.y)

    Gine.handle.draw(
      this.images[2],
      this.x - this.width + this.width + 8,
      this.y
    )

    Gine.handle.setColor(255, 255, 255, 1)
    const fontSize = 10
    Gine.handle.setFont(new Font('Lucida Console, Monaco, monospace', fontSize))
    this.actualMessage.forEach((m: string, index: number) => {
      Gine.handle.text(
        m,
        this.x - this.width + 4,
        this.y + 28 + index * fontSize + index * 4
      )
    })

    if (this.acknowledgement && this.enterButton) {
      Gine.handle.drawSprite(
        this.enterButton,
        this.x - this.width + this.width - 20,
        this.y + 60
      )
    }
  }

  update(delta: number) {
    if (!this.acknowledgement) {
      this.timer += delta
      if (this.duration) {
        if (this.timer >= this.duration) {
          this.destroy()
        }
      }
    } else if (this.acknowledgement && this.enterButton) {
      this.enterButton.update()
      if (Gine.keyboard.isPressed(KEYCODES.ENTER)) {
        this.destroy()
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

export function longestString(a: string[]): string {
  var c = 0,
    d = 0,
    l = 0,
    i = a.length
  if (i)
    while (i--) {
      d = a[i].length
      if (d > c) {
        l = i
        c = d
      }
    }
  return a[l]
}
