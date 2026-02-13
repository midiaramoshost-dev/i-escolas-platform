import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  Settings,
  School,
  ChevronDown,
  LogOut,
  DollarSign,
  Briefcase,
  MessageSquare,
  FileText,
  FileUp,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/escola/dashboard",
  },
  {
    title: "Gestão Escolar",
    icon: School,
    submenu: [
      { title: "Turmas", url: "/escola/turmas" },
      { title: "Séries", url: "/escola/series" },
      { title: "Disciplinas", url: "/escola/disciplinas" },
      { title: "Calendário", url: "/escola/calendario" },
    ],
  },
  {
    title: "Pessoas",
    icon: Users,
    submenu: [
      { title: "Professores", url: "/escola/professores" },
      { title: "Alunos", url: "/escola/alunos" },
      { title: "Responsáveis", url: "/escola/responsaveis" },
      { title: "Funcionários", url: "/escola/funcionarios" },
    ],
  },
  {
    title: "Acadêmico",
    icon: GraduationCap,
    submenu: [
      { title: "Diário de Classe", url: "/escola/diario" },
      { title: "Notas", url: "/escola/notas" },
      { title: "Frequência", url: "/escola/frequencia" },
      { title: "Boletins", url: "/escola/boletins" },
    ],
  },
  {
    title: "Administrativo",
    icon: Briefcase,
    submenu: [
      { title: "Contas a Pagar", url: "/escola/contas-pagar" },
      { title: "Contas a Receber", url: "/escola/contas-receber" },
      { title: "Estoque", url: "/escola/estoque" },
      { title: "Recibos", url: "/escola/recibos" },
      { title: "Contratos", url: "/escola/contratos" },
      { title: "Importar Dados", url: "/escola/importar-dados" },
    ],
  },
  {
    title: "Comunicação",
    icon: MessageSquare,
    url: "/escola/comunicados",
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    url: "/escola/financeiro",
  },
  {
    title: "Relatórios",
    icon: FileText,
    url: "/escola/relatorios",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/escola/configuracoes",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { logout } = useAuth();
  const isCollapsed = state === "collapsed";
  const [openMenus, setOpenMenus] = useState<string[]>([
    "Gestão Escolar",
    "Pessoas",
    "Acadêmico",
  ]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (url: string) => location.pathname === url;
  const isSubmenuActive = (submenu: { url: string }[]) =>
    submenu.some((item) => location.pathname === item.url);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/escola/dashboard" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-violet-600 shadow-md ring-1 ring-primary/20">
            <School className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-[1px]">
                <span className="text-lg font-light italic text-primary tracking-tight">i</span>
                <span className="text-[15px] font-bold tracking-[0.12em] text-sidebar-foreground">ESCOLAS</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/50">
                Gestão Escolar
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
                item.submenu ? (
                  <Collapsible
                    key={item.title}
                    open={openMenus.includes(item.title)}
                    onOpenChange={() => toggleMenu(item.title)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full justify-between",
                            isSubmenuActive(item.submenu) &&
                              "bg-sidebar-accent text-sidebar-primary"
                          )}
                          tooltip={item.title}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </div>
                          {!isCollapsed && (
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                openMenus.includes(item.title) && "rotate-180"
                              )}
                            />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(subItem.url)}
                              >
                                <Link to={subItem.url}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url!)}
                      tooltip={item.title}
                    >
                      <Link to={item.url!}>
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
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
