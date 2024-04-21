import { delData } from '../modules/db.js'

export class ButtonDelete extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <button class="btn-del" title="Delete">
        <svg class="icon-light" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M292.309-140.001q-29.827 0-51.067-21.241-21.241-21.24-21.241-51.067V-720h-10q-12.75 0-21.375-8.629-8.625-8.628-8.625-21.384 0-12.755 8.625-21.37 8.625-8.616 21.375-8.616H360q0-14.692 10.346-25.038t25.038-10.346h169.232q14.692 0 25.038 10.346T600-779.999h149.999q12.75 0 21.375 8.629t8.625 21.384q0 12.756-8.625 21.371Q762.749-720 749.999-720h-10v507.691q0 29.827-21.241 51.067-21.24 21.241-51.067 21.241H292.309ZM680-720H280v507.691q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462h375.382q5.385 0 8.847-3.462 3.462-3.462 3.462-8.847V-720ZM406.168-280q12.755 0 21.37-8.625 8.616-8.625 8.616-21.374v-300.002q0-12.749-8.629-21.374Q418.896-640 406.141-640q-12.756 0-21.371 8.625-8.615 8.625-8.615 21.374v300.002q0 12.749 8.629 21.374Q393.412-280 406.168-280Zm147.691 0q12.756 0 21.371-8.625 8.615-8.625 8.615-21.374v-300.002q0-12.749-8.629-21.374Q566.588-640 553.832-640q-12.755 0-21.37 8.625-8.616 8.625-8.616 21.374v300.002q0 12.749 8.629 21.374Q541.104-280 553.859-280ZM280-720v520-520Z"/></svg>
      </button>    
    `
    this.querySelector('button').addEventListener('click', this.deleteButtonHandler.bind(this))
  }

  deleteButtonHandler(event) {
    event.stopPropagation()
    delData(this.getAttribute('db-table'), this.getAttribute('db-item')).then(() => {
      this.dispatchEvent(new CustomEvent('dbupdate', {bubbles: true}))
    })
  }
}