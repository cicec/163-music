import AV from 'leancloud-storage'
import { Model, View, Controller } from './core/base'

const model = new Model({
    init() { this.save({ state: 'ready' }) },
    fetchSongs(keyword) {
        const query = new AV.Query('Song')
        query.contains('name', keyword)
        return query.find().then((response) => {
            const data = this.fetch()
            data.songs = []
            response.forEach((item) => {
                data.songs.push({ id: item.id, ...item.attributes })
            })
            if (data.songs.length === 0) {
                data.state = 'fail'
            } else {
                data.state = 'success'
            }
            this.save(data)
            return data
        })
    }
})

const formView = new View({ el: document.getElementById('search-songs-form') })

const resultView = new View({
    el: document.getElementById('search-songs-result'),
    listTemplate: `
        <li id="{{ id }}">
            <a href="./song.html?id={{ id }}">
                <div class="song-info">
                    <h4>{{ name }}</h4>
                    <span class="song-info">{{ singer }} - {{ name }}</span>
                </div>
                <span class="play-icon sprite"></span>
            </a>
        </li>
    `,
    render(data = {}) {
        if (data.state === 'fail') {
            this.el.querySelector('#fail').classList.remove('hidden')
            this.el.querySelector('#success').classList.add('hidden')
        } else if (data.state === 'success') {
            this.el.querySelector('#success').classList.remove('hidden')
            this.el.querySelector('#fail').classList.add('hidden')
            const keys = ['id', 'name', 'singer', 'url']
            let html = ''
            data.songs.forEach((song) => {
                html = html.concat(keys.reduce((accum, current) => {
                    const placeholder = new RegExp(`{{ ${current} }}`, 'g')
                    return accum.replace(placeholder, song[current])
                }, this.listTemplate))
            })
            this.el.querySelector('#search-songs-list').innerHTML = html
        } else {
            this.el.querySelector('#success').classList.add('hidden')
            this.el.querySelector('#fail').classList.add('hidden')
        }
    }
})

const controller = new Controller({
    model,
    formView,
    resultView,
    init() {
        this.model.addListener((data) => { this.formView.render(data) })
        this.model.addListener((data) => { this.resultView.render(data) })
        this.bindEvents()
        return this.model.init()
    },
    bindEvents() {
        this.formView.el.addEventListener('submit', (event) => {
            event.preventDefault()
            const keyword = this.formView.el.querySelector('input').value.trim()
            if (keyword) this.model.fetchSongs(keyword)
        })
    }
})

controller.init()