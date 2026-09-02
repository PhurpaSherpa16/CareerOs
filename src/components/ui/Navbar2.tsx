import { Link } from 'react-router-dom'

export default function Navbar2() {
  return (
    <div>
        <Link to={'/register'} className="font-semibold text-(--secondaryBlack) hover:text-(--primaryBlack) transition-colors px-3 py-1.5 rounded-md">
            Signup
        </Link>
    </div>
  )
}
