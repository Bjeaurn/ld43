import { ImageAsset, Gine } from 'gine'

// FIXME Promote to the engine.
export class Util {
  static rotate(
    image: ImageAsset,
    x: number,
    y: number,
    degrees: number = 0
  ): void {
    const radians = (degrees * Math.PI) / 180
    Gine.handle.handle.save()
    Gine.handle.handle.translate(x, y)
    Gine.handle.handle.rotate(radians)
    Gine.handle.handle.drawImage(
      image.image,
      0 - image.width / 2,
      0 - image.height / 2
    )
    Gine.handle.handle.restore()
  }

  static collision(source: CollisionObject, dest: CollisionObject): boolean {
    if (
      source.x < dest.x + dest.width &&
      source.x + source.width > dest.x &&
      source.y < dest.y + dest.height &&
      source.height + source.y > dest.y
    ) {
      return true
    }
    return false
  }

  static inVicinity(obj: any, x: number, y: number, range: number): boolean {
    if (!obj.x || !obj.y) {
      throw new Error('Cannot pass an object to inVicinity without coordinates')
    }
    if (
      x <= obj.x + range &&
      x >= obj.x - range &&
      y <= obj.y + range &&
      y >= obj.y - range
    ) {
      return true
    }
    return false
  }
}

export function objectToCollisionObject(obj: any): CollisionObject {
  return {
    x: obj.x,
    y: obj.y,
    width: obj.width,
    height: obj.height
  } as CollisionObject
}

export type CollisionObject = {
  x: number
  y: number
  width: number
  height: number
}
