import { zeroPrefix } from "./util.js"

export class CalendarView extends HTMLElement {

  today = new Date()
  dailyData

  set data(data) {
    this.dailyData = data
    this.#initCalendar()
  }

  constructor() {
    super()
  }

  #generateCalendarMonth(year, month) {
    const m = month + 1
    const daysInMonth = new Date(year, m, 0).getDate()
    
    // Create a month container
    const monthContainer = document.createElement('div')
    monthContainer.className = 'month'
    monthContainer.dataset.time = `${year}-${m}`

    // Display month and year in the header
    const header = document.createElement('p')
    header.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`
    monthContainer.appendChild(header)

    // Create day blocks for the month
    const days = document.createElement('div')
    days.className = 'days'
    for (let i = 0; i < daysInMonth; i++) {
      const time = `${year}-${zeroPrefix(m)}-${zeroPrefix(i+1)}`
      const dayData = this.dailyData.find((d) => d.day === time)
      const day = document.createElement('div')
      day.classList.add('day')
      day.classList.add(`mood-color-${ dayData?.mood }`)
      day.title = time
      days.appendChild(day)
    }
    monthContainer.appendChild(days)

    return monthContainer
  }

  // Function to initialize the calendar with the latest 6 months
  #initCalendar() {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    for (let i = 5; i >= 0; i--) {
      this.appendChild(this.#generateCalendarMonth(currentYear, currentMonth - i))
    }

    this.querySelector('.month:last-child').scrollIntoView()

    // Set the scroll event to load more months
    this.addEventListener('scroll', () => {
      const scrollTop = this.scrollTop
      const scrollHeight = this.scrollHeight
      const clientHeight = this.clientHeight

      if (scrollTop === 0) {
        // Load older months when scrolling to the top
        const firstMonthEl = this.querySelector('.month:first-child')
        let earliest = new Date(firstMonthEl.dataset.time)
        const newMonth = new Date(earliest.setMonth(earliest.getMonth() - 1))
        this.insertBefore(this.#generateCalendarMonth(newMonth.getUTCFullYear(), newMonth.getMonth()), firstMonthEl)
        // Adjust scroll position to maintain the display
        this.scrollTop = 10
      } else if (scrollTop + clientHeight === scrollHeight) {
        // Load newer months when scrolling to the bottom
        let latest = new Date(this.querySelector('.month:last-child').dataset.time)
        const newMonth = new Date(latest.setMonth(latest.getMonth() + 1))
        this.appendChild(this.#generateCalendarMonth(newMonth.getUTCFullYear(), newMonth.getMonth()))
      }
    })

  }

}
