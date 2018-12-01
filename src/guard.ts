import { NPC } from './npc'
import { ImageAsset, Gine } from 'gine'

export class Guard extends NPC {
  readonly image: ImageAsset
  constructor(x: number, y: number) {
    super(x, y)
    this.image = Gine.store.get('guard')
  }

  update() {}
}
