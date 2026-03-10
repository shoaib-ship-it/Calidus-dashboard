import { useState } from "react";
import { useRole, useNavigation } from "@/App";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  Shield,
  LayoutDashboard,
  Users,
  Package,
  Star,
  FolderTree,
  UserCircle,
  BarChart3,
  Building2,
  Inbox,
  FileText,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

// Navigation items for each role
const navigationConfig = {
  admin: [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "suppliers", label: "Supplier Management", icon: Building2 },
    { id: "products", label: "Product Management", icon: Package },
    { id: "ratings", label: "Ratings Moderation", icon: Star },
    { id: "categories", label: "Category Management", icon: FolderTree },
    { id: "buyers", label: "Buyer Management", icon: Users },
    { id: "analytics", label: "Platform Insights", icon: BarChart3 },
  ],
  supplier: [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Company Profile", icon: Building2 },
    { id: "products", label: "Product Management", icon: Package },
    { id: "enquiries", label: "Enquiries", icon: Inbox },
    { id: "ratings", label: "Ratings & Reviews", icon: Star },
  ],
  buyer: [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "enquiries", label: "My Enquiries", icon: Inbox },
    { id: "ratings", label: "Ratings", icon: Star },
    { id: "profile", label: "Profile Management", icon: UserCircle },
  ],
};

const roleLabels = {
  admin: "Platform Administrator",
  supplier: "Orion Defense Systems",
  buyer: "James Mitchell",
};

const roleIcons = {
  admin: Shield,
  supplier: Building2,
  buyer: UserCircle,
};

export const DashboardShell = ({ children }) => {
  const { currentRole, setCurrentRole } = useRole();
  const { activeSection, setActiveSection } = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = navigationConfig[currentRole] || [];
  const RoleIcon = roleIcons[currentRole];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:flex flex-col bg-card/50 backdrop-blur-md border-r border-border transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-tight font-['Barlow_Condensed'] uppercase">
                DefenseLink
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8"
            data-testid="sidebar-toggle-btn"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  data-testid={`nav-${item.id}`}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {sidebarOpen && isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Role Info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-sm bg-primary/20 flex items-center justify-center">
                <RoleIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {currentRole}
                </p>
                <p className="text-sm font-medium truncate">
                  {roleLabels[currentRole]}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg tracking-tight font-['Barlow_Condensed'] uppercase">
                  DefenseLink
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8"
                data-testid="mobile-menu-close-btn"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 py-4 h-[calc(100vh-4rem)]">
              <nav className="space-y-1 px-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      data-testid={`mobile-nav-${item.id}`}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-md border-b border-border">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(true)}
            data-testid="mobile-menu-btn"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Role Selector */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground/70 mb-1">
                Select Role
              </p>
              <Select value={currentRole} onValueChange={setCurrentRole}>
                <SelectTrigger 
                  className="w-[180px] h-9 bg-black/20 border-border rounded-sm text-sm"
                  data-testid="role-selector"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin" data-testid="role-option-admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="supplier" data-testid="role-option-supplier">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>Supplier</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="buyer" data-testid="role-option-buyer">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      <span>Buyer</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Global Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 w-48 lg:w-64 h-9 bg-black/20 border-border rounded-sm"
                data-testid="global-search-input"
              />
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9"
              data-testid="notifications-btn"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive">
                3
              </Badge>
            </Button>

            {/* Messages */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9"
              data-testid="messages-btn"
            >
              <MessageSquare className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">
                5
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-9 gap-2 px-2"
                  data-testid="user-menu-btn"
                >
                  <div className="h-7 w-7 rounded-sm bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">
                    {roleLabels[currentRole].split(" ")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="user-menu-profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="user-menu-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" data-testid="user-menu-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
