import AV from 'leancloud-storage'
import { Model, View, Controller } from './core/base'

const model = new Model({
    init() { return this.fetchPlaylist() },
    getQueryParams() {
        let { search } = window.location
        if (search[0] === '?') search = search.substr(1)
        const obj = {}
        search.split('&').filter(v => v).forEach((item) => {
            const [key, value] = item.split('=')
            obj[key] = value
        })
        return obj
    },
    fetchPlaylist() {
        const playlistId = this.getQueryParams().id
        const query = new AV.Query('Playlist')
        return query.get(playlistId).then((response) => {
            const data = { ...this.fetch(), playlist: { id: response.id, ...response.attributes } }
            this.save(data)
            return data
        })
    }
})

const view = new View({
    el: document.getElementById('list-info'),
    template: `
        <div class="header-bg">
            <img src="{{ cover }}" alt="">
        </div>
        <div class="header-top">
            <div class="cover">
                <span class="play-number">{{ playNumber }}</span>
                <img src="{{ cover }}" alt="">
            </div>
            <div class="list-info">
                <h1>{{ title }}</h1>
                <p>{{ creator }}</p>
            </div>
        </div>
        <div class="list-intro">
            <p class="tags">
                标签：
                <span>{{ tag1 }}</span>
                <span>{{ tag2 }}</span>
                <span>{{ tag3 }}</span>
            </p>
            <p class="intro">简介：<span>{{ introduction }}</span></p>
        </div>
    `,
    render(data = {}) {
        const { playlist } = data
        let html = Object.keys(playlist).reduce((accum, current) => {
            const placeholder = new RegExp(`{{ ${current} }}`, 'g')
            return accum.replace(placeholder, playlist[current])
        }, this.template)
        playlist.tags.forEach((tag, index) => {
            html = html.replace(`{{ tag${index + 1} }}`, tag)
        })
        this.el.innerHTML = html
    }
})

const controller = new Controller({ model, view })

controller.init()