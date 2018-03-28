import { Model, View, Controller } from './core/base'
import eventHub from './core/event-hub'

const model = new Model({
    init() {
        this.save({
            tabs: ['remd-songs', 'hot-songs', 'search-songs'],
            current: 'remd-songs'
        })
    }
})

const view = new View({
    el: document.getElementById('tab-nav'),
    render(data = {}) {
        for (let i = 0; i < this.el.children.length; i++) {
            this.el.children[i].classList.remove('active')
            if (data.tabs[i] === data.current) {
                this.el.children[i].classList.add('active')
            }
        }
    }
})

const controller = new Controller({
    model,
    view,
    bindEvents() {
        this.view.el.addEventListener('click', (event) => {
            if (event.target.tagName.toLowerCase() === 'li') {
                const siblings = this.view.el.children
                let index = 0
                for (let i = 0; i < siblings.length; i++) {
                    if (siblings[i] === event.target) index = i
                }
                const data = this.model.fetch()
                this.model.save({ ...data, current: data.tabs[index] })
                eventHub.emit('toggletab', { current: data.tabs[index] })
            }
        })
    }
})

controller.init()
controller.bindEvents()