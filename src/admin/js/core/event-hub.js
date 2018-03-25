const eventHub = {
    events: {},
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach((func) => {
                func(data)
            })
        }
    },
    on(eventName, func) {
        if (!this.events[eventName]) this.events[eventName] = []
        this.events[eventName].push(func)
    }
}
export default eventHub