import { useState } from 'react';

export default function App (){
  const [search, setSearch] = useState("");

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center" 
    }}>

    <h1 style={{
      fontSize: "4rem", 
      fontWeight: "800", 
      letterSpacing: "0.05em",
      color: "#635959ec"
    }}>
      CourtPrice
    </h1>

    <input
        type="text"
        placeholder="Search the player"
        style={{
          backgroundColor: "#1c1717a5",
          color: "white",
          fontSize: "1.2rem",
          padding: "10px 15px",
          width: "400px",
          border: "1px solid #555",
          borderRadius: "6px",
          outline: "none"
        }}
      />

    </div>
  );
}