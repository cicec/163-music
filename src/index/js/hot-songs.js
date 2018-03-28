import AV from 'leancloud-storage'
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
    }
})