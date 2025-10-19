import React from "react";
import "../Profile Componennts/ProfileCard.css";
export default function ProfileCard(props) {
  return (
      <div className="card" style={props.style}>
     <div className="stats" >
          <div className="stat" style={{padding:"35px"}}>
            <h4 style={{width: "100%", height: "70%"}}>{props.text}</h4>
            <p style={{width: "100%", height: "30%" ,color:"black"}}>{props.num}</p>
          </div>
          
        </div>
      </div>
  );
}
