import { Link, useLocation } from "react-router-dom";
import { ClipboardList, Package, FileText, Settings, LogOut } from "lucide-react";

const navItems = [
  { label: "Orders", icon: ClipboardList, href: "/orders", active: true },
  { label: "Products", icon: Package, href: "#", soon: true },
  { label: "Fee Schedules", icon: FileText, href: "#", soon: true },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-card border-r border-sidebar-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground">MedSupply Co.</div>
            <div className="text-xs text-muted-foreground">Internal Tool</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Platform
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href) && item.href !== "#";
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : item.soon
                  ? "text-muted-foreground cursor-default"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              onClick={item.soon ? (e) => e.preventDefault() : undefined}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.soon && (
                <span className="ml-auto text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  SOON
                </span>
              )}
            </Link>
          );
        })}

        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 mt-6 mb-2">
          Settings
        </div>
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
            location.pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>General</span>
        </Link>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-sidebar-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
          TC
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">Tom Cook</div>
          <div className="text-xs text-muted-foreground truncate">tom@medsupply.co</div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Log out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
