import { Model, View, Controller } from './core/base'
import eventHub from './core/event-hub'

const model = new Model({
    init() { this.save({ current: 'remd-songs' }) }
})

const view = new View({
    el: document.getElementById('main-content'),
    render(data = {}) {
        for (let i = 0; i < this.el.children.length; i++) {
            this.el.children[i].classList.add('hidden')
        }
        document.getElementById(data.current).classList.remove('hidden')
    }
})

const controller = new Controller({
    model,
    view,
    bindEvents() {
        eventHub.on('toggletab', (data) => {
            this.model.save({ current: data.current })
        })
    }
})

controller.init()