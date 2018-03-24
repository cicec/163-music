import AV from 'leancloud-storage'
import eventHub from './event-hub'

const model = {
    data: {
        songs: [],
        selectedId: '',
    },
    setSelectedId(id) { this.data.selectedId = id },
    fetch() {
        const query = new AV.Query('Song')
        return query.find().then((response) => {
            this.data.songs = []
            response.forEach((item) => {
                this.data.songs.push({ id: item.id, ...item.attributes })
            })
            return { ...this.data }
        })
    }
}

const view = {
    el: document.getElementById('song-list'),
    template: '<li id="__id__">__name__</li>',
    addSongBtn: document.getElementById('add-song'),
    render(data) {
        let html = ''
        data.songs.forEach((item) => {
            html = html.concat(this.template.replace('__name__', item.name)
                .replace('__id__', item.id))
        })
        this.el.innerHTML = html
        if (data.selectedId) this.active(document.getElementById(data.selectedId))
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
        return model.fetch().then((data) => {
            this.view.render(data)
            return data
        })
    },
    bindEvents() {
        eventHub.on('addsong', () => { this.renderView() })
        eventHub.on('updatesong', () => { this.renderView() })
        eventHub.on('clickcreate', () => { this.view.clearActive() })
        eventHub.on('uploaded', () => { this.view.clearActive() })
        this.view.addSongBtn.addEventListener('click', () => {
            eventHub.emit('clickcreate')
        })
        this.view.el.addEventListener('click', (event) => {
            this.view.active(event.target)
            this.model.data.songs.forEach((item) => {
                if (item.id === event.target.id) {
                    this.model.setSelectedId(item.id)
                    eventHub.emit('selectedsong', item)
                }
            })
        })
    }
}

controller.init()