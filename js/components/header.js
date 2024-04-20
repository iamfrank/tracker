export class TrackerHeader extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const title = this.innerText
    this.innerHTML = `
      <header>
        <button>back</button>
        <h1>
          <img src="../img/favicon.svg" alt="" style="width: 2rem; height: 2rem;"> 
          ${ title }: <span class="kpiname"></span>
        </h1>
        <nav>
          <a href="/html/kpis.html">KPIs</a>
          <a href="/html/info.html">Info</a>
        </nav>
      </header>
    `
    this.querySelector('button').addEventListener('click', (event) => {
      history.back()
    })
  }

}