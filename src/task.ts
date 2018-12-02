import { NPC, calculateMoveVector } from './npc'

export type Task = {
  task: string
  [key: string]: any
}

export const MOVE = 'MOVE'
export const HOLD = 'HOLD'
export const LOITER = 'LOITER'

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
      case LOITER:
        if (actor.isInVicinity(job.x, job.y, 5)) {
          delete job.x
          delete job.y
          actor.nextTask()
          return
        }
        if (!job.x && !job.y) {
          job.x =
            actor.x +
            Math.floor(
              Math.random() * (actor.moveSpeed - -actor.moveSpeed + 1)
            ) +
            -actor.moveSpeed
          job.y =
            actor.y +
            Math.floor(
              Math.random() * (actor.moveSpeed - -actor.moveSpeed + 1)
            ) +
            -actor.moveSpeed
        }
        actor.moveDirection = calculateMoveVector(
          actor.x,
          actor.y,
          job.x,
          job.y
        )
        break
      default:
        throw new Error('Did you forget to add a case?')
        break
    }
  }
}
