# 🖥️ System Monitor Dashboard

Dashboard fullstack moderno para monitoramento de serviços críticos em tempo real, desenvolvido com React, TypeScript e Node.js.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📸 Preview

O dashboard oferece uma visão completa do status de todos os serviços monitorados, com métricas em tempo real, histórico de alterações e simulação de falhas para testes.

---

## 🎯 Sobre o Projeto

**System Monitor Dashboard** é uma aplicação fullstack que simula uma ferramenta profissional de monitoramento de sistemas, usada por times de **DevOps**, **SaaS**, **Cloud** e **Cybersecurity**.

### Objetivo
- Visualizar o estado de serviços críticos (APIs, bancos de dados, cache, mensageria)
- Identificar rapidamente falhas e serviços instáveis
- Acompanhar indicadores de disponibilidade (uptime) e performance
- Simular incidentes para testes e validação

---

## ✨ Funcionalidades

### 📊 Dashboard Principal
- **Cards de Métricas** - Total de serviços, online, offline e instáveis
- **Uptime Médio** - Porcentagem média de disponibilidade
- **Tempo de Resposta** - Latência média em milissegundos
- **Auto-refresh** - Atualização automática a cada 30 segundos

### 🔍 Filtros e Busca
- Filtro por **status** (Online, Instável, Offline)
- Filtro por **categoria** (API, Database, Cache, Messaging, Storage, Authentication, Monitoring)
- Busca textual por nome ou descrição
- Botão de **refresh manual** do monitoramento

### 📋 Lista de Serviços
- Grid responsivo de cards
- Badge de status com cores intuitivas
- Ícones por categoria
- Última verificação e tempo de resposta
- Barra de progresso de uptime

### 🔎 Modal de Detalhes
- Informações completas do serviço
- Histórico de status com timeline
- Ações rápidas para simular falhas
- Endpoint do serviço

---

## 🏗️ Arquitetura

```
system-monitor-dashboard/
├── backend/                    # API REST (Node.js + Express)
│   ├── src/
│   │   ├── controllers/        # Controladores de rotas
│   │   ├── database/           # Camada de persistência (JSON)
│   │   ├── middleware/         # Middlewares (erros, logs)
│   │   ├── routes/             # Definição de rotas
│   │   ├── services/           # Lógica de negócio
│   │   ├── types/              # Tipos TypeScript
│   │   └── server.ts           # Entry point
│   ├── data/                   # Banco de dados JSON
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                   # Interface React
    ├── src/
    │   ├── components/         # Componentes React
    │   │   ├── Dashboard/
    │   │   ├── Filters/
    │   │   ├── Modal/
    │   │   └── ui/
    │   ├── hooks/              # Custom hooks
    │   ├── services/           # Cliente API
    │   ├── types/              # Tipos TypeScript
    │   └── utils/              # Utilitários
    ├── package.json
    └── vite.config.ts
```

---

## 🛠️ Stack Tecnológica

### Backend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 4.18 | Framework web |
| **TypeScript** | 5.3 | Tipagem estática |
| **tsx** | 4.7 | Executor TypeScript |
| **Helmet** | 7.1 | Segurança HTTP |
| **CORS** | 2.8 | Cross-Origin Resource Sharing |
| **dotenv** | 16.3 | Variáveis de ambiente |

### Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | 18 | Biblioteca UI |
| **TypeScript** | 5 | Tipagem estática |
| **Vite** | 5 | Build tool |
| **Tailwind CSS** | 3 | Estilização utility-first |
| **Shadcn/UI** | - | Componentes acessíveis |
| **TanStack Query** | 5 | Estado servidor |
| **Lucide React** | - | Ícones modernos |
| **date-fns** | 3 | Manipulação de datas |

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Git

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/seu-usuario/system-monitor-dashboard.git
cd system-monitor-dashboard
```

---

### 2️⃣ Configurar e Rodar o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute o servidor em modo desenvolvimento
npm run dev
```

O backend estará rodando em **http://localhost:3001**

#### 📡 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Health check |
| `GET` | `/api/services` | Lista serviços (com filtros) |
| `GET` | `/api/services/:id` | Detalhes de um serviço |
| `GET` | `/api/services/:id/history` | Histórico de status |
| `PUT` | `/api/services/:id/status` | Atualiza status |
| `POST` | `/api/services/refresh` | Refresh monitoramento |
| `GET` | `/api/dashboard/metrics` | Métricas do dashboard |

#### 🧪 Testar a API

```bash
# Health check
curl http://localhost:3001/health

# Listar serviços
curl http://localhost:3001/api/services

# Métricas
curl http://localhost:3001/api/dashboard/metrics

# Atualizar status de um serviço
curl -X PUT http://localhost:3001/api/services/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"offline","message":"Manutenção programada"}'
```

---

### 3️⃣ Configurar e Rodar o Frontend

**Em outro terminal:**

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

O frontend estará disponível em **http://localhost:5173**

---

## 🔗 Conexão Backend ↔ Frontend

### Configuração de CORS

O backend já está configurado para aceitar requisições do frontend:

```env
# backend/.env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Cliente API (Frontend)

O frontend utiliza um cliente API centralizado:

```typescript
// frontend/src/services/api.ts
const API_BASE_URL = 'http://localhost:3001/api';
```

---

## 📊 Dados Iniciais (Mock)

O sistema inicia com **8 serviços de exemplo**:

| ID | Nome | Status | Categoria |
|----|------|--------|-----------|
| 1 | Main API Gateway | 🟢 Online | API |
| 2 | PostgreSQL Database | 🟢 Online | Database |
| 3 | Redis Cache | 🟡 Instável | Cache |
| 4 | RabbitMQ | 🟢 Online | Messaging |
| 5 | AWS S3 Storage | 🟢 Online | Storage |
| 6 | Auth Service | 🔴 Offline | Authentication |
| 7 | Grafana Monitoring | 🟢 Online | Monitoring |
| 8 | Backup API | 🟢 Online | API |

---

## 🎨 Design System

### Cores de Status
| Status | Cor | Hex | Uso |
|--------|-----|-----|-----|
| 🟢 **Online** | Verde | `#10B981` | Serviço funcionando |
| 🟡 **Instável** | Amarelo | `#F59E0B` | Problemas intermitentes |
| 🔴 **Offline** | Vermelho | `#EF4444` | Serviço indisponível |

### Tema
- **Background**: Cinza escuro (`#111827`)
- **Cards**: Cinza mais claro (`#1F2937`)
- **Texto**: Branco/cinza claro
- **Modo**: Dark mode profissional

---

## 📱 Responsividade

O dashboard é totalmente responsivo:

- **Desktop (1280px+)**: Grid de 3-4 colunas
- **Tablet (768px-1280px)**: Grid de 2 colunas
- **Mobile (<768px)**: Lista em coluna única

---

## 🧪 Scripts Disponíveis

### Backend
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build TypeScript
npm start        # Inicia servidor compilado
```

### Frontend
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Verificação de código
```

---

## 🔐 Regras de Negócio

### Validações Backend
1. Status deve ser: `online`, `unstable` ou `offline`
2. Toda atualização de status atualiza `lastCheck`
3. Serviços offline têm `responseTime = 0`
4. Histórico limitado a 100 registros por serviço

### Códigos de Erro HTTP
| Código | Significado |
|--------|-------------|
| `200` | Sucesso |
| `400` | Dados inválidos |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

---

## 🚧 Próximos Passos (Roadmap)

- [ ] Autenticação JWT
- [ ] WebSocket para updates em tempo real
- [ ] Migrar para PostgreSQL/MongoDB
- [ ] Testes unitários e E2E
- [ ] Docker Compose
- [ ] CI/CD (GitHub Actions)
- [ ] Documentação OpenAPI/Swagger
- [ ] Alertas por email/Slack
- [ ] Gráficos de performance (Chart.js)

---

## 📄 Licença

Este projeto está sob a licença **MIT**.

---

## 👨‍💻 Autor

Desenvolvido como projeto de portfólio fullstack profissional.

**Stack**: React • TypeScript • Node.js • Express • Tailwind CSS

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique se o backend está rodando em `http://localhost:3001`
2. Verifique se o CORS está configurado corretamente
3. Confira os logs no terminal do backend
4. Abra uma issue no GitHub

---

