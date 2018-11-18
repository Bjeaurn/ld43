import { Gine, IScene } from 'gine'

export const LoadingScene: IScene = {
  count: 0,
  total: 0,
  x: 0,
  y: 0,
  directionX: 1,
  directionY: 1,
  parse(data: any[]) {
    this.total = data.length
    data.forEach(d => {
      Gine.store.image(d.name, d.src)
      this.count++
      if (this.count === this.total) {
        // this.destroy();
        console.log('done')
      }
    })
  },
  tick() {
    if (this.x > Gine.CONFIG.width - Gine.store.get('logo').width) {
      this.directionX = 0
    } else if (this.x < 0) {
      this.directionX = 1
    }

    if (this.directionX === 1) {
      this.x++
    } else {
      this.x--
    }

    if (this.y > Gine.CONFIG.height - Gine.store.get('logo').height) {
      this.directionY = 0
    } else if (this.y < 0) {
      this.directionY = 1
    }

    if (this.directionY === 1) {
      this.y++
    } else {
      this.y--
    }
  },
  frame() {
    Gine.handle.handle.strokeStyle = 'white'
    Gine.handle.handle.strokeRect(
      0,
      0,
      Gine.CONFIG.viewport.maxX,
      Gine.CONFIG.viewport.maxY
    )
    Gine.handle.draw(Gine.store.get('logo'), this.x, this.y)
    // Gine.handle.text('Bliep bloep', 20, 20);
  },
  second() {},
  destroy() {}
}
