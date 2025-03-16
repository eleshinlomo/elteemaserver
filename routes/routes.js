const express = require('express')
const router = express.Router()


router.get('/', (req, res)=>{
    res.send('Hello World')
})

router.get('/api', (req, res)=>{
    const data = {
        'name': 'Oluwaseun',
        'lastname': 'Olatunji',
        'ok': true
    }

    res.json(data)
})

module.exports = router;
