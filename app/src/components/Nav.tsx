import React from 'react'


const Nav = () => {
  return (
    <div className="w-full bg-gray-200 h-12 flex justify-between items-center p-4">
      <div className="flex gap-2">
        <a href='/'>Home</a>
        <a href='/manage'>Dashboard</a> 
      </div>
    </div>
  )
}

export default Nav
