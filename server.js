const app = require('./app')
require('dotenv').config()

const port = process.env.PORT || 9999

app.listen(port, () => {
    console.log(`server is listen on port ${port}`)
})

