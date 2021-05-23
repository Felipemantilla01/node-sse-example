let {sessions,users, sendEventsToAll} = require('./server')

setTimeout(() => {

    users.push({firstName:'hola', lastName:'mundo'})
    sendEventsToAll({firstName:'hola', lastName:'mundo'})
}, 5000);