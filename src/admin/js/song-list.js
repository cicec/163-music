import AV from 'leancloud-storage'
import eventHub from './core/event-hub'
import { Model, View, Controller } from './core/base'

const model = new Model({
    init() { this.fetchSongs() },
    fetchSongs() {
        const query = new AV.Query('Song')
        return query.find().then((response) => {
            const data = { ...this.fetch() }
            data.songs = []
            response.forEach((item) => {
                data.songs.push({ id: item.id, ...item.attributes })
            })
            this.save(data)
            return data
        })
    },
    setSelectedId(id = '') {
        const { songs } = this.fetch()
        this.save({ selectedId: id, songs })
    }
})

const view = new View({
    el: document.getElementById('song-list'),
    template: '<li id="__id__">__name__</li>',
    addSongBtn: document.getElementById('add-song'),
    active(el) {
        this.clearActive()
        el.classList.add('active')
    },
    clearActive() {
        const { children } = this.el
        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove('active')
        }
    },
    render(data) {
        let html = ''
        data.songs.forEach((item) => {
            html = html.concat(this.template.replace('__name__', `${item.singer} - ${item.name}`)
                .replace('__id__', item.id))
        })
        this.el.innerHTML = html
        if (data.selectedId) this.active(document.getElementById(data.selectedId))
    }
})

const controller = new Controller({
    model,
    view,
    bindEvents() {
        eventHub.on('addsong', () => { this.model.fetchSongs() })
        eventHub.on('updatesong', () => { this.model.fetchSongs() })
        eventHub.on('clickcreate', () => { this.model.setSelectedId() })
        eventHub.on('uploaded', () => { this.model.setSelectedId() })
        this.view.addSongBtn.addEventListener('click', () => {
            eventHub.emit('clickcreate')
        })
        this.view.el.addEventListener('click', (event) => {
            this.model.fetch().songs.forEach((item) => {
                if (item.id === event.target.id) {
                    this.model.setSelectedId(item.id)
                    eventHub.emit('selectedsong', item)
                }
            })
        })
    },
})

controller.init()