const express = require('express')
const app = express()
const bodyParser = require('body-parser')

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "045-1236543"
    },
    {
        id: 2,
        name: "Arto Järvinen",
        number: "041-21423123"
    },
    {
        id: 3,
        name: "Lea Kutvonen",
        number: "040-4323234"
    },
    {
        id: 4,
        name: "Martti Tienari",
        number: "09-784232"
    }
]

app.use(bodyParser.json())

//3.1
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//3.2
app.get('/info', (req, res) => {
    const info = `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date().toLocaleString()}</p>`
    res.send(info)
})

//3.3
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

//3.4
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})