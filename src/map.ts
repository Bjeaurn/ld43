import { Gine, ImageAsset, SpriteAsset, Asset } from 'gine'
import { Util } from './util'

export class MapManager {
  tiles: { x: number; y: number } = { x: 0, y: 0 }
  assets: ImageAsset[] = []
  map: number[] = []

  constructor() {
    this.tiles.x = Math.ceil(Gine.CONFIG.width / Gine.CONFIG.tileSize)
    this.tiles.y = Math.ceil(Gine.CONFIG.height / Gine.CONFIG.tileSize)
    this.assets.push(Gine.store.get('dead-grass'))
    this.assets.push(Gine.store.get('dirt'))
    this.assets.push(Gine.store.get('tree'))
    this.assets.push(Gine.store.get('fence'))
    this.assets.push(Gine.store.get('internal-sprite'))
  }

  isColliding(x: number, y: number, width: number, height: number): number[] {
    // What tile are we on?
    const tileX = Math.round(x / Gine.CONFIG.tileSize)
    const tileY = Math.round(y / Gine.CONFIG.tileSize)

    // Which tiles are close to us?
    const indexArr: number[] = [
      this.xyToIndex(tileX, tileY, this.tiles.x)
      //   this.xyToIndex(tileX, tileY - 1, this.tiles.x),
      //   this.xyToIndex(tileX + 1, tileY, this.tiles.x),
      //   this.xyToIndex(tileX, tileY + 1, this.tiles.x),
      //   this.xyToIndex(tileX - 1, tileY, this.tiles.x)
    ]

    // Detect collision for these tiles?
    const tiles: number[] = indexArr.map(i => this.map[i])
    return tiles
    // return Util.collision()
  }

  loadMap(obj: number[]) {
    this.map = obj
  }

  xyToIndex(x: number, y: number, width: number): number {
    return x + width * y
  }

  draw() {
    for (var y = 0; y < this.tiles.y; y++) {
      for (var x = 0; x < this.tiles.x; x++) {
        const index = this.xyToIndex(x, y, this.tiles.x)
        const tile = this.assets[this.map[index] ? this.map[index] : 0] as
          | ImageAsset
          | SpriteAsset
        if (tile.type === Asset.SPRITE) {
          Gine.handle.drawSprite(
            tile as SpriteAsset,
            x * Gine.CONFIG.tileSize,
            y * Gine.CONFIG.tileSize,
            0
          )
        } else {
          Gine.handle.draw(
            tile,
            x * Gine.CONFIG.tileSize,
            y * Gine.CONFIG.tileSize
          )
        }
      }
    }
  }
}
