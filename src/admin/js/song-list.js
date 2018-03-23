import AV from 'leancloud-storage'

const view = {
    el: document.getElementById('song-list'),
    template: `
        <li><button>__songName__</button></li>
    `,
    render(data) {
        
    }
}

const model = {
    data: {},
    fetch() {
        const query = new AV.Query('Song')
        return query.find().then((data) => {
            console.log(data)
        })
    }
}

const controller = {
    view: null,
    model: null,
    init() {
        this.view = view
        this.model = model
        this.view.render()
    }
}