import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  UserCircle,
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
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (url: string) => location.pathname === url;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/responsavel/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
            <Users className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">
                Portal do Responsável
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                i ESCOLAS
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Perfil do Responsável */}
        {!isCollapsed && (
          <div className="px-3 pb-4 mb-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-violet-500 text-white">MS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">Maria Silva</span>
                <span className="text-xs text-sidebar-foreground/60">2 dependentes</span>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider mb-2">
            Menu
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
              asChild
              className="text-sidebar-foreground/70 hover:text-destructive"
              tooltip="Sair"
            >
              <Link to="/login">
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Sair</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
