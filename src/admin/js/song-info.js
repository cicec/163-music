import AV from 'leancloud-storage'
import eventHub from './event-hub'

const model = {
    data: {},
    setLocalData(data) {
        this.data = data
    },
    create(data) {
        const Song = AV.Object.extend('Song')
        const song = new Song()
        song.set('name', data.name)
        song.set('singer', data.singer)
        song.set('url', data.url)
        return song.save().then((response) => {
            this.data = { id: response.id, ...response.attributes }
            return { ...this.data }
        })
    },
    update(data) {
        const song = AV.Object.createWithoutData('Song', this.data.id)
        song.set('name', data.name)
        song.set('singer', data.singer)
        song.set('url', data.url)
        return song.save().then((response) => {
            this.data = { id: response.id, ...response.attributes }
            return { ...this.data }
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
    state: 'create',
    init() {
        this.view = view
        this.model = model
        this.view.render()
        this.bindEvents()
    },
    getInputValue() {
        const data = {}
        view.keys.forEach((key) => {
            data[key] = this.view.el.querySelector(`input[name=${key}]`).value
        })
        return data
    },
    addSong() {
        const data = this.getInputValue()
        this.model.create(data).then(() => {
            this.view.render()
            eventHub.emit('addsong')
            alert('添加歌曲成功！')
        })
    },
    modifySong() {
        const data = this.getInputValue()
        this.model.update(data).then((newData) => {
            this.view.render(newData)
            eventHub.emit('updatesong')
            alert('修改歌曲信息成功！')
        })
    },
    bindEvents() {
        eventHub.on('clickcreate', () => {
            this.model.setLocalData({})
            this.view.render()
            this.state = 'create'
        })
        eventHub.on('uploaded', (data) => {
            this.view.render(data)
            this.state = 'create'
        })
        eventHub.on('selectedsong', (data) => {
            this.model.setLocalData(data)
            this.view.render(data)
            this.state = 'update'
        })
        this.view.el.addEventListener('submit', (event) => {
            event.preventDefault()
            if (this.state === 'create') {
                this.addSong()
            } else if (this.state === 'update') {
                this.modifySong()
            }
        })
    }
}

controller.init()