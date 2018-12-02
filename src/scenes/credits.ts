import { Scene, Gine, Font } from 'gine'
import { Player } from '../player'

export const LOAD_CREDITS = 'LOAD_CREDITS'

export class SceneCredits extends Scene {
  player: Player
  winMessage: string = 'YOU ESCAPED'
  winMessageWidth: number
  alpha: number = 0.000001
  credits: string[] = [
    'Made by @Bjeaurn (Twitter/Twitch)',
    'Built with (my own built) Gine Typescript engine',
    "Didn't even get close to all the ideas I wanted.. :-(",
    'Thanks to all viewers and people supporting me during the streams!'
  ]
  constructor() {
    super()
    this.player = Gine.store.get('player')
    this.winMessageWidth = Math.round(
      Gine.handle.handle.measureText(this.winMessage).width
    )
  }

  second() {
    if (this.alpha < 0.9) {
      this.alpha += 0.05
    }
  }

  init() {
    this.player.setPosition(Gine.CONFIG.width - 32, Gine.CONFIG.height / 2 - 16)
  }

  tick(delta: number) {
    this.player.updateTick(delta)
  }

  frame() {
    Gine.handle.setFont(new Font('Lucida Console, Monaco, monospace', 40))
    Gine.handle.setColor(255, 255, 255, 0.6)
    Gine.handle.text(
      this.winMessage,
      Gine.CONFIG.width / 2 - this.winMessageWidth,
      Gine.CONFIG.height / 2 - 40
    )

    Gine.handle.setFont(new Font('Lucida Console, Monaco, monospace', 10))
    Gine.handle.setColor(255, 255, 255, this.alpha)
    this.credits.forEach((m: string, i: number) => {
      Gine.handle.text(
        m,
        Gine.CONFIG.width / 2 - 140,
        Gine.CONFIG.height / 2 + 20 * i
      )
    })

    this.player.draw()
  }
}
