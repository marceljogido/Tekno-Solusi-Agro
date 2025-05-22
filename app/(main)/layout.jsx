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
        <div className="hidden md:flex">
          <Sidebar>
            <SidebarHeader />
            <SidebarContent>
              <SidebarMenu />
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
        </div>

        {/* Main Content */}
        <main className="h-screen flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
