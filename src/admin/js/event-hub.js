window.EventHub = {
    events: {},
    emit(eventName, data) {
        Object.keys(this.events).forEach((eventName) => {
            this.events[eventName].forEach((func) => {
                func(data)
            })
        })
    },
    on(eventName, func) {
        if (!this.events[eventName]) this.events[eventName] = []
        this.events[eventName].push(func)
        console.log(this.events)
    }
}