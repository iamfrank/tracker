import { getKPIList } from '../modules/db.js'

export class TrackerHeader extends HTMLElement {

  kpiList

  constructor() {
    super()
  }

  connectedCallback() {
    this.update()
  }

  async update() {

    this.kpiList = await getKPIList()
    this.render()
  }

  render() {
    const title = this.innerText
    this.innerHTML = `
      <header>
        <h1>
          <img src="../img/favicon.svg" alt="" style="width: 2rem; height: 2rem;">
          ${ this.dataset.selectable ? `
          <select>
            ${ this.renderOptions(this.kpiList) }
          </select>
          ` : ''}
          ${ title }
        </h1>
        <a class="btn" href="./info.html" title="Information">
          <svg class="icon-light" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M479.56-255.386q17.132 0 28.94-11.829 11.807-11.829 11.807-28.961 0-17.132-11.829-28.939-11.829-11.808-28.961-11.808-17.132 0-28.939 11.829-11.808 11.829-11.808 28.961 0 17.132 11.829 28.94 11.829 11.807 28.961 11.807Zm.507 155.385q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Zm3.24-171.231q27.683 0 47.914 17.429t20.231 43.572q0 22-12.923 39.384-12.923 17.385-29.538 32.385-21.78 19.321-38.352 42.507-16.571 23.185-17.725 51.647-.385 10.922 7.692 18.307 8.077 7.384 18.846 7.384 11.538 0 19.538-7.692 7.999-7.692 10.23-18.846 4-20.615 17.039-36.73Q539.23-478 554.441-492.532q21.866-21.314 38.173-46.48 16.308-25.167 16.308-56.141 0-47.538-37.461-78.115Q534-703.845 484-703.845q-35.692 0-67.307 15.808-31.615 15.807-49.231 46.115-5.461 9.307-3.506 19.593 1.955 10.285 10.557 15.619 10.949 6.095 22.487 3.479 11.538-2.615 19.615-13.153 12.154-15.77 29.423-25.308 17.269-9.539 37.202-9.539Z"/></svg>
        </a>
      </header>
    `
    this.updated()
  }

  renderOptions(kpiList) {
    let markup = ''
    kpiList.forEach((kpi) => {
      markup += `<option value="${ kpi.id }">${ kpi.name }</option>`
    })
    return markup
  }

  updated() {
    const selectElement = this.querySelector('select')
    
    if (selectElement) {
      selectElement.value = localStorage.getItem('kpid')
    
      selectElement.addEventListener('change', (event) => {
        localStorage.setItem('kpid', event.target.value)
        this.dispatchEvent(new CustomEvent('tracker:update', {bubbles: true}))
      })  
    }
  }
}