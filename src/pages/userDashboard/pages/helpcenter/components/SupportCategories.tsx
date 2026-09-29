import { Card } from "../../../../../components/Card.UserDashboard";
import Icons, { type IconName } from "../../../../../utils/Icons";
import type { SupportCategory } from "../helpCenter.data";

interface SupportCategoriesProps {
  categories: SupportCategory[];
}

export default function SupportCategories({ categories }: SupportCategoriesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Card key={cat.id}>
          <div className="p-5 flex flex-col justify-between h-full space-y-3 hover:border-indigo-300 transition-colors cursor-pointer group">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-(--primaryBlue) group-hover:scale-105 transition-transform">
                <Icons name={cat.iconName as IconName} size="sm" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-(--primaryBlue) transition-colors">
                {cat.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium">
                {cat.articlesCount} topics
              </span>
              <span className="font-semibold text-(--primaryBlue) group-hover:underline">
                View →
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
