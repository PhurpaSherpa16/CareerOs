import { Outlet, useLocation } from 'react-router-dom'
import UserDashboardSideBar from '../components/ui/UserDashboardSideBar'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/react'

export default function UserDashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(true)
  const {isLoaded, user} = useUser()
  const location = useLocation()
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname])
    

  if(!isLoaded) return <div className="grid gap-2 place-content-center h-screen w-screen">Loading Please Wait...</div>
  
  return (
    <div className="flex h-screen gap-8 w-screen overflow-hidden bg-(--lightBlue) relative">
        <aside className={`relative z-50 shrink-0 p-2 transition-all duration-300 ease-in-out ${menuOpen ? "w-64 2xl:w-72" : "w-20"}`}>
            <UserDashboardSideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user}/>
        </aside>

        <main ref={mainRef} className="relative min-w-0 flex-1 h-screen overflow-y-auto">
            <Outlet />
        </main>
    </div>
  )
}
