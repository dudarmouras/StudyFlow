# 📚 StudyFlow

Plataforma de estudos colaborativos em tempo real. Crie salas de estudo, gerencie tarefas e mantenha o foco com seus amigos usando o timer Pomodoro.

![StudyFlow](https://img.shields.io/badge/status-em%20desenvolvimento-pink)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Express](https://img.shields.io/badge/Express-5-lightgrey)
![Socket.io](https://img.shields.io/badge/Socket.io-4-white)
![Prisma](https://img.shields.io/badge/Prisma-7-blue)

---

## ✨ Funcionalidades

- **Autenticação** — cadastro e login com JWT, sessão persistida via cookie
- **Salas de estudo** — crie ou entre em salas com código e senha
- **Participantes em tempo real** — veja quem está na sala via Socket.io
- **Gerenciamento de tarefas** — crie, edite, marque como concluída e exclua suas tasks
- **Visualização das tasks dos colegas** — acompanhe o progresso de todos (somente leitura)
- **Timer Pomodoro sincronizado** — controle compartilhado entre todos na sala
- **Proteção de rotas** — middleware do Next.js bloqueia páginas sem autenticação
- **Sala se apaga automaticamente** — quando o último participante sai

---

## 🧱 Tecnologias

### Frontend
| Next.js 15 (App Router) | Framework React com SSR |
| TypeScript | Tipagem estática |
| Tailwind CSS | Estilização |
| shadcn/ui | Componentes de UI |
| React Hook Form | Gerenciamento de formulários |
| Axios | Requisições HTTP |
| Socket.io Client | Comunicação em tempo real |
| jwt-decode | Leitura do token no frontend |
| jose | Verificação do JWT no middleware |
| lucide-react | Ícones |
| Nunito (Google Fonts) | Tipografia |

### Backend
| Express 5 | Framework HTTP |
| TypeScript | Tipagem estática |
| Prisma 7 | ORM |
| PostgreSQL | Banco de dados |
| Socket.io | Comunicação em tempo real |
| JSON Web Token | Autenticação |
| bcryptjs | Hash de senhas |
| Zod | Validação de dados |
| Docker | Containerização |

---

## 🗂️ Estrutura do projeto

```
StudyFlow/
├── frontend/                   # Aplicação Next.js
│   ├── middleware.ts            # Proteção de rotas (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Home (pública)
│   │   │   ├── roomDecision/page.tsx       # Escolher sala (protegida)
│   │   │   └── room/[id]/page.tsx          # Sala (protegida)
│   │   ├── components/
│   │   │   ├── header/                     # Header com nome e código da sala
│   │   │   ├── cardParticipants/           # Lista de participantes em tempo real
│   │   │   ├── task/                       # Lista de tarefas com CRUD
│   │   │   ├── pomodoroTimer/              # Timer Pomodoro sincronizado
│   │   │   ├── logoutButton/               # Botão de sair (chama /leave antes)
│   │   │   ├── modalLogin/                 # Modal de login
│   │   │   ├── modalRegister/              # Modal de cadastro
│   │   │   ├── modalCreate/                # Modal de criar sala
│   │   │   ├── modalJoin/                  # Modal de entrar na sala
│   │   │   └── cardInformation/            # Cards informativos da home
│   │   ├── hooks/
│   │   │   └── useSocket.ts               # Hook de conexão com Socket.io
│   │   └── services/
│   │       └── api.ts                     # Instância do Axios com token
│
└── backend/                    # API Express
    ├── docker-compose.yml
    ├── src/
    │   ├── server.ts                       # Entry point + Socket.io
    │   ├── routes/                         # Definição das rotas
    │   ├── controller/
    │   │   ├── UserController.ts
    │   │   ├── RoomController.ts
    │   │   ├── RoomParticipantController.ts
    │   │   ├── TasksController.ts
    │   │   └── LoginController.ts
    │   ├── repository/                     # Acesso ao banco via Prisma
    │   ├── middleware/
    │   │   └── authMiddleware.ts           # Verifica JWT no Express
    │   └── DTOs/                           # Schemas Zod de validação
```

---

## 🔄 Fluxo da aplicação

```
/ (Home)
  └── Login / Cadastro
        └── Token JWT salvo em localStorage + cookie
              └── /roomDecision (protegida)
                    ├── Criar Sala → /room/:id
                    └── Entrar em Sala → /room/:id
                          └── Sala em tempo real
                                ├── Participantes (Socket.io)
                                ├── Tasks (CRUD + Socket.io)
                                └── Pomodoro Timer (Socket.io)
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- pnpm (ou npm)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/studyflow.git
cd studyflow
```

### 2. Suba o banco de dados

```bash
cd backend
docker-compose up -d
```

### 3. Configure o backend

```bash
cd backend
cp .env.example .env
```

Edite o `.env`:
```env
DATABASE_URL="postgresql://postgres:docker@localhost:5432/studyflow"
JWT_SECRET=sua_chave_secreta_aqui
PORT=3001
```

```bash
pnpm install
npx prisma migrate dev
pnpm dev
```

### 4. Configure o frontend

```bash
cd frontend
cp .env.local.example .env.local
```

Edite o `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=sua_chave_secreta_aqui  # mesma do backend
```

```bash
pnpm install
pnpm dev
```

### 5. Acesse

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health check: http://localhost:3001/health


## ⚡ Eventos Socket.io

### Emitidos pelo cliente
| Evento | Payload | Descrição |
|---|---|---|
| `join-room` | `roomId` | Entrar no canal da sala |
| `leave-room` | `roomId` | Sair do canal da sala |
| `timer-start` | `roomId` | Iniciar timer para todos |
| `timer-pause` | `roomId` | Pausar timer para todos |
| `timer-reset` | `{ roomId, mode }` | Resetar timer |
| `timer-mode` | `{ roomId, mode }` | Trocar modo do timer |

### Emitidos pelo servidor
| Evento | Payload | Descrição |
|---|---|---|
| `task-created` | `Task` | Nova task criada na sala |
| `task-updated` | `Task` | Task atualizada |
| `task-deleted` | `taskId` | Task deletada |
| `user-tasks-cleared` | `userId` | Usuário saiu — remove suas tasks |
| `participant-joined` | `{ userId, user }` | Novo participante entrou |
| `participant-left` | `userId` | Participante saiu |
| `room-closed` | — | Sala encerrada (0 participantes) |
| `timer-start` | — | Timer iniciado por outro usuário |
| `timer-pause` | — | Timer pausado por outro usuário |
| `timer-reset` | `mode` | Timer resetado |
| `timer-mode` | `mode` | Modo do timer alterado |

---

## 🔒 Autenticação

O sistema usa JWT em dois lugares:

**Express (API)** — o `authMiddleware` lê o header `Authorization: Bearer <token>` e injeta o `userId` no `req.user`.

**Next.js (páginas)** — o `middleware.ts` na raiz do projeto lê o cookie `token` e redireciona para `/` se inválido ou ausente. Protege todas as rotas `/roomDecision` e `/room/:id`.

O token é salvo em dois lugares no login:
- `localStorage` — para o Axios enviar nas requisições
- `cookie` — para o middleware do Next.js verificar

---

## 👩‍💻 Desenvolvido por

Eduarda Rodrigues — projeto pessoal de estudos em React, Next.js, Node.js e Socket.io.