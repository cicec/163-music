import AV from 'leancloud-storage'
import eventHub from './event-hub'

const view = {
    el: document.getElementById('song-list'),
    template: '<li><button>__name__</button></li>',
    render(data) {
        let html = ''
        data.forEach((value) => {
            html = html.concat(this.template.replace('__name__', value.attributes.name))
            this.el.innerHTML = html
        })
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
        eventHub.on('addsong', () => {
            this.renderView()
        })
    },
    renderView() {
        model.fetch().then((response) => {
            this.view.render(response)
        })
    }
}

controller.init()