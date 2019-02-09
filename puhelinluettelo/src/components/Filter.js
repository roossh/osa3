import React from 'react'

const Filter = ({searchName, handleSearchNameChange}) => {
    return(
        <p>rajaa näytettäviä: <input value={searchName} onChange={handleSearchNameChange}/></p>
    )
}

export default Filter