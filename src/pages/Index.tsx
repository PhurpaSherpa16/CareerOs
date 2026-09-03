import { Link } from 'react-router-dom'

export default function Index() {
  return (
    <div className='mainDiv min-h-screen py-16 flex flex-col gap-8'>
        <div className='space-y-2'>
          <h1>Welcome to CareerOS</h1>
          <div>
            <p>A complete ecosystem for your resume and career growth</p>
            <p>Analyze your resume, get personalized feedback, and track your progress</p>
          </div>
        </div>
        <Link to={'/analyze'} className='text-white bg-(--primaryBlue) px-4 py-2 rounded-md w-max'>Aanlyze Resume</Link>

        
    </div>
  )
}
