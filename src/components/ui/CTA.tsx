import React from 'react'
import { Link } from 'react-router-dom'

interface CTAProps {
    label: string,
    link: string,
    description?: string,
    icon?: React.ReactNode,
    isNew?: boolean,
    isDisabled?: boolean,
}

export default function CTA({label, description, icon, link, isDisabled}:CTAProps) {
  return (
    <Link to={link || "#"} title={description} className={`text-white flex items-center justify-center p-3 
    gap-2 text-sm font-medium hover:bg-(--primaryBlue)/80 hover:shadow-lg
    rounded-lg bg-(--primaryBlue) shadow-xs ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        {icon} {label}
    </Link>
  )
}
