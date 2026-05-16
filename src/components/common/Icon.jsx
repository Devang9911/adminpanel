import React from 'react'

export function Icon({icon , className}) {
  return (
    <span className="material-symbols-outlined" style={{ fontSize: "20px" , ...className }}>
      {icon}
    </span>
  )
}
