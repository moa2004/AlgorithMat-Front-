import React from 'react'
import "./DifficultyButtons.css"
export default function DifficultyButtons(props) {
  return (
    <div>
    <div className='DButtons' onClick={props.onClick} style={props.style}>{props.text}  </div>  
    </div>
  )
}
