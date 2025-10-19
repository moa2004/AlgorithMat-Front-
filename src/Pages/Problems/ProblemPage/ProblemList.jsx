import React from 'react'
import NavProblem from '../../../Components/Problem Components/NavProblem'
import { Outlet } from 'react-router-dom'

export default function ProblemList() {
  return (
    <div
      className="ProblemListMain"
      style={{ width: "100%", display: "garde" }}
    >
      <div
        style={{
          width: "93%",
          background: "#f8f8f8",
          // marginTop: "10px",
          height: "auto",
          // marginBottom: "10px",
        }}
      >
        <NavProblem />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
         <Outlet/>
         
        </div>
      </div>
    </div>
  )
}
