export default function SidebarContent({ children }) {
  return (
    <div className="py-2 flex-1 space-y-2 overflow-y-auto px-2">{children}</div>
  );
}
