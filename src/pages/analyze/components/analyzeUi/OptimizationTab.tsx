import { FiCheckSquare } from 'react-icons/fi'

export default function OptimizationTab({activeTab, checkedItems, toggleCheck}:{activeTab: string, checkedItems: Record<string, boolean>, toggleCheck: (id: string) => void}) {
  return (
    <div>
        {activeTab === "checklist" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FiCheckSquare className="text-emerald-600" /> Resume Optimization Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Check off items as you revise your resume to guarantee maximum ATS match score.
              </p>
            </div>

            <div className="space-y-3">
              {list.map((task:any) => {
                const isChecked = !!checkedItems[task.id];
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleCheck(task.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isChecked
                        ? "bg-emerald-50/50 border-emerald-200 opacity-75"
                        : "bg-slate-50/60 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-(--primaryBlue) focus:ring-(--primaryBlue) cursor-pointer"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${isChecked ? "line-through text-slate-500" : "text-slate-900"}`}>
                          {task.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{task.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const list = [
            {
                id: "item-1",
                title: "Add Next.js Experience Bullet",
                desc: "Mention any Next.js projects or Server Side Rendering experience under your skills/projects section.",
                category: "Preferred Skill"
            },
            {
                id: "item-2",
                title: "Include Testing Framework Keywords",
                desc: "Add Jest, React Testing Library, or Cypress keywords if you have practical testing experience.",
                category: "Missing Skill"
            },
            {
                id: "item-3",
                title: "Explicitly List HTML & CSS",
                desc: "Ensure foundational web keywords (HTML5, CSS3, Flexbox/Grid) are listed explicitly alongside Tailwind CSS.",
                category: "Keyword Density"
            },
            {
                id: "item-4",
                title: "Quantify Experience Accomplishments",
                desc: "Include metrics like 'improved performance by 25%' or 'built 10+ reusable components'.",
                category: "Formatting & Impact"
            }
        ]
