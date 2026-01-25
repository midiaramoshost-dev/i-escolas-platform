import { createContext, useContext, useState, ReactNode } from "react";

export interface Aluno {
  id: string;
  matricula: string;
  nome: string;
  turma: string;
  serie: string;
  turno: string;
  responsavel: string;
  responsavelId?: string;
  telefone: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  endereco: string;
  frequencia: number;
  media: number;
  status: "regular" | "alerta" | "critico";
}

export interface Responsavel {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  parentesco: string;
  alunos: string[];
  alunoIds: string[];
  status: "ativo" | "inativo";
}

// Interface para uso nos contratos (combinação de aluno + responsável)
export interface AlunoComResponsavel {
  id: string;
  nomeAluno: string;
  matricula: string;
  dataNascimento: string;
  serieTurma: string;
  nomeResponsavel: string;
  cpfResponsavel: string;
  enderecoResponsavel: string;
  telefoneResponsavel: string;
  emailResponsavel: string;
  parentesco: string;
}

const initialAlunos: Aluno[] = [
  {
    id: "1",
    matricula: "2024001",
    nome: "Ana Beatriz Silva",
    turma: "5º Ano A",
    serie: "5º Ano",
    turno: "Manhã",
    responsavel: "Maria Silva",
    responsavelId: "1",
    telefone: "(11) 98888-1111",
    email: "maria.silva@email.com",
    cpf: "123.456.789-00",
    dataNascimento: "2014-03-15",
    endereco: "Rua das Flores, 123 - Centro",
    frequencia: 96,
    media: 8.5,
    status: "regular",
  },
  {
    id: "2",
    matricula: "2024002",
    nome: "Bruno Costa Santos",
    turma: "5º Ano A",
    serie: "5º Ano",
    turno: "Manhã",
    responsavel: "Carlos Santos",
    responsavelId: "2",
    telefone: "(11) 98888-2222",
    email: "carlos.santos@email.com",
    cpf: "234.567.890-11",
    dataNascimento: "2014-05-20",
    endereco: "Av. Principal, 456 - Jardim",
    frequencia: 88,
    media: 7.2,
    status: "alerta",
  },
  {
    id: "3",
    matricula: "2024003",
    nome: "Carolina Mendes",
    turma: "7º Ano B",
    serie: "7º Ano",
    turno: "Tarde",
    responsavel: "Paula Mendes",
    responsavelId: "3",
    telefone: "(11) 98888-3333",
    email: "paula.mendes@email.com",
    cpf: "345.678.901-22",
    dataNascimento: "2012-08-10",
    endereco: "Rua Nova, 789 - Vila Nova",
    frequencia: 94,
    media: 9.1,
    status: "regular",
  },
  {
    id: "4",
    matricula: "2024004",
    nome: "Daniel Oliveira",
    turma: "9º Ano A",
    serie: "9º Ano",
    turno: "Manhã",
    responsavel: "Roberto Oliveira",
    responsavelId: "4",
    telefone: "(11) 98888-4444",
    email: "roberto.oliveira@email.com",
    cpf: "456.789.012-33",
    dataNascimento: "2010-11-25",
    endereco: "Rua do Sol, 321 - Centro",
    frequencia: 72,
    media: 5.8,
    status: "critico",
  },
  {
    id: "5",
    matricula: "2024005",
    nome: "Eduarda Lima",
    turma: "3º Ano A",
    serie: "3º Ano",
    turno: "Manhã",
    responsavel: "Fernanda Lima",
    responsavelId: "5",
    telefone: "(11) 98888-5555",
    email: "fernanda.lima@email.com",
    cpf: "567.890.123-44",
    dataNascimento: "2016-02-14",
    endereco: "Rua Verde, 654 - Parque",
    frequencia: 98,
    media: 8.9,
    status: "regular",
  },
  {
    id: "6",
    matricula: "2024006",
    nome: "Felipe Almeida",
    turma: "1º Ano A",
    serie: "1º Ano",
    turno: "Manhã",
    responsavel: "Juliana Almeida",
    responsavelId: "6",
    telefone: "(11) 98888-6666",
    email: "juliana.almeida@email.com",
    cpf: "678.901.234-55",
    dataNascimento: "2018-06-30",
    endereco: "Av. Brasil, 987 - Centro",
    frequencia: 95,
    media: 8.0,
    status: "regular",
  },
  {
    id: "7",
    matricula: "2024007",
    nome: "Gabriela Ferreira",
    turma: "3º EM A",
    serie: "3º Médio",
    turno: "Manhã",
    responsavel: "Marcos Ferreira",
    responsavelId: "7",
    telefone: "(11) 98888-7777",
    email: "marcos.ferreira@email.com",
    cpf: "789.012.345-66",
    dataNascimento: "2007-09-18",
    endereco: "Rua da Paz, 147 - Jardim",
    frequencia: 91,
    media: 7.8,
    status: "regular",
  },
  {
    id: "8",
    matricula: "2024008",
    nome: "Henrique Souza",
    turma: "7º Ano B",
    serie: "7º Ano",
    turno: "Tarde",
    responsavel: "Luciana Souza",
    responsavelId: "8",
    telefone: "(11) 98888-8888",
    email: "luciana.souza@email.com",
    cpf: "890.123.456-77",
    dataNascimento: "2012-12-05",
    endereco: "Rua Central, 258 - Vila",
    frequencia: 85,
    media: 6.5,
    status: "alerta",
  },
  {
    id: "9",
    matricula: "2024009",
    nome: "Lucas Mendes",
    turma: "4º Ano A",
    serie: "4º Ano",
    turno: "Manhã",
    responsavel: "Paula Mendes",
    responsavelId: "3",
    telefone: "(11) 98888-3333",
    email: "paula.mendes@email.com",
    cpf: "901.234.567-88",
    dataNascimento: "2015-04-22",
    endereco: "Rua Nova, 789 - Vila Nova",
    frequencia: 92,
    media: 7.5,
    status: "regular",
  },
  {
    id: "10",
    matricula: "2024010",
    nome: "Marina Almeida",
    turma: "4º Ano B",
    serie: "4º Ano",
    turno: "Tarde",
    responsavel: "Juliana Almeida",
    responsavelId: "6",
    telefone: "(11) 98888-6666",
    email: "juliana.almeida@email.com",
    cpf: "012.345.678-99",
    dataNascimento: "2015-09-08",
    endereco: "Av. Brasil, 987 - Centro",
    frequencia: 97,
    media: 8.3,
    status: "regular",
  },
];

const initialResponsaveis: Responsavel[] = [
  {
    id: "1",
    nome: "Maria Silva",
    cpf: "123.456.789-00",
    email: "maria.silva@email.com",
    telefone: "(11) 98888-1111",
    endereco: "Rua das Flores, 123 - Centro - São Paulo/SP",
    parentesco: "Mãe",
    alunos: ["Ana Beatriz Silva"],
    alunoIds: ["1"],
    status: "ativo",
  },
  {
    id: "2",
    nome: "Carlos Santos",
    cpf: "234.567.890-11",
    email: "carlos.santos@email.com",
    telefone: "(11) 98888-2222",
    endereco: "Av. Principal, 456 - Jardim - São Paulo/SP",
    parentesco: "Pai",
    alunos: ["Bruno Costa Santos"],
    alunoIds: ["2"],
    status: "ativo",
  },
  {
    id: "3",
    nome: "Paula Mendes",
    cpf: "345.678.901-22",
    email: "paula.mendes@email.com",
    telefone: "(11) 98888-3333",
    endereco: "Rua Nova, 789 - Vila Nova - São Paulo/SP",
    parentesco: "Mãe",
    alunos: ["Carolina Mendes", "Lucas Mendes"],
    alunoIds: ["3", "9"],
    status: "ativo",
  },
  {
    id: "4",
    nome: "Roberto Oliveira",
    cpf: "456.789.012-33",
    email: "roberto.oliveira@email.com",
    telefone: "(11) 98888-4444",
    endereco: "Rua do Sol, 321 - Centro - São Paulo/SP",
    parentesco: "Pai",
    alunos: ["Daniel Oliveira"],
    alunoIds: ["4"],
    status: "ativo",
  },
  {
    id: "5",
    nome: "Fernanda Lima",
    cpf: "567.890.123-44",
    email: "fernanda.lima@email.com",
    telefone: "(11) 98888-5555",
    endereco: "Rua Verde, 654 - Parque - São Paulo/SP",
    parentesco: "Mãe",
    alunos: ["Eduarda Lima"],
    alunoIds: ["5"],
    status: "ativo",
  },
  {
    id: "6",
    nome: "Juliana Almeida",
    cpf: "678.901.234-55",
    email: "juliana.almeida@email.com",
    telefone: "(11) 98888-6666",
    endereco: "Av. Brasil, 987 - Centro - São Paulo/SP",
    parentesco: "Mãe",
    alunos: ["Felipe Almeida", "Marina Almeida"],
    alunoIds: ["6", "10"],
    status: "ativo",
  },
  {
    id: "7",
    nome: "Marcos Ferreira",
    cpf: "789.012.345-66",
    email: "marcos.ferreira@email.com",
    telefone: "(11) 98888-7777",
    endereco: "Rua da Paz, 147 - Jardim - São Paulo/SP",
    parentesco: "Pai",
    alunos: ["Gabriela Ferreira"],
    alunoIds: ["7"],
    status: "ativo",
  },
  {
    id: "8",
    nome: "Luciana Souza",
    cpf: "890.123.456-77",
    email: "luciana.souza@email.com",
    telefone: "(11) 98888-8888",
    endereco: "Rua Central, 258 - Vila - São Paulo/SP",
    parentesco: "Mãe",
    alunos: ["Henrique Souza"],
    alunoIds: ["8"],
    status: "inativo",
  },
];

interface AlunosResponsaveisContextType {
  alunos: Aluno[];
  responsaveis: Responsavel[];
  setAlunos: React.Dispatch<React.SetStateAction<Aluno[]>>;
  setResponsaveis: React.Dispatch<React.SetStateAction<Responsavel[]>>;
  addAluno: (aluno: Omit<Aluno, "id" | "matricula" | "frequencia" | "media" | "status">) => void;
  updateAluno: (id: string, aluno: Partial<Aluno>) => void;
  deleteAluno: (id: string) => void;
  addResponsavel: (responsavel: Omit<Responsavel, "id" | "alunos" | "alunoIds" | "status">) => void;
  updateResponsavel: (id: string, responsavel: Partial<Responsavel>) => void;
  deleteResponsavel: (id: string) => void;
  getAlunosComResponsaveis: () => AlunoComResponsavel[];
  getAlunoById: (id: string) => Aluno | undefined;
  getResponsavelById: (id: string) => Responsavel | undefined;
}

const AlunosResponsaveisContext = createContext<AlunosResponsaveisContextType | undefined>(undefined);

export function AlunosResponsaveisProvider({ children }: { children: ReactNode }) {
  const [alunos, setAlunos] = useState<Aluno[]>(initialAlunos);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>(initialResponsaveis);

  const addAluno = (alunoData: Omit<Aluno, "id" | "matricula" | "frequencia" | "media" | "status">) => {
    const novoAluno: Aluno = {
      ...alunoData,
      id: Date.now().toString(),
      matricula: `2024${String(alunos.length + 1).padStart(3, "0")}`,
      frequencia: 100,
      media: 0,
      status: "regular",
    };
    setAlunos((prev) => [...prev, novoAluno]);

    // Atualizar lista de alunos do responsável
    if (alunoData.responsavelId) {
      setResponsaveis((prev) =>
        prev.map((r) =>
          r.id === alunoData.responsavelId
            ? {
                ...r,
                alunos: [...r.alunos, alunoData.nome],
                alunoIds: [...r.alunoIds, novoAluno.id],
              }
            : r
        )
      );
    }
  };

  const updateAluno = (id: string, alunoData: Partial<Aluno>) => {
    setAlunos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...alunoData } : a))
    );
  };

  const deleteAluno = (id: string) => {
    const aluno = alunos.find((a) => a.id === id);
    setAlunos((prev) => prev.filter((a) => a.id !== id));

    // Remover aluno da lista do responsável
    if (aluno?.responsavelId) {
      setResponsaveis((prev) =>
        prev.map((r) =>
          r.id === aluno.responsavelId
            ? {
                ...r,
                alunos: r.alunos.filter((n) => n !== aluno.nome),
                alunoIds: r.alunoIds.filter((aid) => aid !== id),
              }
            : r
        )
      );
    }
  };

  const addResponsavel = (responsavelData: Omit<Responsavel, "id" | "alunos" | "alunoIds" | "status">) => {
    const novoResponsavel: Responsavel = {
      ...responsavelData,
      id: Date.now().toString(),
      alunos: [],
      alunoIds: [],
      status: "ativo",
    };
    setResponsaveis((prev) => [...prev, novoResponsavel]);
  };

  const updateResponsavel = (id: string, responsavelData: Partial<Responsavel>) => {
    setResponsaveis((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...responsavelData } : r))
    );
  };

  const deleteResponsavel = (id: string) => {
    setResponsaveis((prev) => prev.filter((r) => r.id !== id));
  };

  const getAlunoById = (id: string) => {
    return alunos.find((a) => a.id === id);
  };

  const getResponsavelById = (id: string) => {
    return responsaveis.find((r) => r.id === id);
  };

  const getAlunosComResponsaveis = (): AlunoComResponsavel[] => {
    return alunos
      .map((aluno) => {
        const responsavel = responsaveis.find((r) => r.id === aluno.responsavelId);
        if (!responsavel) return null;

        return {
          id: aluno.id,
          nomeAluno: aluno.nome,
          matricula: aluno.matricula,
          dataNascimento: aluno.dataNascimento,
          serieTurma: aluno.turma,
          nomeResponsavel: responsavel.nome,
          cpfResponsavel: responsavel.cpf,
          enderecoResponsavel: responsavel.endereco,
          telefoneResponsavel: responsavel.telefone,
          emailResponsavel: responsavel.email,
          parentesco: responsavel.parentesco,
        };
      })
      .filter((item): item is AlunoComResponsavel => item !== null);
  };

  return (
    <AlunosResponsaveisContext.Provider
      value={{
        alunos,
        responsaveis,
        setAlunos,
        setResponsaveis,
        addAluno,
        updateAluno,
        deleteAluno,
        addResponsavel,
        updateResponsavel,
        deleteResponsavel,
        getAlunosComResponsaveis,
        getAlunoById,
        getResponsavelById,
      }}
    >
      {children}
    </AlunosResponsaveisContext.Provider>
  );
}

export function useAlunosResponsaveis() {
  const context = useContext(AlunosResponsaveisContext);
  if (context === undefined) {
    throw new Error("useAlunosResponsaveis must be used within an AlunosResponsaveisProvider");
  }
  return context;
}
