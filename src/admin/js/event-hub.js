const eventHub = {
    events: {},
    emit(eventName, data) {
        Object.keys(this.events).forEach((key) => {
            this.events[key].forEach((func) => {
                func(data)
            })
        })
    },
    on(eventName, func) {
        if (!this.events[eventName]) this.events[eventName] = []
        this.events[eventName].push(func)
    }
}
export default eventHub