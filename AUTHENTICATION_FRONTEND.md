# Sistema de Autenticação - Frontend

Este documento descreve a implementação do sistema de autenticação JWT no frontend do sistema de horários.

## 🔐 Visão Geral

O sistema de autenticação foi implementado seguindo o guia de integração do backend. Ele utiliza JWT (JSON Web Tokens) para autenticar usuários e proteger rotas.

## 📋 Componentes Implementados

### 1. Serviços

#### `src/services/api.ts`

- Configurado para usar a base URL `http://localhost:3333`
- **Request Interceptor**: Adiciona automaticamente o token JWT no header `Authorization: Bearer {token}`
- **Response Interceptor**: Detecta erros 401 (token expirado/inválido) e redireciona para login

#### `src/services/auth.ts`

- `login(credentials)`: Realiza login via API
- `saveAuthData(token, user)`: Salva token e dados do usuário no localStorage
- `clearAuthData()`: Remove dados de autenticação do localStorage
- `getStoredUser()`: Recupera usuário armazenado
- `getStoredToken()`: Recupera token armazenado
- `isAuthenticated()`: Verifica se há um token válido

### 2. Context API

#### `src/contexts/AuthContext.tsx`

Gerencia o estado global de autenticação:

- `user`: Dados do usuário logado
- `loading`: Estado de carregamento
- `login(email, senha)`: Função para fazer login
- `logout()`: Função para fazer logout
- `isAuthenticated()`: Verifica se está autenticado
- `hasRole(roles)`: Verifica se o usuário tem uma determinada role

### 3. Componentes

#### `src/components/PrivateRoute.tsx`

Componente HOC que protege rotas autenticadas:

- Redireciona para `/login` se não estiver autenticado
- Suporta verificação de roles específicas
- Mostra loading enquanto verifica autenticação

#### `src/app/login/page.tsx`

Página de login com:

- Formulário com email e senha
- Validação de campos
- Feedback visual (loading state)
- Toast de sucesso/erro
- Redirecionamento automático se já estiver autenticado

#### `src/components/NavBar.tsx` (Atualizado)

- Mostra nome e perfil do usuário logado
- Botão de logout com ícone
- Redireciona para login ao fazer logout

### 4. Tipos TypeScript

#### `src/interfaces/types.ts`

Novos tipos adicionados:

```typescript
interface User {
	id: number;
	email: string;
	nome: string;
	perfil: string;
	perfil_id: number;
}

interface LoginResponse {
	token: string;
	user: User;
}

interface LoginCredentials {
	email: string;
	senha: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, senha: string) => Promise<User>;
	logout: () => void;
	isAuthenticated: () => boolean;
	hasRole: (roles: string[] | number[] | string | number) => boolean;
}
```

## 🚀 Como Usar

### Login

1. Acesse `http://localhost:3000` ou `http://localhost:3000/login`
2. Insira email e senha
3. Clique em "Entrar"
4. Se credenciais corretas, será redirecionado para `/home`

### Logout

1. Clique no botão "Sair" na barra lateral
2. Será redirecionado para `/login`

### Verificar Autenticação em um Componente

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MeuComponente() {
	const { user, isAuthenticated, hasRole } = useAuth();

	if (!isAuthenticated()) {
		return <div>Não autenticado</div>;
	}

	return (
		<div>
			Bem-vindo, {user.nome}!{hasRole("Admin") && <button>Admin Only</button>}
		</div>
	);
}
```

### Proteger uma Rota

```typescript
import PrivateRoute from "@/components/PrivateRoute";

export default function MinhaPage() {
	return (
		<PrivateRoute>
			<div>Conteúdo protegido</div>
		</PrivateRoute>
	);
}

// Com verificação de role
export default function AdminPage() {
	return (
		<PrivateRoute roles={["Admin", 3]}>
			<div>Apenas para Admin</div>
		</PrivateRoute>
	);
}
```

## 🔑 Perfis de Usuário

| ID  | Nome        | Descrição                   |
| --- | ----------- | --------------------------- |
| 1   | Professor   | Acesso para professores     |
| 2   | Coordenador | Acesso para coordenadores   |
| 3   | Admin       | Acesso administrativo total |

## 📡 Endpoints da API

### Login

- **URL**: `POST http://localhost:3001/auth/login`
- **Body**:
  ```json
  {
  	"email": "usuario@exemplo.com",
  	"senha": "senha123"
  }
  ```
- **Response Success**:
  ```json
  {
  	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  	"user": {
  		"id": 1,
  		"email": "usuario@exemplo.com",
  		"nome": "João Silva",
  		"perfil": "Professor",
  		"perfil_id": 1
  	}
  }
  ```

### Rotas Protegidas

Todas as outras rotas da API requerem o header:

```
Authorization: Bearer {token}
```

Isso é feito automaticamente pelo interceptor do axios.

## ⚙️ Configuração

### Variáveis de Ambiente

Atualmente usando URL hardcoded. Para produção, considere usar variáveis de ambiente:

```typescript
// src/services/api.ts
const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});
```

## 🔒 Segurança

### Implementado

- ✅ Token armazenado em localStorage
- ✅ Token incluído automaticamente em todas as requisições
- ✅ Interceptor para detectar token expirado (401)
- ✅ Redirecionamento automático para login quando não autenticado
- ✅ Toast notifications para feedback ao usuário

### Melhorias Futuras

- [ ] Implementar refresh token
- [ ] Adicionar timeout de sessão por inatividade
- [ ] Migrar para httpOnly cookies (mais seguro que localStorage)
- [ ] Implementar 2FA (autenticação de dois fatores)

## 🐛 Tratamento de Erros

### Token Expirado

Quando o token expira (após 1 hora):

1. API retorna status 401
2. Interceptor detecta o erro
3. Remove token e user do localStorage
4. Redireciona para `/login`
5. Mostra toast informando que a sessão expirou

### Credenciais Inválidas

1. API retorna erro 401 com mensagem
2. Toast de erro é exibido
3. Usuário permanece na tela de login

### Erro de Conexão

1. Toast genérico "Erro ao fazer login" é exibido
2. Usuário pode tentar novamente

## 📝 Fluxo de Autenticação

```
1. Usuário acessa a aplicação
   ↓
2. AuthContext verifica localStorage
   ↓
3. Se token existe → carrega user → permite acesso
   ↓
4. Se token não existe → redireciona para /login
   ↓
5. Usuário faz login
   ↓
6. Token + User salvos no localStorage
   ↓
7. Redireciona para /home
   ↓
8. Todas as requisições incluem token no header
   ↓
9. Se 401 → logout automático + redirect para login
```

## 🧪 Testando

### Login Manual

1. Certifique-se de que o backend está rodando em `http://localhost:3001`
2. Execute o frontend: `npm run dev`
3. Acesse `http://localhost:3000`
4. Use as credenciais configuradas no backend

### Testando Token Expirado

1. Faça login
2. Aguarde 1 hora (ou modifique o tempo no backend para teste)
3. Tente acessar qualquer página
4. Deve ser redirecionado para login

### Testando Proteção de Rotas

1. Sem estar logado, tente acessar diretamente `http://localhost:3000/home`
2. Deve ser redirecionado para `/login`

## 📚 Referências

- [Guia de Integração Frontend](../FRONTEND_INTEGRATION_GUIDE.md)
- [Documentação Backend](../AUTHENTICATION.md)
- [React Context API](https://react.dev/reference/react/useContext)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
