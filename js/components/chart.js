
/** A custom web component that can display time/value data as line, bar, or pixel chart. */
export class Chart extends HTMLElement {

  canvasElement
  ctx
  xMin
  xMax
  xFraction

  /**
   * @param {Array} data - An array of arrays of x,y datapoints where x is a Date epoc and y is a float between 0 and 1. Example: [[[1716793571782, 0.4],[1716793571700, 0.72]]]
   */
  set chartData(data) {
    this.calculateMinMax(data)
    this.draw(data)
  }

  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = '<canvas style="width: 100%; height: 100%;"></canvas>'
    this.canvasElement = this.querySelector('canvas')
    // Manually set height/width to enable crisp rendering inside canvas element
    this.canvasElement.height = this.canvasElement.clientHeight
    this.canvasElement.width = this.canvasElement.clientWidth
    this.ctx = this.canvasElement.getContext('2d', {alpha: false})
  }

  /** Sets default min/max values for the x-axisfrom first data point. */
  calculateMinMax(data) {
    // These values might not be the final ones, but now we have something to compare against.
    this.xMin = data[0][0][0]
    this.xMax = data[0][0][0]
    // Cycle points to figure out what values are min and max
    for (const trace of data) {
      for (const point of trace) {
        if (point[0] < this.xMin) {
          this.xMin = point[0]
        } else if (point[0] > this.xMax) {
          this.xMax = point[0]
        }
      }
    }
    // Calculate width relative fraction
    this.xFraction = this.canvasElement.width / (this.xMax - this.xMin)
  }

  draw(data) {
    this.ctx.clearRect(0,0, this.canvasElement.width, this.canvasElement.height)
    this.ctx.lineWidth = '2'

    if (this.dataset.type === 'lines') {
      this.drawLines(data)
    } else if (this.dataset.type === 'bars') {
      this.drawRectangles(data)
    } else if (this.dataset.type === 'pixels') {
      this.drawPixels(data)
    } else {
      this.drawRectangles(data)
    }
    this.drawDateText()
  }

  drawLines(data) {
    for (const trace of data) {
      this.ctx.beginPath()
      this.ctx.strokeStyle = `hsl(${ Math.round(Math.random() * 360) },100%,66%)`
      for (const pointIdx in trace) {
        const p = trace[pointIdx]
        const px = this.translateX(p[0])
        const py = this.translateY(p[1])
        if (pointIdx === 0) {
          this.ctx.moveTo(px, py)
        } else {
          this.ctx.lineTo(px,py)
        }
      }
      this.ctx.stroke()
      this.ctx.closePath()
    }
  }

  drawRectangles(data) {
    this.ctx.save()
    for (const trace of data) {
      this.ctx.beginPath()  
      this.ctx.fillStyle = `hsl(${ Math.round(Math.random() * 360) },100%,66%)`
      for (const pointIdx in trace) {
        const p = trace[pointIdx]
        const px = this.translateX(p[0])
        this.ctx.rect(px, this.canvasElement.height * 0.75, 16, p[1] * this.canvasElement.height * 0.75 * -1)
      }
      this.ctx.fill()
    }
    this.ctx.restore()
  }

  drawPixels(data) {
    for (const trace of data) {
      const colorValue = Math.round(Math.random() * 360)  
      for (const pointIdx in trace) {
        const p = trace[pointIdx]
        const px = this.translateX(p[0])
        const py = this.translateY(p[1])
        const colorLightness = Math.round(p[1] * 66)
        this.ctx.beginPath()
        this.ctx.fillStyle = `hsl(${ colorValue },100%,${ colorLightness }%)`
        this.ctx.rect(px, py, 16, 16)
        this.ctx.fill()
      }
    }
  }

  drawDateText() {
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '0.8rem monospace'
    this.ctx.rotate(Math.PI / 2)
    const offset = 64
    for (let i = offset / 2; i < this.canvasElement.width - 16; i = i + offset) {
      const date = new Date(Math.round(this.xMin + i / this.xFraction)).toLocaleDateString()
      // Note how x and y are reversed, since we rotated the context to write text vertically
      this.ctx.fillText(date, (this.canvasElement.height * 0.85), -i)
    }
  }

  translateX(x) {
    return (x - this.xMin) * this.xFraction
  }

  translateY(y) {
    return (this.canvasElement.height - (this.canvasElement.height * y)) * 0.8
  }

}