import { getData, delData } from '../modules/db.js'

export class List extends HTMLElement {

  set data(list) {
    this.render(list)
  }

  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  async render() {
    const list = await getData(this.getAttribute('db-table'))
    this.innerHTML = `
      <table>
        <thead>
          ${ this.renderHead(list) }
        </thead>
        <tbody>
          ${ this.renderBody(list) }
        </tbody>
      </table>
    `
    this.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', this.deleteButtonHandler.bind(this))
    })
  }

  renderHead(list) {
    let markup = '<tr>'
    for (const prop in list[0]) {
      markup += `<th>${ prop }</th>`
    }
    markup += '<td></td></tr>'
    return markup
  }

  renderBody(list) {
    let markup = ''
    list.forEach((listItem) => {
      markup += this.renderBodyRow(listItem)
    })
    return markup
  }

  renderBodyRow(item) {
    let markup = '<tr>'
    for (const prop in item) {
      markup += `<td>${ item[prop] }</td>`
    }
    markup += `<td><button db-table="${ this.getAttribute('db-table') }" db-item="${ item[this.getAttribute('db-key')] }">delete</button></td></tr>`
    return markup
  }

  deleteButtonHandler(event) {
    delData(this.getAttribute('db-table'), event.target.getAttribute('db-item'))
    this.render()
  }
}