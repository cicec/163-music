import AV from 'leancloud-storage'
import { Model, View, Controller } from './core/base'

const model = new Model({
    init() { return this.fetchLists() },
    fetchLists() {
        const query = new AV.Query('Playlist')
        return query.find().then((response) => {
            const data = { ...this.fetch() }
            data.lists = []
            response.forEach((item) => {
                data.lists.push({ id: item.id, ...item.attributes })
            })
            this.save(data)
            return data
        })
    }
})

const view = new View({
    el: document.getElementById('playlists'),
    template: `
        <li>
            <a href="./playlist.html?id={{ id }}">
                <span>{{ playNumber }}</span>
                <img src="{{ cover }}" alt="">
                <p>{{ title }}</p>
            </a>
        </li>
    `,
    render(data = {}) {
        let html = ''
        data.lists.forEach((list) => {
            html = html.concat(Object.keys(list).reduce((accum, current) => {
                const placeholder = new RegExp(`{{ ${current} }}`, 'g')
                return accum.replace(placeholder, list[current])
            }, this.template))
        })
        this.el.innerHTML = html
    }
})

const controller = new Controller({
    model,
    view,
    bindEvents() {

    }
})

model.init().then(() => { controller.init() })