import { Link } from "react-router-dom";


export default function Navbar() {
    return (
        <nav className="sticky top-0 w-full min-h-full z-20 bg-(--white) border-b border-(--primaryBlack)/10 shadow-lg shadow-(--primaryBlack)/10">
            <div className="mainDiv flex justify-between items-center min-h-18">
                <Link to={'/'} className="flex gap-2 items-center">
                    <img src="/logo.svg" alt="logo" className="size-8"/>
                    <h1 className="text-xl font-bold text-(--primaryBlue)">CareerOs</h1>
                </Link>

                <div className="flex items-center gap-1">
                    <Link to={'/login'} className="font-semibold text-(--secondaryBlack) hover:text-(--primaryBlack) transition-colors px-3 py-1.5">
                        Login
                    </Link>
                    <span className="text-(--secondaryBlack)">/</span>
                    <Link to={'/register'} className="font-semibold text-(--secondaryBlack) hover:text-(--primaryBlack) transition-colors px-3 py-1.5">
                        Signup
                    </Link>
                </div>
            </div>
        </nav>
    );
}