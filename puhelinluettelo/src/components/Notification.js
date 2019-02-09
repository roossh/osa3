import React from 'react'

const Notification =({message, styleName}) => {
    if (message === null) {
        return null
    }
    if (styleName==="notification") {
        const style = {
            color:'green',
            fontStyle:'italic',
            fontSize:16,
            border: 'dotted',
            margin:'10px',
            padding:10
        }
        return (
            <div style={style}>
            {message}
            </div>
        )
    } else {
        const style = {
            color:'red',
            fontStyle:'italic',
            fontSize:16,
            border: 'solid'
        }
        return (
            <div style={style}>
            {message}
            </div>
        )
    }
}
export default Notification