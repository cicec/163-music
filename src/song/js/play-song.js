let { search } = window.location
if (search[0] === '?') search = search.substr(1)
const obj = {}
search.split('&').filter(v => v).forEach((item) => {
    const [key, value] = item.split('=')
    obj[key] = value
})