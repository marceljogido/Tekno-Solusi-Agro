import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import Sidebar from "@/components/sidebar/Sidebar";
import SidebarHeader from "@/components/sidebar/SidebarHeader";
import SidebarContent from "@/components/sidebar/SidebarContent";
import SidebarFooter from "@/components/sidebar/SidebarFooter";
import SidebarMenu from "@/components/sidebar/SidebarMenu";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

export default function MainLayout({ children }) {
  return (
    <SidebarProvider>
      {/* Mobile Overlay Sidebar */}
      <MobileSidebar />

      {/* Desktop Sidebar */}
      <div className="flex min-h-screen w-full">
        <div className="fixed hidden md:flex">
          <Sidebar>
            <SidebarHeader />
            <SidebarContent>
              <SidebarMenu />
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
        </div>

      {/* biar scrollbarnya keliatan */}
        <div className="hidden md:flex">
          <Sidebar>
          </Sidebar>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-slate-50">{children}</main>
      </div>
    </SidebarProvider>
  );
}
