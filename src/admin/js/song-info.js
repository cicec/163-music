import $ from 'jquery'
import eventHub from './event-hub'

const view = {
    el: $('#song-info'),
    template: `
            <input type="text" placeholder="歌曲名" value="__name__">
            <input type="text" placeholder="歌手名" value="__singer__">
            <input type="text" placeholder="歌曲链接" value="__url__">
            <button>确认</button>
        `,
    render(data = {}) {
        const placeholders = ['name', 'singer', 'url']
        let html = this.template
        placeholders.forEach((placeholder) => {
            html = html.replace(`__${placeholder}__`, data[placeholder] || '')
        })
        this.el.html(html)
    }
}

const model = {}

const controller = {
    view: null,
    model: null,
    init() {
        this.view = view
        this.model = model
        this.view.render()
        eventHub.on('upload', (data) => {
            this.view.render(data)
        })
    }
}

controller.init()