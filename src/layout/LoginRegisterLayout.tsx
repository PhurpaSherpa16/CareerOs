import { Link, Outlet } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";


export default function LoginRegisterLayout() {
  return (
    <div className="bg-(--primaryBlue)  min-h-screen max-w-screen overflow-hidden grid place-items-center">
        <nav className="flex w-full mainDiv h-fit">
            <Link to="/" className="text-(--white) group flex items-center gap-2
            hover:bg-(--white)/20 transition-all rounded-full px-4 py-1">
                <FaArrowLeftLong className="group-hover:-translate-x-1 transition-all duration-300"/> Back To Home
            </Link>
        </nav>
        <div className="min-h-[60vh]">
            <Outlet/>
        </div>
    </div>
  )
}
