import { FaWandMagicSparkles } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

interface HeaderUserDashboardProps {
    title : string;
    subTitle : string;
    link: string
    buttonLabel : string
}

export default function HeaderUserDashboard({title, subTitle, link, buttonLabel}:HeaderUserDashboardProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
            <h1 className="h1">{title}</h1>
            <p className="text-(--secondaryBlack) text-xs sm:text-sm mt-1">
            {subTitle}
            </p>
        </div>
        <div className="flex items-center gap-3">
            <Link to={link} className="px-4 py-2 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
                <FaWandMagicSparkles className="w-3.5 h-3.5" />
                {buttonLabel}
            </Link>
        </div>
    </header>
  )
}
