import { Gine, ImageAsset, SpriteAsset, Asset } from 'gine'
import { Util } from './util'

export class MapManager {
  tiles: { x: number; y: number } = { x: 0, y: 0 }
  assets: SpriteAsset[] = []
  map: number[] = []
  collisionMap: boolean[] = []
  activeAsset: SpriteAsset | null = null
  mapSettings?: { default?: number }
  defaultTile: number = -1
  constructor() {
    this.tiles.x = Math.ceil(Gine.CONFIG.width / Gine.CONFIG.tileSize)
    this.tiles.y = Math.ceil(Gine.CONFIG.height / Gine.CONFIG.tileSize)
    this.assets.push(Gine.store.get('map-sprite'))
  }

  isColliding(x: number, y: number, width: number, height: number): boolean[] {
    // What tile are we on?
    const tileX = Math.floor(x / Gine.CONFIG.tileSize)
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
    const tiles: boolean[] = indexArr.map(i => {
      const tile = this.map[i] || this.defaultTile
      const collision = (this.collisionMap[tile] !== undefined) ? this.collisionMap[tile] : true
      return collision
    })
    return tiles
    // return Util.collision()
  }

  loadMap(obj: number[], assetIndex: number, collisionMap: boolean[], settings?: any) {
    this.collisionMap = collisionMap
    this.map = obj
    this.activeAsset = this.assets[assetIndex] as SpriteAsset
    if(settings) {
      this.mapSettings = settings
      if(this.mapSettings && this.mapSettings.default !== undefined) {
        this.defaultTile = this.mapSettings.default
      } else {
        this.defaultTile = -1
      }
    }
  }

  xyToTile(x: number, y: number): number {
    const tX = Math.floor(x / Gine.CONFIG.tileSize)
    const tY = Math.floor(y / Gine.CONFIG.tileSize)
    return this.map[this.xyToIndex(tX, tY, this.tiles.x)]
  }

  xyToIndex(x: number, y: number, width: number): number {
    return x + width * y
  }

  draw() {
    for (var y = 0; y < this.tiles.y; y++) {
      for (var x = 0; x < this.tiles.x; x++) {
        const index = this.xyToIndex(x, y, this.tiles.x)
        const tile = this.map[index] ? this.map[index] : this.defaultTile
        if (tile === undefined) {
          continue
        }
        if (this.activeAsset) {
          Gine.handle.drawSprite(
            this.activeAsset,
            x * Gine.CONFIG.tileSize,
            y * Gine.CONFIG.tileSize,
            tile
          )
      }
    }
  }
}
