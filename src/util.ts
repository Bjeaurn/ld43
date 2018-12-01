import { ImageAsset, Gine } from 'gine'

export class Util {
  static rotate(image: ImageAsset, degrees: number = 0): ImageAsset {
    var radians = (degrees * Math.PI) / 180
    Gine.handle.handle.save()
    Gine.handle.handle.rotate(radians)
    Gine.handle.handle.drawImage(image.image, 0, 0)
    const newImage = Gine.handle.handle.getImageData(
      0,
      0,
      image.width,
      image.height
    )
    image.image = newImage as any
    Gine.handle.handle.restore()
    return image
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
