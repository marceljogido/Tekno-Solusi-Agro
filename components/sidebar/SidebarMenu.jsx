"use client";

import {
  IconLayoutDashboard,
  IconListCheck,
  IconPlant2,
  IconPlant,
  IconGardenCart,
  IconReportAnalytics,
  IconBell,
  IconSettings,
  IconHelpCircle,
  IconHeartRateMonitor,
  IconPhoto,
  IconCalendarEvent,
  IconChartLine,
} from "@tabler/icons-react";

import SidebarItem from "./SidebarItem";
import SidebarDropdown from "./SidebarDropdown";
import SidebarGroup from "./SidebarGroup";
import { useSidebar } from "./SidebarContext";

export default function SidebarMenu() {
  const { closeMobile } = useSidebar();

  return (
    <>
      <SidebarGroup title="utama">
        <SidebarItem
          icon={IconLayoutDashboard}
          label="Dashboard"
          href="/dashboard"
          onClick={closeMobile}
        />
        <SidebarItem icon={IconListCheck} label="Tugas" href="/task" onClick={closeMobile} />

        <SidebarDropdown icon={IconPlant} label="Crop Production">
          <SidebarItem
            icon={IconPlant2}
            label="My Crops"
            href="/crop/my-crop"
            variant="sub"
            onClick={closeMobile}
          />
          <SidebarItem
            icon={IconPhoto}
            label="Media Management"
            href="/crop/media"
            variant="sub"
            onClick={closeMobile}
          />
          <SidebarItem
            icon={IconCalendarEvent}
            variant="sub"
            label="Crop Planning"
            href="/crop/crop-planning"
            onClick={closeMobile}
          />
          <SidebarItem
            icon={IconChartLine}
            variant="sub"
            label="Crop Tracking"
            href="/crop/crop-tracking"
            onClick={closeMobile}
          />
          <SidebarItem
            variant="sub"
            label="Pesticide Management"
            href="/crop/pesticide"
            onClick={closeMobile}
          />
          <SidebarItem
            variant="sub"
            label="Fertilizer Management"
            href="/crop/fertilizer"
            onClick={closeMobile}
          />
          <SidebarItem
            variant="sub"
            label="Irrigation Management"
            href="/crop/irrigation"
            onClick={closeMobile}
          />
        </SidebarDropdown>

        <SidebarDropdown icon={IconGardenCart} label="Resources">
          <SidebarItem
            variant="sub"
            label="Suppliers & Orders"
            href="/resources/suppliers"
            onClick={closeMobile}
          />
          <SidebarItem
            variant="sub"
            label="Inventory System"
            href="/resources/inventory"
            onClick={closeMobile}
          />
          <SidebarItem
            variant="sub"
            label="Labor System"
            href="/resources/labor"
            onClick={closeMobile}
          />
        </SidebarDropdown>

        <SidebarItem
          icon={IconHeartRateMonitor}
          label="Monitoring"
          href="/monitoring"
          onClick={closeMobile}
        />

        <SidebarDropdown icon={IconReportAnalytics} label="Insights">
          <SidebarItem
            variant="sub"
            label="Field Activity Record"
            href="/insights/activity"
            onClick={closeMobile}
          />
          <SidebarItem
            variant="sub"
            label="Reporting"
            href="/insights/reporting"
            onClick={closeMobile}
          />
          <SidebarItem
            variant="sub"
            label="Analysis"
            href="/insights/analysis"
            onClick={closeMobile}
          />
          <SidebarItem variant="sub" label="Finance" href="/insights/finance" onClick={closeMobile} />
        </SidebarDropdown>
      </SidebarGroup>

      <SidebarGroup title="utilitas" withDivider>
        <SidebarItem
          icon={IconBell}
          label="Notifikasi"
          href="/notifications"
          onClick={closeMobile}
        />
        <SidebarItem icon={IconSettings} label="Pengaturan" href="/settings" onClick={closeMobile} />
        <SidebarItem icon={IconHelpCircle} label="Bantuan" href="/help" onClick={closeMobile} />
      </SidebarGroup>
    </>
  );
}
