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

    this.addEventListener('dbupdate', this.render.bind(this))
  }

  async render() {
    const kpiname = location.pathname === '/html/kpis.html' ? false : new URLSearchParams(location.search).get('kpi')
    const list = await getData(this.getAttribute('db-table'), kpiname)
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

    this.querySelectorAll('.btn-edit').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        this.classList.toggle('editmode')
      })
    })
  }

  renderHead(list) {
    let markup = '<tr>'
    for (const prop in list[0]) {
      markup += `<th>${ prop }</th>`
    }
    markup += `
      <th>
        <button title="Edit mode" class="btn-edit edit-on">
          <svg class="icon-light" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200h50.461l409.463-409.463-50.461-50.461L200-250.461V-200Zm-23.845 59.999q-15.365 0-25.759-10.395-10.395-10.394-10.395-25.759v-69.306q0-14.632 5.616-27.893 5.615-13.26 15.461-23.106l506.539-506.308q9.073-8.241 20.036-12.736 10.963-4.495 22.993-4.495 12.029 0 23.307 4.27 11.277 4.269 19.969 13.576l48.846 49.461q9.308 8.692 13.269 20.004 3.962 11.311 3.962 22.622 0 12.065-4.121 23.028-4.12 10.964-13.11 20.037L296.46-161.078q-9.846 9.846-23.106 15.461-13.261 5.616-27.893 5.616h-69.306Zm584.23-570.153-50.231-50.231 50.231 50.231Zm-126.134 75.903-24.788-25.673 50.461 50.461-25.673-24.788Z"/></svg>
        </button>
        <button title="Leave edit mode" class="btn-edit edit-off">
          <svg class="icon-light" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m802.768-667.001-177.001 176q-8.307 8.308-20.576 8.808t-21.576-8.808q-8.693-8.692-8.693-21.076t8.693-21.077l76.309-76.309-50.461-50.461-76.309 76.309q-8.308 8.308-20.885 8.5-12.576.193-21.268-8.5-8.692-8.692-8.5-21.076.192-12.384 8.5-21.076l176.616-177.001q8.923-8.923 19.961-13.077 11.038-4.154 23.192-4.154 11.769 0 23.114 4.27 11.346 4.269 20.038 13.576l48.846 49.461q9.308 8.692 13.269 20.038 3.962 11.346 3.962 22.884 0 11.769-4.154 22.807-4.154 11.039-13.077 19.962ZM200-200h50.461L462.77-412.309l-24.923-25.538-25.538-24.923L200-250.461V-200Zm570.154 94.46L505.538-369.156 296.46-160.694q-9.846 9.846-23.192 15.27-13.346 5.423-27.807 5.423h-69.306q-15.461 0-25.807-10.347-10.347-10.346-10.347-25.807v-68.69q0-14.462 5.423-27.808 5.424-13.346 15.27-23.192l209.077-209.078L105.54-770.154q-8.923-8.923-8.808-20.884.116-11.962 9.423-21.269 9.308-9.308 21.384-9.308 12.077 0 21.385 9.308l663.998 663.999q8.923 8.923 8.808 21.192-.115 12.268-9.423 21.576-9.307 9.308-21.076 9.308t-21.077-9.308Zm-9.769-604.614-50.231-50.231 50.231 50.231Zm-150.922 50.23 50.461 50.461-50.461-50.461ZM437.847-437.847l-25.538-24.923 50.461 50.461-24.923-25.538Z"/></svg>
        </button>
      </th>
      </tr>
    `
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
    let markup = `<tr db-item="${item[this.getAttribute('db-key')]}">`
    for (const prop in item) {
      markup += `<td>${ item[prop] }</td>`
    }
    markup += `
      <td>
        <tracker-button-delete db-table="${ this.getAttribute('db-table') }" db-item="${ item[this.getAttribute('db-key')] }"></tracker-button-delete>
      </td>
      </tr>
    `
    return markup
  }
}