import { NPC } from './npc'
import { ImageAsset, Gine } from 'gine'
import { Task, TaskHandler, HOLD } from './task'

export class Guard extends NPC {
  readonly image: ImageAsset
  jobs: Task[] = []
  currentJob: Task
  moveSpeed: number = 40
  constructor(x: number, y: number, direction: number, jobs: Task[]) {
    super(x, y)
    this.image = Gine.store.get('guard')
    this.direction = direction
    this.jobs = jobs
    this.currentJob = this.jobs.shift() as Task
  }

  update(delta: number) {
    if (this.currentJob) {
      TaskHandler.do(this.currentJob, this)
    }

    if (this.currentJob.task === 'HOLD') {
      this.timer += delta
      if (this.timer >= this.currentJob.time) {
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

  nextTask() {
    this.moveDirection = []
    this.jobs.push(this.currentJob)
    this.currentJob = this.jobs.shift() as Task
    if (this.currentJob.task === HOLD && this.currentJob.direction) {
      this.direction = this.currentJob.direction
    }
  }
}
