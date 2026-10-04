import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import UserDashboardSideBar from '../components/ui/UserDashboardSideBar'
import { useState, useEffect, useRef } from 'react'
import { useUser, useClerk } from '@clerk/react'
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi'
import { FaCirclePlus } from 'react-icons/fa6'
import { RiDeepseekFill } from 'react-icons/ri'

export default function UserDashboardLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [menuOpen, setMenuOpen] = useState(window.innerWidth >= 1024)
  const [profileOpen, setProfileOpen] = useState(false)
  const { isLoaded, user } = useUser()
  const { signOut } = useClerk()
  const location = useLocation()
  const navigate = useNavigate()
  const mainRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Handle responsive resize between mobile (<1024) and desktop (>=1024)
  useEffect(() => {
    let wasDesktop = window.innerWidth >= 1024

    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024
      setIsMobile(!isDesktop)

      if (wasDesktop !== isDesktop) {
        wasDesktop = isDesktop
        setMenuOpen(isDesktop)
        setProfileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Scroll to top and close mobile menu/dropdowns on navigation
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
    if (window.innerWidth < 1024) {
      setMenuOpen(false)
    }
    setProfileOpen(false)
  }, [location.pathname])

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false)
      }
    }

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileOpen])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Sign out error:', error)
      navigate('/login', { replace: true })
    } finally {
      setProfileOpen(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="grid gap-2 place-content-center h-screen w-screen">
        Loading Please Wait...
      </div>
    )
  }

  const firstName = user?.firstName || 'John'
  const lastName = user?.lastName || 'Doe'
  const email = user?.emailAddresses?.[0]?.emailAddress || 'N/A'
  const fullName = `${firstName} ${lastName}`
  const initial =
    (firstName?.slice(0, 1) || '') + (lastName?.slice(0, 1) || '')
  const avatarUrl = user?.imageUrl

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-(--lightBlue) relative gap-0 lg:gap-8">
      {/* Top Navbar: only visible below 1024px */}
      <header className="h-14 w-full bg-white border-b border-slate-200/80 px-4 flex items-center justify-between z-50 shrink-0 lg:hidden shadow-2xs">
        {/* Left Side: Logo */}
        <Link to="/" title="CareerOs" className="flex items-center gap-2.5 min-w-0">
          <img src="/logo.svg" alt="CareerOs logo" className="size-8 object-contain shrink-0" />
          <span className="text-(--primaryBlue) text-xl font-bold tracking-wide truncate">
            CareerOs
          </span>
        </Link>

        {/* Right Side: Profile Icon & Hamburger Button */}
        <div className="flex items-center gap-3">
          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button type="button" onClick={() => setProfileOpen((prev) => !prev)}
              className="relative flex items-center justify-center size-9 rounded-full ring-2 ring-transparent hover:ring-indigo-100 transition-all focus:outline-hidden cursor-pointer"
              title="Profile menu" aria-label="Profile menu">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="size-8 rounded-full object-cover border border-slate-200 shadow-2xs" />
              ) : (
                <div className="size-8 rounded-full bg-linear-to-tr from-(--primaryBlack) to-(--primaryBlue) flex items-center justify-center font-bold text-xs text-white shadow-2xs">
                  {initial || 'U'}
                </div>
              )}
            </button>

            {/* Profile Dropdown Card */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 px-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Details Header */}
                <div className="bg-linear-to-r from-(--primaryBlack) to-(--primaryBlue) rounded-xl p-3.5 text-white space-y-3 mb-2 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      {avatarUrl ? (<img src={avatarUrl} alt={fullName} className="size-11 rounded-full object-cover border-2 border-white/40 shadow-inner" />) 
                        : (
                        <div className="size-11 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-sm tracking-wider border border-white/30 text-white shadow-inner">
                          {initial || 'U'}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-400 border-2 border-(--primaryBlack) rounded-full"></span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold truncate leading-tight">{fullName}</h3>
                      <p className="text-[11px] text-white/70 truncate">{email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-xs">
                      <RiDeepseekFill className="text-white text-sm shrink-0" />
                      <span className="text-[11px] font-medium tracking-wide">Deepseek Pro</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-emerald-300 tracking-wider bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  </div>
                </div>

                {/* Actions: New Analysis & Logout */}
                <div className="space-y-1.5 pt-1">
                  <Link to="/user-dashboard/new-analysis" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-(--primaryBlue) hover:bg-(--purple) transition-colors shadow-2xs">
                    <FaCirclePlus className="size-4 shrink-0" />
                    <span>New Analysis</span>
                  </Link>

                  <button type="button" onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 transition-colors border border-rose-200/60 cursor-pointer">
                    <FiLogOut className="size-4 shrink-0 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button type="button" onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            title={menuOpen ? 'Close Sidebar' : 'Open Sidebar'} aria-label={menuOpen ? 'Close Sidebar' : 'Open Sidebar'}>
            {menuOpen ? <FiX className="size-6" /> : <FiMenu className="size-6" />}
          </button>
        </div>
      </header>

      {/* Black/20 Overlay on mobile when sidebar is open: below and behind top navbar */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} className="fixed top-14 inset-x-0 bottom-0 bg-black/20 z-30 lg:hidden backdrop-blur-2xs transition-opacity duration-300" aria-hidden="true"/>
      )}

      {/* Sidebar:
          - Mobile (< 1024px): fixed overlay drawer starting below top navbar (top-14), z-40 (behind top navbar z-50)
          - Desktop (>= 1024px): relative in layout flow with collapsible width
      */}
      <aside className={`fixed top-14 left-0 bottom-0 z-40 p-2 transition-all duration-300 ease-in-out lg:static lg:top-auto lg:bottom-auto lg:h-full lg:translate-x-0 lg:z-30 lg:shrink-0
          ${ menuOpen ? 'translate-x-0 w-72 sm:w-80 lg:w-64 2xl:lg:w-72' : '-translate-x-full lg:w-20' }`}>
        <UserDashboardSideBar
          menuOpen={isMobile ? true : menuOpen}
          setMenuOpen={setMenuOpen}
          user={user}
        />
      </aside>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="relative min-w-0 flex-1 h-full overflow-y-auto lg:h-screen px-4 lg:px-0"
      >
        <Outlet />
      </main>
    </div>
  )
}
