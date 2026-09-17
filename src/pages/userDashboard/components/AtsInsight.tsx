import { Card } from '../../../components/Card.UserDashboard';
import { BsLightningChargeFill } from "react-icons/bs";
import Icons from '../../../utils/Icons';

interface aiInsightDataProps {
    aiInsightData?: {
        score?: number;
        impression?: string;
        impressionText?: string;
    };
}

export default function AtsInsight({ aiInsightData }: aiInsightDataProps) {
    const atsScore = aiInsightData?.score ?? 0;
    const atsImpressionText =
        aiInsightData?.impressionText ??
        "Your resume has a strong foundation, but a few targeted improvements could increase your ATS visibility.";

    const clampedScore = Math.min(100, Math.max(0, atsScore));

    return (
        <Card>
            <div className="p-5 h-full flex flex-col justify-between gap-4">
                {/* Two Column Layout (Left & Right) */}
                <div className="flex items-center justify-between gap-4 h-full">
                    
                    {/* LEFT SIDE: ATS Impression & Description */}
                    <div className="flex flex-col justify-between h-full flex-1 pr-2">
                        <div className='space-y-4'>
                            {/* Header / Title */}
                            <div className="flex items-center gap-2">
                                <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-600">
                                    <Icons name='ai' size='sm'/>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        AI Insight
                                    </span>
                                    <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                                        ATS Style Score
                                    </h3>
                                </div>
                            </div>
                            {/* Impression Text */}
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {atsImpressionText}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Battery Score Indicator */}
                    <div className="flex flex-col items-center justify-center shrink-0 pl-3 border-l border-slate-100 min-w-28">
                        {/* Battery Container */}
                        <div className="flex flex-col items-center">
                            {/* Battery Main Body Frame */}
                            <div className="relative w-14 h-30 rounded-lg border-2 border-slate-300 bg-slate-100/90 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
                                {/* Battery level tick lines on left border */}
                                <div className="absolute inset-y-0 left-1 flex flex-col justify-between py-2 z-20 pointer-events-none opacity-40">
                                    <div className="w-1 h-px bg-slate-400" />
                                    <div className="w-1.5 h-px bg-slate-400" />
                                    <div className="w-1 h-px bg-slate-400" />
                                    <div className="w-1.5 h-px bg-slate-400" />
                                    <div className="w-1 h-px bg-slate-400" />
                                </div>

                                {/* Battery Fill Bar - Gradient Bottom (Dark) to Top (Light) up to ATS score */}
                                <div className="w-full rounded-sm transition-all duration-700 ease-out bg-linear-to-t from-slate-950 via-emerald-700 to-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] relative overflow-hidden"
                                    style={{ height: `${clampedScore}%` }}>
                                    {/* Subtle gloss overlay */}
                                    <div className="absolute inset-0 bg-linear-to-r from-white/10 via-transparent to-black/20 pointer-events-none" />
                                </div>

                                {/* ATS Score Number inside the battery */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none select-none">
                                    <span className="text-base font-black tracking-tight text-(--highlightColor) drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                                        {clampedScore}
                                    </span>
                                    <span className="text-[9px] font-bold text-white uppercase tracking-tight">
                                        ATS
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Indication / Helper Text at Bottom */}
                        <div className="mt-2.5 flex items-center justify-center gap-0.5 text-center">
                            <BsLightningChargeFill className="text-amber-500 size-3 shrink-0" />
                            <span className="text-[11px] font-semibold text-slate-500 leading-tight max-w-25 text-center">
                                Average ATS score overall
                            </span>
                        </div>

                    </div>

                </div>
            </div>
        </Card>
    );
}

