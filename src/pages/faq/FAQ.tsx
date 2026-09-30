import HeaderUserDashboard from '../../components/Header.UserDashboard'
import { Heading } from '../../components/Heading.UserDashboard'
import LiveSupportChat from '../userDashboard/pages/helpcenter/components/LiveSupportChat'
import SupportCategories from '../userDashboard/pages/helpcenter/components/SupportCategories'
import {
  supportCategoriesData,
  initialChatMessages,
  quickPrompts,
} from "../userDashboard/pages/helpcenter/helpCenter.data";

import FaqSection from './components/FaqSection';

export default function FAQ() {
  return (
    <div className="mainDiv space-y-8 pb-10">
      {/* Page Header */}
      <HeaderUserDashboard
        title="FAQ"
        subTitle="Frequently Asked Questions"
      />

      {/* Frequently Asked Questions Accordion */}
      <div className="space-y-4">
        <Heading label="Frequently Asked Questions" />
        <FaqSection />
      </div>

        {/* Live Chat Section */}
      <div className="space-y-4">
        <Heading label="Live Support Assistant" />
        <LiveSupportChat initialMessages={initialChatMessages} quickPrompts={quickPrompts}/>
      </div>

      {/* Common Help Categories */}
      <div className="space-y-4">
        <Heading label="Knowledge Base & Guides" />
        <SupportCategories categories={supportCategoriesData} />
      </div>

    </div>
  )
}
