import axios from 'axios'

export default (request, user) => {
    return axios({
        baseURL: 'http://35.192.228.187:5000/topsecret/split/' + user,
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        data: request,
        timeout: 3000,
    }).then(({ data }) => {
        return data
    }).catch((err) => {
        console.error("Error al consumir servicio:", err)
        throw err
    })
}