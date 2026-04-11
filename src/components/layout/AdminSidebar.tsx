import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Settings,
  Users,
  Shield,
  LogOut,
  Layers,
  Activity,
  Puzzle,
  ClipboardList,
  Headset,
  UserCog,
  HeartPulse,
  Landmark,
  FileLock2,
  Crown,
  Briefcase,
  DollarSign,
  Clock,
  Receipt,
  Megaphone,
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
import { PlatformLogo } from "@/components/PlatformLogo";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin/dashboard",
  },
  {
    title: "Dashboard CEO",
    icon: Crown,
    url: "/admin/dashboard#ceo",
  },
  {
    title: "Analytics (SaaS)",
    icon: BarChart3,
    url: "/admin/dashboard#analytics",
  },
  {
    title: "Escolas",
    icon: Building2,
    url: "/admin/escolas",
  },
  {
    title: "Financeiro",
    icon: Landmark,
    url: "/admin/dashboard#financeiro",
  },
  {
    title: "Cobranças",
    icon: Receipt,
    url: "/admin/cobrancas",
  },
  {
    title: "Planos",
    icon: Layers,
    url: "/admin/planos",
  },
  {
    title: "Suporte (Help Desk)",
    icon: Headset,
    url: "/admin/dashboard#suporte",
  },
  {
    title: "Retenção (Anti-churn)",
    icon: HeartPulse,
    url: "/admin/dashboard#retencao",
  },
  {
    title: "RBAC / Permissões",
    icon: UserCog,
    url: "/admin/usuarios?tab=rbac",
  },
  {
    title: "Governança / LGPD",
    icon: FileLock2,
    url: "/admin/dashboard?tab=governanca",
  },
  {
    title: "Monitoramento",
    icon: Activity,
    url: "/admin/monitoramento",
  },
  {
    title: "Módulos",
    icon: Puzzle,
    url: "/admin/escolas?tab=modulos",
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
  {
    title: "Anunciantes",
    icon: Megaphone,
    url: "/admin/anunciantes",
  },
];

const adminItems = [
  {
    title: "Folha de Pagamento",
    icon: DollarSign,
    url: "/admin/folha-pagamento",
  },
  {
    title: "Presença Funcionários",
    icon: Clock,
    url: "/admin/presenca-funcionarios",
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  const normalize = (url: string) => url.split("?")[0].split("#")[0];
  const isActive = (url: string) => location.pathname === normalize(url);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <PlatformLogo
            size="md"
            showText={!isCollapsed}
            subtitle="ADM Master"
            icon={<Shield className="h-5 w-5 text-white" />}
          />
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
                  {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "SA"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">{user?.name || "Admin"}</span>
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
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider mb-2">
            Administrativo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
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
