import AV from 'leancloud-storage'
import eventHub from './event-hub'

const view = {
    el: document.getElementById('song-list'),
    template: '<li>__name__</li>',
    render(data) {
        let html = ''
        data.forEach((value) => {
            html = html.concat(this.template.replace('__name__', value.attributes.name))
            this.el.innerHTML = html
        })
    },
    active(el) {
        this.clearActive()
        el.classList.add('active')
    },
    clearActive() {
        const { children } = this.el
        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove('active')
        }
    }
}

const model = {
    data: null,
    fetch() {
        const query = new AV.Query('Song')
        return query.find().then((response) => {
            this.data = response
            return response
        })
    }
}

const controller = {
    view: null,
    model: null,
    init() {
        this.view = view
        this.model = model
        this.renderView()
        this.bindEvents()
    },
    renderView() {
        model.fetch().then((response) => {
            this.view.render(response)
        })
    },
    bindEvents() {
        eventHub.on('addsong', () => {
            this.renderView()
        })
        this.view.el.addEventListener('click', (event) => {
            this.view.active(event.target)
        })
    }
}

controller.init()