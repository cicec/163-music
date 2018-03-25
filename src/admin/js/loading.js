import eventHub from './event-hub'

const model = {}

const view = {
    el: document.getElementById('loading'),
    show() { this.el.classList.add('loading') },
    hidden() { this.el.classList.remove('loading') }
}

const controller = {
    model: null,
    view: null,
    init() {
        this.model = model
        this.view = view
        this.bindEvent()
    },
    bindEvent() {
        eventHub.on('toupload', () => { this.view.show() })
        eventHub.on('uploaded', () => { this.view.hidden() })
    }
}

controller.init()