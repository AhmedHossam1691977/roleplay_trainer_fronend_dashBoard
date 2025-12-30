import React from 'react'
import Link from 'next/link'

export default function Upgrade() {
  return (
    <>
      <div className="bg-red-600 text-white text-center py-2 px-4 fixed top-0 right-0 left-0 lg:left-64 z-50 flex justify-center items-center gap-4 shadow-md">
        <span className="font-medium text-sm md:text-base">
          Your account is not active. Please upgrade to access all features.
        </span>
        
      
        <Link 
          href="/plans" 
          className="bg-white text-red-600 px-4 py-1 rounded-md text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm"
        >
          Upgrade
        </Link>
      </div>
    </>
  )
}