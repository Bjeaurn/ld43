import { NPC, calculateMoveVector } from './npc'
import { ImageAsset, Gine } from 'gine'
import { Task, TaskHandler, HOLD } from './task'
import { Player } from './player'

export class Guard extends NPC {
  image: ImageAsset
  jobs: Task[] = []
  currentTask: Task | null
  moveSpeed: number = 40
  isHunting: boolean = false
  aggressiveness: number = 3
  shootingRange: number = 90
  visionRange: number = 100
  constructor(x: number, y: number, direction: number, jobs: Task[]) {
    super(x, y)
    this.image = Gine.store.get('guard')
    this.direction = direction
    this.jobs = jobs
    this.currentTask = null
    if (this.jobs.length > 0) {
      this.currentTask = this.jobs.shift() as Task
    }
  }

  aimAndShoot(player: Player, delta: number) {
    this.moveDirection = []
    this.faceTo(player.x, player.y)
    if (this.distanceTo(player.x, player.y) <= this.shootingRange) {
      this.timer += delta
      if (this.timer >= this.aggressiveness - 0.2) {
        this.image = Gine.store.get('guard-fire')
        if (this.timer >= this.aggressiveness) {
          player.hit()
        }
      }
    }
    // } else {
    //   this.timer = 0
    //   this.moveDirection = calculateMoveVector(
    //     this.x,
    //     this.y,
    //     player.x,
    //     player.y
    //   )
    // }
  }

  isCloseTo(prisoner: NPC): boolean {
    return this.isInVicinity(prisoner.x, prisoner.y, this.visionRange)
  }

  update(delta: number) {
    const player = Gine.store.get('player')
    if (
      player.alive &&
      this.isInVicinity(player.x, player.y, this.visionRange)
    ) {
      if (!this.isHunting) {
        this.isHunting = true
        this.timer = 0
        this.image = Gine.store.get('guard-aiming')
      }

      this.aimAndShoot(player, delta)
    } else {
      if (this.isHunting) {
        this.isHunting = false
        this.image = Gine.store.get('guard')
      }

      if (this.currentTask) {
        TaskHandler.do(this.currentTask, this)

        if (this.currentTask.task === 'HOLD') {
          this.timer += delta
          if (this.timer >= this.currentTask.time) {
            this.timer = 0
            this.nextTask()
          }
        }
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
    this.jobs.push(this.currentTask as Task)
    this.currentTask = this.jobs.shift() as Task
    if (this.currentTask.task === HOLD && this.currentTask.direction) {
      this.direction = this.currentTask.direction
    }
  }
}
