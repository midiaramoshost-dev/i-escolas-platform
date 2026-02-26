import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  FileText,
  CreditCard,
  Apple,
  Baby,
  LogOut,
  UserCircle,
  UserPlus,
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
import { useAuth } from "@/contexts/AuthContext";
import { PlatformLogo } from "@/components/PlatformLogo";

const menuItems = [
  {
    title: "Início",
    icon: LayoutDashboard,
    url: "/responsavel/dashboard",
  },
  {
    title: "Meus Filhos",
    icon: Users,
    url: "/responsavel/filhos",
  },
  {
    title: "Notas",
    icon: ClipboardCheck,
    url: "/responsavel/notas",
  },
  {
    title: "Frequência",
    icon: Calendar,
    url: "/responsavel/frequencia",
  },
  {
    title: "Tarefas",
    icon: FileText,
    url: "/responsavel/tarefas",
  },
  {
    title: "Comunicados",
    icon: MessageSquare,
    url: "/responsavel/comunicados",
  },
  {
    title: "Maternal",
    icon: Baby,
    url: "/responsavel/maternal",
  },
  {
    title: "Nutrição",
    icon: Apple,
    url: "/responsavel/nutricao",
  },
  {
    title: "Financeiro",
    icon: CreditCard,
    url: "/responsavel/financeiro",
  },
  {
    title: "Meu Perfil",
    icon: UserCircle,
    url: "/responsavel/perfil",
  },
];

export function ResponsavelSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  // Heurística leve (sem mexer no backend):
  // se o usuário for "escola" ou tiver flag "isGeneralManager" no objeto, exibimos o bloco.
  const isResponsavelGeral =
    user?.role === "escola" ||
    Boolean((user as any)?.isGeneralManager) ||
    Boolean((user as any)?.responsavelGeral);

  const isActive = (url: string) => location.pathname === url;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/responsavel/dashboard" className="flex items-center gap-3">
          <PlatformLogo
            size="md"
            showText={!isCollapsed}
            subtitle="Portal do Responsável"
            icon={<Users className="h-5 w-5 text-white" />}
            iconClassName="bg-gradient-to-br from-violet-500 to-purple-600"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Perfil do Responsável */}
        {!isCollapsed && (
          <div className="px-3 pb-4 mb-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-violet-500 text-white">
                  {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "RS"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">{user?.name || "Responsável"}</span>
                <span className="text-xs text-sidebar-foreground/60">2 dependentes</span>
              </div>
            </div>
          </div>
        )}

        {/* Acesso profissional para Responsável Geral */}
        {isResponsavelGeral && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider mb-2">
              Gestão
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Criar usuários por departamento"
                    onClick={() => navigate("/escola/usuarios/departamentos")}
                  >
                    <UserPlus className="h-5 w-5" />
                    {!isCollapsed && (
                      <div className="flex flex-col items-start leading-tight">
                        <span>Criar usuários</span>
                        <span className="text-[11px] text-sidebar-foreground/60">por departamento</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider mb-2">
            Menu
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
