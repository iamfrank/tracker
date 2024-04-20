import { getObservations, addObservation } from './db.js'
import { CalendarView } from './calendar.js'

customElements.define('calendar-view', CalendarView)

export class Tracker extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    getObservations().then((data) => {
      this.#render(data)
      const lastDaily = this.querySelector('.daily-mood:last-child')
      const rateButton = this.querySelector('.ratebutton')
      if (lastDaily) {
        lastDaily.scrollIntoView()
      }
      rateButton.addEventListener('click', this.rateDialogHandler.bind(this))
      this.querySelector('.moodpicker form').addEventListener('submit', this.rateHandler.bind(this))
    })
  }

  #render(daylies) {
    let dom = `
      <calendar-view></calendar-view>
      <div class="actionbar">
        <button class="ratebutton" title="Rate your day">+</button>
      </div>
      <dialog class="moodpicker">
        <h2>Rate your day</h2>
        <form>
          <button class="mood-color-1" value="0">Bad</button>
          <button class="mood-color-2" value="0.25">Meh</button>
          <button class="mood-color-3" value="0.5">OK</button>
          <button class="mood-color-4" value="0.75">Good</button>
          <button class="mood-color-5" value="1">Great</button>
        </form>
      </dialog>
    `
    this.innerHTML = dom
    this.querySelector('calendar-view').data = daylies
  }

  rateDialogHandler(event) {
    this.querySelector('.moodpicker').showModal()
  }

  rateHandler(event) {
    event.preventDefault()
    this.querySelector('.moodpicker').close()
    addObservation({
      kpid: 'kpi-1',
      time: new Date(),
      rating: Number(event.submitter.value)
    }).then(() => {
      getObservations().then((data) => {
        this.querySelector('calendar-view').data = data
      })
    })
  }

}
