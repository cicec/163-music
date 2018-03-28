class Model {
    constructor(options) {
        this.data = {}
        this.listeners = []
        this.init = () => { this.save() }
        Object.assign(this, options)
    }

    addListener(listener) {
        this.listeners.push(listener)
    }

    fetch() { return this.data }

    save(data = {}) {
        this.data = data
        this.listeners.forEach((listener) => { listener(data) })
    }
}


class View {
    constructor(options) {
        this.el = ''
        this.template = ''
        this.render = () => {}
        Object.assign(this, options)
    }
}


class Controller {
    constructor(options) {
        this.model = null
        this.view = null
        this.bindEvents = () => {}
        Object.assign(this, options)
    }

    init() {
        this.model.addListener((data) => { this.view.render(data) })
        return this.model.init()
    }
}

export { Model, View, Controller }