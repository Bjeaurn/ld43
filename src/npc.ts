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
  readonly id: number

  constructor(x: number, y: number, obj?: any) {
    this.x = x
    this.y = y
    this.id = NPC.add(this)
  }

  update(delta: number) {}
}

export interface INPC {
  update(delta: number): void
}
