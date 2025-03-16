const express = require('express')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3005
app.use(express.json());
app.use(express.static('public'));
const cors = require('cors')
const corsOptions = {
    origin: 'http://localhost:3000'
}
app.use(cors(corsOptions))


const routes = require('./routes/routes')
app.use('/', routes)




app.listen(PORT, ()=>{
 console.log('Server running on port', PORT)
})