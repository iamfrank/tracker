import { getObservationList, delData } from '../modules/db.js'

export class ObservationList extends HTMLElement {

  listData

  constructor() {
    super()
  }

  connectedCallback() {
    this.update() 
  }

  async update() {
    this.listData = await getObservationList(localStorage.getItem('kpid'))
    this.render()
  }

  render() {
    this.innerHTML = `
      <tracker-header>Observations</tracker-header>

      <main>
        <tracker-list db-key="time"></tracker-list>
        <a class="btn" href="./observationadd.html" title="Add">
          <svg class="icon-light" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M450.001-450.001h-200q-12.75 0-21.375-8.628-8.625-8.629-8.625-21.384 0-12.756 8.625-21.371 8.625-8.615 21.375-8.615h200v-200q0-12.75 8.628-21.375 8.629-8.625 21.384-8.625 12.756 0 21.371 8.625 8.615 8.625 8.615 21.375v200h200q12.75 0 21.375 8.628 8.625 8.629 8.625 21.384 0 12.756-8.625 21.371-8.625 8.615-21.375 8.615h-200v200q0 12.75-8.628 21.375-8.629 8.625-21.384 8.625-12.756 0-21.371-8.625-8.615-8.625-8.615-21.375v-200Z"/></svg>
        </a>
      </main>
    
      <tracker-footer></tracker-footer>
    `
    this.updated()
  }

  updated() {
    const listElement = this.querySelector('tracker-list')
    listElement.data = this.listData

    listElement.addEventListener('tracker:delete', this.deleteHandler.bind(this))
  }

  deleteHandler(event) {
    delData('observations', Number(event.detail.key)).then(() => {
      this.update()
    })
  }
}