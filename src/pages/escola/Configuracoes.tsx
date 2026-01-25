import { useState } from "react";
import {
  School,
  Palette,
  Calendar,
  Clock,
  Save,
  Upload,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function Configuracoes() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Configure os dados e preferências da sua escola
        </p>
      </div>

      <Tabs defaultValue="instituicao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="instituicao" className="gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Instituição</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="calendario" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendário</span>
          </TabsTrigger>
          <TabsTrigger value="horarios" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Horários</span>
          </TabsTrigger>
        </TabsList>

        {/* Instituição */}
        <TabsContent value="instituicao" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Dados da Instituição
              </CardTitle>
              <CardDescription>
                Informações básicas da escola
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Escola</Label>
                  <Input
                    id="nome"
                    defaultValue="Colégio Exemplo"
                    placeholder="Nome oficial da escola"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fantasia">Nome Fantasia</Label>
                  <Input
                    id="fantasia"
                    defaultValue="Colégio Exemplo"
                    placeholder="Nome de exibição"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    defaultValue="00.000.000/0001-00"
                    placeholder="00.000.000/0001-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inep">Código INEP</Label>
                  <Input
                    id="inep"
                    placeholder="00000000"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" placeholder="00000-000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" defaultValue="São Paulo" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input
                    id="endereco"
                    defaultValue="Rua Exemplo, 123 - Centro"
                    placeholder="Rua, número, bairro"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contato
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" defaultValue="(11) 3333-4444" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" defaultValue="contato@escola.com.br" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">Website</Label>
                    <Input id="site" defaultValue="www.escola.com.br" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Identidade Visual
              </CardTitle>
              <CardDescription>
                Personalize a aparência da sua escola no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Logo da Escola</Label>
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="h-full w-full object-contain rounded-lg"
                      />
                    ) : (
                      <School className="h-10 w-10 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Enviar Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      PNG ou JPG. Máximo 2MB. Recomendado: 200x200px
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Cores da Marca</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cor-primaria">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cor-primaria"
                        defaultValue="#1d4ed8"
                        className="flex-1"
                      />
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: "#1d4ed8" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cor-secundaria">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cor-secundaria"
                        defaultValue="#0ea5e9"
                        className="flex-1"
                      />
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: "#0ea5e9" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Preferências de Exibição</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Exibir logo no cabeçalho</p>
                      <p className="text-sm text-muted-foreground">
                        Mostra o logo da escola na barra superior
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Usar cores personalizadas</p>
                      <p className="text-sm text-muted-foreground">
                        Aplica as cores da marca em elementos do sistema
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendário */}
        <TabsContent value="calendario" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Ano Letivo
              </CardTitle>
              <CardDescription>
                Configure os períodos e datas do ano letivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Ano Letivo Atual</Label>
                  <Select defaultValue="2024">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sistema de Avaliação</Label>
                  <Select defaultValue="bimestral">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bimestral">Bimestral</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Períodos Letivos</h4>
                <div className="grid gap-4">
                  {[
                    { nome: "1º Bimestre", inicio: "2024-02-05", fim: "2024-04-12" },
                    { nome: "2º Bimestre", inicio: "2024-04-22", fim: "2024-07-05" },
                    { nome: "3º Bimestre", inicio: "2024-07-22", fim: "2024-09-27" },
                    { nome: "4º Bimestre", inicio: "2024-10-07", fim: "2024-12-13" },
                  ].map((periodo, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{periodo.nome}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          defaultValue={periodo.inicio}
                          className="w-40"
                        />
                        <span className="text-muted-foreground">até</span>
                        <Input
                          type="date"
                          defaultValue={periodo.fim}
                          className="w-40"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Horários */}
        <TabsContent value="horarios" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horários de Funcionamento
              </CardTitle>
              <CardDescription>
                Configure os turnos e horários de aula
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Turnos</h4>
                <div className="grid gap-4">
                  {[
                    { nome: "Manhã", entrada: "07:00", saida: "12:00" },
                    { nome: "Tarde", entrada: "13:00", saida: "18:00" },
                    { nome: "Noite", entrada: "19:00", saida: "22:30" },
                  ].map((turno, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      <div className="w-24">
                        <p className="font-medium">{turno.nome}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Entrada</Label>
                          <Input
                            type="time"
                            defaultValue={turno.entrada}
                            className="w-28"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Saída</Label>
                          <Input
                            type="time"
                            defaultValue={turno.saida}
                            className="w-28"
                          />
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Duração das Aulas</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Duração padrão da aula</Label>
                    <Select defaultValue="50">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="50">50 minutos</SelectItem>
                        <SelectItem value="55">55 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Intervalo entre aulas</Label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutos</SelectItem>
                        <SelectItem value="10">10 minutos</SelectItem>
                        <SelectItem value="15">15 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
