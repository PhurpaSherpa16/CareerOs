import React from 'react'

export const Card = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 h-full">
      {children}
    </div>
  )
}
