import AV from 'leancloud-storage'
import eventHub from './event-hub'

const model = {
    data: {},
    add(data) {
        const Song = AV.Object.extend('Song')
        const song = new Song()
        song.set('name', data.name)
        song.set('singer', data.singer)
        song.set('url', data.url)
        return song.save().then((response) => {
            this.data = {
                id: response.id,
                name: response.attributes.name,
                singer: response.attributes.singer,
                url: response.attributes.url
            }
            return response
        })
    }
}

const view = {
    el: document.getElementById('song-info'),
    template: `
            <input type="text" name="name" placeholder="歌曲名" value="__name__">
            <input type="text" name="singer" placeholder="歌手名" value="__singer__">
            <input type="text" name="url" placeholder="歌曲链接" value="__url__">
            <button>确认</button>
    `,
    keys: ['name', 'singer', 'url'],
    render(data = {}) {
        let html = this.template
        this.keys.forEach((key) => {
            html = html.replace(`__${key}__`, data[key] || '')
        })
        this.el.innerHTML = html
    }
}

const controller = {
    view: null,
    model: null,
    init() {
        this.view = view
        this.model = model
        this.view.render()
        this.bindEvents()
        eventHub.on('upload', (data) => {
            this.view.render(data)
        })
    },
    addSong() {
        const data = {}
        view.keys.forEach((key) => {
            data[key] = this.view.el.querySelector(`input[name=${key}]`).value
        })
        this.model.add(data).then(() => {
            this.view.render()
        })
    },
    bindEvents() {
        this.view.el.addEventListener('submit', (event) => {
            event.preventDefault()
            this.addSong()
        })
    }
}

controller.init()