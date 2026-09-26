import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BsFillGrid3X3GapFill, BsStars, BsLock, BsChevronDown } from "react-icons/bs";
import { AiOutlineFilePdf } from "react-icons/ai";
import { PiBagSimpleBold } from "react-icons/pi";
import { FaMoneyBills, FaCirclePlus } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";
import { MdOutlineDocumentScanner, MdOutlineSupportAgent } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { RiDeepseekFill, RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";

import CTA from "./CTA";

interface MenuItem {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  path?: string;
  new?: boolean;
  disabled?: boolean;
  items?: MenuItem[];
}

interface SidebarMenuItemProps {
  item: MenuItem;
  isSubItem?: boolean;
  menuOpen: boolean;
}

interface collopaseProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
}

interface TooltipProps {
  children: React.ReactNode;
  label: React.ReactNode;
  show?: boolean;
}

function Tooltip({ children, label, show = true }: TooltipProps) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  if (!show) return <>{children}</>;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  };

  const handleMouseLeave = () => {
    setCoords(null);
  };

  return (
    <div className="relative flex items-center justify-center w-full cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {coords && (
        <div style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          className="fixed -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 rounded-md shadow-2xl z-50 pointer-events-none whitespace-nowrap flex items-center gap-1.5 transition-opacity duration-150">
          {label}
        </div>
      )}
    </div>
  );
}

export default function UserDashboardSideBar({ menuOpen, setMenuOpen, user }: collopaseProps) {
  const handleCollpoase = () => {
    setMenuOpen((p: boolean) => !p);
  };

  const firstName = user?.firstName || "John";
  const lastName = user?.lastName || "Doe";
  const email = user?.emailAddresses[0]?.emailAddress || "N/A";
  const fullName = `${firstName} ${lastName}`;
  const initial = firstName?.slice(0, 1) + lastName?.slice(0, 1);

  return (
    <div className={`relative flex flex-col py-4 ${menuOpen ? "px-3" : "px-2"} bg-(--white) h-full border border-(--lightBlack)/30 shadow-md space-y-6 rounded-md transition-all duration-300`} >
      {/* logo */}
      <div className={`relative flex items-center ${menuOpen ? "justify-between" : "justify-center"} px-1`}>
        <Link to="/" title="CareerOs" className="relative flex items-center gap-2.5 min-w-0">
          <img src="/logo.svg" alt="logo" className="size-8 object-contain shrink-0" />
          {menuOpen && (
            <h1 className="text-(--primaryBlue) text-xl font-bold tracking-wide truncate">
              CareerOs
            </h1>
          )}
        </Link>

        <div onClick={handleCollpoase} title={menuOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          className={`absolute ${menuOpen?"-right-6":"-right-12"} cursor-pointer bg-white hover:bg-slate-200 text-(--secondaryBlack) hover:text-(--primaryBlack) p-1 rounded-md 
          border border-slate-200 shadow-2xs transition-colors shrink-0 ${!menuOpen ? "mt-1" : ""}`}>
          {menuOpen ? (<RiMenuFoldFill className="size-3" />) 
          : (<RiMenuUnfoldFill className="size-3" />)
          }
        </div>
      </div>

      {/* user details */}
      {menuOpen ? (
        <div className="bg-linear-to-r from-(--primaryBlack) to-(--primaryBlue) rounded-xl p-3.5 shadow-sm text-white space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="size-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-sm tracking-wider border border-white/30 text-white shadow-inner">
                {initial}
              </div>
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
      ) : (
        <div className="flex justify-center my-1">
          <Tooltip show={!menuOpen} label={ <div className="flex items-center gap-2">
                <span>{fullName}</span>
                <span className="text-[10px] text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  Deepseek Pro
                </span>
              </div>
            }>
            <div className="size-10 rounded-full bg-linear-to-tr from-(--primaryBlack) to-(--primaryBlue) flex items-center justify-center font-bold text-xs text-white border border-white/30 shadow-xs cursor-pointer">
              {initial}
            </div>
          </Tooltip>
        </div>
      )}

      {/* navigation */}
      <nav className="space-y-5 2xl:space-y-7 flex-1 overflow-y-auto py-1">
        {MenuList.map((section) => (
          <div key={section.title} className="space-y-1.5">
            {menuOpen ? (
              <h3 className="px-2 text-[11px] font-bold uppercase tracking-wider text-(--primaryBlack)/40">
                {section.title}
              </h3>
            ) : (
              <div className="border-t border-slate-200/80 my-2 mx-1" />
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title} item={item} menuOpen={menuOpen} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* CTA Button */}
      <div className="border-t border-(--lightBlack)/30 pt-4">
        <Tooltip show={!menuOpen} label="New Analysis">
          <CTA label={menuOpen ? "New Analysis" : ""} description="New Analysis" link="/user-dashboard" icon={<FaCirclePlus className="size-4 shrink-0" />}/>
        </Tooltip>
      </div>
    </div>
  );
}

function SidebarMenuItem({ item, isSubItem = false, menuOpen }: SidebarMenuItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const Icon = item.icon;

  // Handle nested items (group/dropdown)
  if (item.items && item.items.length > 0) {
    if (!menuOpen) {
      return (
        <>
          {item.items.map((subItem) => (
            <SidebarMenuItem key={subItem.title} item={subItem} isSubItem={true} menuOpen={menuOpen}/>
          ))}
        </>
      );
    }

    return (
      <li className="space-y-1">
        <button type="button" onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-(--secondaryBlack) hover:text-slate-900 transition-colors rounded-lg">
          <span className="flex items-center gap-2.5">
            {Icon && <Icon className="text-sm shrink-0" />}
            <span className="text-(--primaryBlack)/40">{item.title}</span>
          </span>
          <BsChevronDown className={`text-xs transition-transform duration-200 cursor-pointer ${ isOpen ? "rotate-180" : ""}`}/>
        </button>
        {isOpen && (
          <ul className="ml-3 pl-2.5 border-l border-slate-200 space-y-1">
            {item.items.map((subItem) => (
              <SidebarMenuItem key={subItem.title} item={subItem} isSubItem={true} menuOpen={menuOpen}/>
            ))}
          </ul>
        )}
      </li>
    );
  }

  // Collapsed Mode Item View with state-driven Tooltip
  if (!menuOpen) {
    const tooltipLabel = (
      <div className="flex items-center gap-1.5">
        <span>{item.title}</span>
        {item.new && (
          <span className="text-[9px] font-bold text-blue-300 bg-blue-900/80 px-1 py-0.2 rounded">
            NEW
          </span>
        )}
        {item.disabled && (
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1 py-0.2 rounded flex items-center gap-1">
            <BsLock className="text-xs text-slate-400 shrink-0" />
          </span>
        )}
      </div>
    );

    return (
      <li className="relative">
        <Tooltip show={true} label={tooltipLabel}>
          {item.disabled ? (
            <div className="flex items-center justify-center p-2.5 rounded-lg text-slate-400 cursor-not-allowed select-none bg-slate-50/60 w-full">
              {Icon && <Icon className="text-base shrink-0" />}
            </div>
          ) : (
            <NavLink to={item.path || "#"} end={item.path === "/user-dashboard" || item.path === "/"} className={({ isActive }) =>
                `flex items-center justify-center p-2.5 rounded-lg transition-all duration-150 w-full ${
                  isActive ? "bg-(--primaryBlue) text-white shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}>
              {({ isActive }) => (
                <>
                  {Icon && (<Icon className={`text-base shrink-0 ${ isActive ? "text-white" : "text-(--primaryBlack)/80"}`}/>)}
                </>
              )}
            </NavLink>
          )}
        </Tooltip>
      </li>
    );
  }

  // Handle disabled item when expanded (menuOpen is true)
  if (item.disabled) {
    return (
      <li className="relative">
        <div title={`${item.title} (Disabled)`} className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-400 cursor-not-allowed select-none bg-slate-50/60 ${ isSubItem ? "text-xs py-1.5" : ""}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && <Icon className="text-base shrink-0 text-slate-400" />}
            <span className="truncate">{item.title}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {item.new && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-200/70 text-slate-500 border border-slate-300/50">
                New
              </span>
            )}
            <BsLock className="text-xs text-(--secondaryBlack) shrink-0" />
          </div>
        </div>
      </li>
    );
  }

  // Normal active/clickable menu item when expanded (menuOpen is true)
  return (
    <li className="relative">
      <NavLink
        to={item.path || "#"}
        end={item.path === "/user-dashboard" || item.path === "/"}
        className={({ isActive }) =>`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            isSubItem ? "text-xs py-1.5" : ""} ${ isActive ? "bg-(--primaryBlue) text-white shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}>
        {({ isActive }) => (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              {Icon && (<Icon className={`text-base shrink-0 ${ isActive ? "text-white" : "text-(--primaryBlack)/80"}`}/>)}
              <span className={`${isActive ? "text-white" : "text-(--primaryBlack)/80"}`}>
                {item.title}
              </span>
            </div>

            {item.new && (
              <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0 ml-2 ${isActive
                    ? "bg-white/20 text-white" : "bg-blue-50 text-(--primaryBlue) border border-blue-100"}`}>
                New
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}

const MenuList: { title: string; items: MenuItem[] }[] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        icon: BsFillGrid3X3GapFill,
        path: "/user-dashboard",
      },
      {
        title: "Manage",
        items: [
          {
            title: "Analysis",
            icon: MdOutlineDocumentScanner,
            path: "/user-dashboard/all-analysis",
          },
          {
            title: "My Resume",
            icon: AiOutlineFilePdf,
            path: "/user-dashboard/resume",
          },
          {
            title: "Saved Jobs",
            icon: PiBagSimpleBold,
            path: "/user-dashboard/saved-jobs",
          },
        ],
      },
      {
        title: "AI Resume Builder",
        icon: BsStars,
        path: "/ai-builder",
        new: true,
        disabled: true,
      },
    ],
  },
  {
    title: "Setting",
    items: [
      {
        title: "Billing",
        icon: FaMoneyBills,
        path: "/billing",
      },
      {
        title: "Account",
        icon: VscAccount,
        path: "/account",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help Center",
        icon: MdOutlineSupportAgent,
        path: "/help",
      },
      {
        title: "FAQs",
        icon: FaQuestionCircle,
        path: "/faqs",
      },
    ],
  },
];

