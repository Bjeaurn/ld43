export class NPC implements INPC {
  static instances: NPC[] = []
  static lastID = 0

  static add(npc: NPC): number {
    NPC.lastID++
    NPC.instances.push(npc)
    return NPC.lastID
  }

  static get(id: number): NPC {
    return NPC.instances[NPC.instances.findIndex(n => n.id === id)]
  }

  x: number = 0
  y: number = 0
  direction: number = 0
  moveDirection: string[] = []
  moveSpeed: number = 0
  timer: number = 0
  readonly id: number

  constructor(x: number, y: number, obj?: any) {
    this.x = x
    this.y = y
    this.id = NPC.add(this)
  }

  faceTo(x: number, y: number) {
    const m = Math.atan2(this.y - y, this.x - x)
    const direction = Math.round((m * 180) / Math.PI) + 270
    this.direction = direction
  }

  distanceTo(x: number, y: number): number {
    const a = x - this.x
    const b = y - this.y
    return Math.floor(Math.sqrt(a * a + b * b))
  }

  isInVicinity(x: number, y: number, range: number): boolean {
    if (
      x <= this.x + range &&
      x >= this.x - range &&
      y <= this.y + range &&
      y >= this.y - range
    ) {
      return true
    }
    return false
  }

  update(delta: number) {}
  nextTask() {}
}

export interface INPC {
  update(delta: number): void
  nextTask(): void
}

// FIXME Promote to the engine.
export function calculateMoveVector(
  sX: number,
  sY: number,
  dX: number,
  dY: number
): string[] {
  const diffX = Math.round(dX - sX)
  const diffY = Math.round(dY - sY)
  let direction: string[] = []
  if (diffX > 0) {
    direction.push('EAST')
  }
  if (diffX < 0) {
    direction.push('WEST')
  }
  if (diffY < 0) {
    direction.push('NORTH')
  }
  if (diffY > 0) {
    direction.push('SOUTH')
  }
  return direction
}
