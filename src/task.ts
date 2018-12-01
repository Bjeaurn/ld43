import { NPC } from './npc'

export type Task = {
  task: string
  [key: string]: any
}

export const MOVE = 'MOVE'
export const HOLD = 'HOLD'

export class TaskHandler {
  static do(job: Task, actor: NPC) {
    switch (job.task) {
      case MOVE:
        if (actor.isInVicinity(job.x, job.y, Math.random() * 5 + 1)) {
          actor.nextTask()
        } else {
          actor.moveDirection = calculateMoveVector(
            actor.x,
            actor.y,
            job.x,
            job.y
          )
        }
        break
      case HOLD:
        break
      default:
        throw new Error('Did you forget to add a case?')
        break
    }
  }
}

export function calculateMoveVector(
  sX: number,
  sY: number,
  dX: number,
  dY: number
): string[] {
  const diffX = dX - sX
  const diffY = dY - sY
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
