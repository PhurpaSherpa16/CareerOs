import React from 'react'
import { PiHandbagSimpleBold, PiHandbagSimpleFill } from 'react-icons/pi'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import { FaEye, FaFilePdf } from 'react-icons/fa'
import { HiMiniSparkles } from 'react-icons/hi2'
import { IoShieldCheckmarkSharp } from 'react-icons/io5'
import * as SiIcons from 'react-icons/si'
import { MdOutlineFlashOn } from "react-icons/md";
import { GoAlert } from "react-icons/go";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FiBarChart2, FiFileText, FiBriefcase } from 'react-icons/fi';
import { LuScanSearch } from "react-icons/lu";



const IconList = {
    job: PiHandbagSimpleBold,
    jobFill: PiHandbagSimpleFill,
    office: HiOutlineBuildingOffice2,
    resume: FaFilePdf,
    ai: HiMiniSparkles,
    shield: IoShieldCheckmarkSharp,
    light: MdOutlineFlashOn,
    alert: GoAlert,
    analysis: MdOutlineDocumentScanner,
    report: FiBarChart2,
    resumeIcon: FiFileText,
    jobIcon: FiBriefcase,
    eye: FaEye,
    scan: LuScanSearch,
}

type IconName = keyof typeof IconList

type IconsProps = {
    name?: IconName,
    size?: 'lg' | 'md' | 'sm' | 'xs',
    logo?: string,
}

export default function Icons({ name = 'office', logo, size = 'sm' }: IconsProps) {
    const iconSizeClass = {
        lg: 'size-8',
        md: 'size-6',
        sm: 'size-4',
        xs: 'size-3'
    }[size]

    if (logo) {
        const cleanLogo = logo.trim()
        let formattedName = cleanLogo
            .replace(/[\.\-\_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
            .replace(/^(.)/, (c) => c.toUpperCase())

        if (!formattedName.startsWith('Si')) {
            formattedName = `Si${formattedName}`
        }

        const iconsRecord = SiIcons as Record<string, React.ComponentType<{ className?: string; color?: string }>>
        
        let SiComponent = iconsRecord[formattedName]

        if (!SiComponent) {
            const target = formattedName.toLowerCase()
            const matchedKey = Object.keys(SiIcons).find(k => k.toLowerCase() === target)
            if (matchedKey) {
                SiComponent = iconsRecord[matchedKey]
            }
        }

        if (!SiComponent) {
            const lowerLogo = cleanLogo.toLowerCase().replace(/[^a-z0-9]/g, '')
            const aliasMap: Record<string, string> = {
                'nextjs': 'SiNextdotjs',
                'next.js': 'SiNextdotjs',
                'reactjs': 'SiReact',
                'vuejs': 'SiVuedotjs',
                'nodejs': 'SiNodedotjs',
                'expressjs': 'SiExpress',
                'tailwindcss': 'SiTailwindcss',
                'tailwind': 'SiTailwindcss',
            }
            if (aliasMap[lowerLogo]) {
                SiComponent = iconsRecord[aliasMap[lowerLogo]]
            }
        }

        if (SiComponent) {
            return <SiComponent className={iconSizeClass} />
        }
    }

    const Icon = IconList[name] || IconList.office

    return <Icon className={iconSizeClass} />
}



