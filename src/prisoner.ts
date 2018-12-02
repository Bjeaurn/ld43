import { NPC } from './npc'
import { ImageAsset, Gine } from 'gine'
import { Task, HOLD, TaskHandler } from './task'

export class Prisoner extends NPC {
  image: ImageAsset
  jobs: Task[] = []
  currentTask: Task | null
  moveSpeed: number = 25
  alive: boolean = true
  type: number = 0
  constructor(
    type: number,
    x: number,
    y: number,
    direction: number,
    jobs: Task[]
  ) {
    super(x, y)
    this.type = type
    this.image = Gine.store.get('prisoner-' + this.type)
    this.direction = direction
    this.jobs = jobs
    this.currentTask = null
    if (this.jobs.length > 0) {
      this.currentTask = this.jobs.shift() as Task
    }
  }

  hit() {
    this.alive = false
    this.image = Gine.store.get('prisoner-' + this.type + '-dead')
  }

  update(delta: number) {
    if (this.alive) {
      if (this.currentTask) {
        TaskHandler.do(this.currentTask, this)

        if (this.currentTask.task === 'HOLD') {
          this.timer += delta
          if (this.timer >= this.currentTask.time) {
            this.timer = 0
            this.nextTask()
          }
        }

        if (this.moveDirection.length > 0) {
          if (this.moveDirection.indexOf('EAST') > -1) {
            this.x += this.moveSpeed * delta
            this.direction = 90
          }

          if (this.moveDirection.indexOf('WEST') > -1) {
            this.x -= this.moveSpeed * delta
            this.direction = 270
          }

          if (this.moveDirection.indexOf('NORTH') > -1) {
            this.y -= this.moveSpeed * delta
            this.direction = 0
          }

          if (this.moveDirection.indexOf('SOUTH') > -1) {
            this.y += this.moveSpeed * delta
            this.direction = 180
          }
        }
      }
    }
  }

  nextTask() {
    this.moveDirection = []
    if (this.currentTask && this.currentTask.task === 'LOITER') {
        delete this.currentTask.x
        delete this.currentTask.y
    }
    this.jobs.push(this.currentTask as Task)
    this.currentTask = this.jobs.shift() as Task
    if (this.currentTask.task === HOLD && this.currentTask.direction) {
      this.direction = this.currentTask.direction
    }
  }
}
