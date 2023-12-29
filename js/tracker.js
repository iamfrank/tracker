import { getData, addData } from './db.js'

export class Tracker extends HTMLElement {



  constructor() {
    super()
  }

  connectedCallback() {
    getData().then((data) => {
      this.#render(data)
      const lastDaily = this.querySelector('.daily-mood:last-child')
      const rateButton = this.querySelector('.ratebutton')
      lastDaily.scrollIntoView()
      if (lastDaily.title === this.#dateToISO(new Date())) {
        rateButton.disabled = true
      } else {
        rateButton.addEventListener('click', this.rateDialogHandler.bind(this))
      }
      this.querySelector('.moodpicker form').addEventListener('submit', this.rateFormHandler.bind(this))
    })
  }

  #dateToISO(date) {
    return date.toISOString().substring(0,10)
  }

  #render(daylies) {
    let dom = '<ul class="moods">'
    daylies.map((daily) => {
      dom += `<li class="daily-mood mood-color-${daily.mood}" title="${daily.day}"></li>`
    })
    dom += `
      </ul>
      <div class="actionbar">
        <button class="ratebutton">
          Rate today
        </button>
      </div>
      <dialog class="moodpicker">
        <h2>Rate your day</h2>
        <form>
          <button class="mood-color-1" value="1">Bad</button>
          <button class="mood-color-2" value="2">Meh</button>
          <button class="mood-color-3" value="3">OK</button>
          <button class="mood-color-4" value="4">Good</button>
          <button class="mood-color-5" value="5">Great</button>
        </form>
      </dialog>
    `
    this.innerHTML = dom
  }

  rateDialogHandler(event) {
    this.querySelector('.moodpicker').showModal()
  }

  rateFormHandler(event) {
    event.preventDefault()
    this.querySelector('.moodpicker').close()
    addData({
      day: this.#dateToISO(new Date()),
      mood: event.submitter.value
    })
  }

}
