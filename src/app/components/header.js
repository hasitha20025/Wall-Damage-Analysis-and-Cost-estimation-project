import React from 'react'

export default function Header() {
  return (
    <div className="bg-primary fixed top-0 left-0 w-full text-white py-4 text-center shadow-md z-50">
      <h1 className="text-2xl font-bold md:text-3xl relative">
        Wall Damage Analysis and Cost Estimation
        <a href='#settings'  className="absolute top-0 right-0 mr-4 cursor-pointer">
          ⚙️
        </a>
      </h1>
    </div>
  )
}
