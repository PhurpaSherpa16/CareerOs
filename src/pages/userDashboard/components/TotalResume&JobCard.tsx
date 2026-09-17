import { Card } from "../../../components/Card.UserDashboard";

export default function TotalResumeJobCard({totalResume=10, totalJobSaved=10}: {totalResume: number, totalJobSaved: number}) {
  return (
    <Card>
        <div className="flex justify-between">
            <div className="flex items-center gap-6 px-6 py-4 w-fit">
                <div className="w-fit grid place-content-center">
                    <h3 className="text-2xl font-bold text-center">{totalResume || 10}</h3>
                </div>
                <div className="w-fit">
                    <h3 className="text-sm tracking-wide text-slate-400">Resume <br /> Upload</h3>
                </div>
            </div>
            <div className="border-r border-slate-200" />
            <div className="flex items-center gap-6 px-6 py-4 w-fit">
                <div className="w-fit grid place-content-center">
                    <h3 className="text-2xl font-bold text-center">{totalJobSaved || 10}</h3>
                </div>
                <div className="w-fit">
                    <h3 className="text-sm tracking-wide text-slate-400">Jobs <br /> Saved</h3>
                </div>
            </div>
        </div>
    </Card>
  )
}
