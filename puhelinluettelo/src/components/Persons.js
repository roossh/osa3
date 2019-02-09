import React from 'react'
import Person from './Person'

const Persons = ({persons, deletePerson}) => {
    const rows = () => persons.map(person =>
    <Person person={person} key={person.name} deletePerson={deletePerson} />)
    return (
        <div>
        {rows()}
        </div>
    )
}

export default Persons