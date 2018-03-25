import eventHub from './core/event-hub'
import { Model, View, Controller } from './core/base'

const model = new Model({ init() { this.save({ isLoading: false }) } })

const view = new View({
    el: document.getElementById('loading'),
    render(data) {
        if (data.isLoading) {
            this.el.classList.add('loading')
        } else {
            this.el.classList.remove('loading')
        }
    }
})

const controller = new Controller({
    model,
    view,
    bindEvents() {
        eventHub.on('toupload', () => { this.model.save({ isLoading: true }) })
        eventHub.on('uploaded', () => { this.model.save({ isLoading: false }) })
    }
})

controller.init()