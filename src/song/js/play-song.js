import AV from 'leancloud-storage'
import { Model, View, Controller } from './core/base'

const model = new Model({
    data: { isPlaying: true },
    init() { return this.fetchSong() },
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
    fetchSong() {
        const songId = this.getQueryParams().id
        const query = new AV.Query('Song')
        return query.get(songId).then((response) => {
            const data = { ...this.fetch(), song: { id: response.id, ...response.attributes } }
            this.save(data)
            return data
        })
    }
})

const view = new View({
    el: document.getElementById('player'),
    bgImg: document.getElementById('bg-img'),
    template: `
        <div id="player-inner" class="player running">
            <audio id="audio" src="{{ url }}"></audio>
            <img src="{{ cover }}" class="cover absolute-center"></img>
            <button id="play-btn" class="play-btn absolute-center hidden">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-play1"></use>
                </svg>
            </button>
        </div>
        <div class="song-info">
            <span class="name">{{ name }}</span>
            <span>-</span>
            <span class="singer">{{ singer }}</span>
            </span>
        </div>
        <div class="lyrics">暂无歌词</div>
    `,
    render(data = {}) {
        if (!this.el.innerHTML) {
            const keys = ['id', 'name', 'singer', 'url', 'cover']
            this.el.innerHTML = keys.reduce((accum, current) => {
                const placeholder = new RegExp(`{{ ${current} }}`, 'g')
                return accum.replace(placeholder, data.song[current])
            }, this.template)
            this.bgImg.src = data.song.cover
        }
        const audio = this.el.querySelector('#audio')
        if (data.isPlaying) {
            audio.play()
        } else {
            audio.pause()
        }
    }
})

const controller = new Controller({
    model,
    view,
    bindEvents() {
        const playerInner = this.view.el.querySelector('#player-inner')
        const playBtn = this.view.el.querySelector('#play-btn')
        playerInner.addEventListener('click', () => {
            const data = this.model.fetch()
            if (data.isPlaying) {
                playerInner.classList.remove('running')
                playBtn.classList.remove('hidden')
            } else {
                playerInner.classList.add('running')
                playBtn.classList.add('hidden')
            }
            this.model.save({ ...data, isPlaying: !data.isPlaying })
        })
    }
})

controller.init().then(() => {
    controller.bindEvents()
})