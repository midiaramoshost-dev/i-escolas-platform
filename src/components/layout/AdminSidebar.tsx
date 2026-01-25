import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  Users,
  Shield,
  LogOut,
  Layers,
  DollarSign,
  Activity,
  Puzzle,
  ClipboardList,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin/dashboard",
  },
  {
    title: "Escolas",
    icon: Building2,
    url: "/admin/escolas",
  },
  {
    title: "Planos",
    icon: Layers,
    url: "/admin/planos",
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    url: "/admin/financeiro",
  },
  {
    title: "Monitoramento",
    icon: Activity,
    url: "/admin/monitoramento",
  },
  {
    title: "Módulos",
    icon: Puzzle,
    url: "/admin/modulos",
  },
  {
    title: "Usuários",
    icon: Users,
    url: "/admin/usuarios",
  },
  {
    title: "Log de Atividades",
    icon: ClipboardList,
    url: "/admin/log-atividades",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/admin/configuracoes",
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  const isActive = (url: string) => location.pathname === url;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-red-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">
                ADM Master
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                i ESCOLAS
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Perfil do Admin */}
        {!isCollapsed && (
          <div className="px-3 pb-4 mb-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-rose-500 text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SA'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">{user?.name || 'Admin'}</span>
                <Badge className="bg-rose-500/10 text-rose-500 text-[10px] w-fit">
                  Master
                </Badge>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider mb-2">
            Gestão
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/70 hover:text-destructive cursor-pointer"
              tooltip="Sair"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
