import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {

  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchName, setSearchName ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ styleName, setStyleName ] = useState(null)
  
  useEffect(() => {
      personService
        .getAll()
        .then(response => {
          setPersons(response.data)
        })
  }, [])

  const addPerson = (event) => {
      event.preventDefault()
      const personObject = {
          name: newName,
          number: newNumber
      }
      let personExists = persons.find(person => person.name.toLowerCase() === personObject.name.toLowerCase())
      if (personExists) {
          if (window.confirm(`Henkilö ${personObject.name} on jo luettelossa. Korvataanko henkilön numero uudella?`)) {
            personService
              .update(personExists.id, personObject)
              .then(returnedPerson => {
                setPersons(persons.map(person => person.id !== personObject.id ? person : returnedPerson))
              })
              .catch(error => {
                setPersons(persons.filter(p => p.id !== personExists.id))
                setErrorMessage(`Henkilö ${personExists.name} on jo poistettu puhelinluettelosta`)
                setStyleName('error')
                setTimeout(() => {
                  setErrorMessage(null)
                }, 5000)
              })
            personExists.number = newNumber
            setPersons(persons)
            setErrorMessage(
              `Henkilön ${personExists.name} numeroa muutettu`
            )
            setStyleName('notification')
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          }
      } else {
        personService
          .create(personObject)
          .then(response => {
            setPersons(persons.concat(response.data))
            setNewName('')
            setNewNumber('')
          })
        setErrorMessage(
          `Henkilö ${personObject.name} lisätty puhelinluetteloon`
        )
        setStyleName('notification')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Poistetaanko henkilö ${person.name} puhelinluettelosta?`)) {
      personService
        .deleteObject(person.id)
      const newPersons = persons.filter(p=>p.id !== person.id)
      setPersons(newPersons)
      setErrorMessage(
        `Henkilön ${person.name} numero poistettu`
      )
      setStyleName('notification')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleNameChange = (event) => {
      setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
  }

  const handleSearchNameChange = (event) => {
      setSearchName(event.target.value)
  }

  const personsToShow = searchName.length === 0
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(searchName.toLowerCase()))

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Notification message={errorMessage} styleName={styleName} />
      <Filter searchName={searchName} handleSearchNameChange={handleSearchNameChange} />
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numerot</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App