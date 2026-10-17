import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fileUrl } from "@/lib/api";
import {
  LayoutDashboard, ScanLine, Boxes, Truck, PackageCheck, ClipboardList,
  BookOpen, SprayCan, CalendarDays, Clock, BarChart3, Users, LogOut, Menu, X, ChefHat
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import NotificationsBell from "@/components/NotificationsBell";

const managerNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/traceability", label: "Traceability", icon: ScanLine },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/suppliers", label: "Suppliers & Orders", icon: Truck },
  { to: "/deliveries", label: "Deliveries", icon: PackageCheck },
  { to: "/prep", label: "Prep List", icon: ClipboardList },
  { to: "/recipes", label: "Recipes", icon: BookOpen },
  { to: "/cleaning", label: "Cleaning", icon: SprayCan },
  { to: "/roster", label: "Roster", icon: CalendarDays },
  { to: "/timesheets", label: "Timesheets", icon: Clock },
  { to: "/analytics", label: "Sales & Wastage", icon: BarChart3 },
  { to: "/staff", label: "Staff", icon: Users },
];

const staffNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/roster", label: "My Roster", icon: CalendarDays },
  { to: "/timesheets", label: "My Timesheet", icon: Clock },
];

export default function Layout({ children }) {
  const { user, logout, isManager } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = isManager ? managerNav : staffNav;

  const NavItems = () => (
    <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
      {nav.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
          data-testid={`nav-${n.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              isActive ? "brand-gradient text-white shadow-md" : "text-slate-600 hover:bg-secondary"
            }`}>
          <n.icon className="w-[18px] h-[18px]" />
          {n.label}
        </NavLink>
      ))}
    </nav>
  );

  const SideContent = () => (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-9 h-9 rounded-xl brand-gradient grid place-items-center">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-[15px] leading-tight tracking-tight" style={{ fontFamily: "Outfit" }}>CulinaryPulse</p>
          <p className="text-[11px] text-muted-foreground">Kitchen OS</p>
        </div>
      </div>
      <NavItems />
      <div className="p-3 border-t mt-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="w-9 h-9">
            <AvatarImage src={user?.photo_url ? (user.photo_url.startsWith("http") ? user.photo_url : fileUrl(user.photo_url)) : undefined} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <Badge variant="secondary" className="text-[10px] capitalize h-4 px-1.5">{user?.role}</Badge>
          </div>
          <button data-testid="logout-btn" onClick={logout} className="p-2 rounded-lg hover:bg-secondary text-slate-500">
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card fixed inset-y-0">
        <SideContent />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 flex flex-col bg-card shadow-xl">
            <SideContent />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b bg-card">
          <button data-testid="menu-toggle" onClick={() => setOpen((o) => !o)} className="p-2">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold" style={{ fontFamily: "Outfit" }}>CulinaryPulse</span>
          <div className="flex items-center gap-1">
            {isManager && <NotificationsBell idSuffix="-mobile" />}
            <button onClick={logout} className="p-2 text-slate-500"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>
        {isManager && (
          <header className="hidden lg:flex sticky top-0 z-20 items-center justify-end px-8 h-14 border-b bg-card/80 backdrop-blur">
            <NotificationsBell />
          </header>
        )}
        <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto fade-in">{children}</main>
      </div>
    </div>
  );
}
