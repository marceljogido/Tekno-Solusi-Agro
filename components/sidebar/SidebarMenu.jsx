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
} from "@tabler/icons-react";

import SidebarItem from "./SidebarItem";
import SidebarDropdown from "./SidebarDropdown";
import SidebarGroup from "./SidebarGroup";

export default function SidebarMenu() {
  return (
    <>
      <SidebarGroup title="utama">
        <SidebarItem
          icon={IconLayoutDashboard}
          label="Dashboard"
          href="/dashboard"
        />
        <SidebarItem icon={IconListCheck} label="Tugas" href="/task" />

        <SidebarDropdown icon={IconPlant} label="Crop Production">
          <SidebarItem
            icon={IconPlant2}
            label="Media Management"
            href="/crop/media"
            variant="sub"
          />
          <SidebarItem
            variant="sub"
            label="Crop Planning"
            href="/crop/planning"
          />
          <SidebarItem
            variant="sub"
            label="Crop Tracking"
            href="/crop/tracking"
          />
          <SidebarItem
            variant="sub"
            label="Pesticide Management"
            href="/crop/pesticide"
          />
          <SidebarItem
            variant="sub"
            label="Fertilizer Management"
            href="/crop/fertilizer"
          />
          <SidebarItem
            variant="sub"
            label="Irrigation Management"
            href="/crop/irrigation"
          />
        </SidebarDropdown>

        <SidebarDropdown icon={IconGardenCart} label="Resources">
          <SidebarItem
            variant="sub"
            label="Suppliers & Orders"
            href="/resources/suppliers"
          />
          <SidebarItem
            variant="sub"
            label="Inventory System"
            href="/resources/inventory"
          />
          <SidebarItem
            variant="sub"
            label="Labor System"
            href="/resources/labor"
          />
        </SidebarDropdown>

        <SidebarItem
          icon={IconHeartRateMonitor}
          label="Monitoring"
          href="/monitoring"
        />

        <SidebarDropdown icon={IconReportAnalytics} label="Insights">
          <SidebarItem
            variant="sub"
            label="Field Activity Record"
            href="/insights/activity"
          />
          <SidebarItem
            variant="sub"
            label="Reporting"
            href="/insights/reporting"
          />
          <SidebarItem
            variant="sub"
            label="Analysis"
            href="/insights/analysis"
          />
          <SidebarItem variant="sub" label="Finance" href="/insights/finance" />
        </SidebarDropdown>
      </SidebarGroup>

      <SidebarGroup title="utilitas" withDivider>
        <SidebarItem
          icon={IconBell}
          label="Notifikasi"
          href="/notifications"
        />
        <SidebarItem icon={IconSettings} label="Pengaturan" href="/settings" />
        <SidebarItem icon={IconHelpCircle} label="Bantuan" href="/help" />
      </SidebarGroup>
    </>
  );
}
