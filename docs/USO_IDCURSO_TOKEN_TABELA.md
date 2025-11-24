# Uso do idCurso do Token na Tabela de Células

## 📋 Resumo
Modificação do componente `Table.tsx` para utilizar o `idCurso` presente no token JWT do usuário autenticado, ao invés de um valor fixo ou indefinido.

## 🎯 Objetivo
Garantir que a tabela de células exiba apenas os dados do curso ao qual o usuário está vinculado, utilizando as informações presentes no token de autenticação.

## 🔧 Implementação

### Arquivo Modificado
- `src/components/Table.tsx`

### Mudanças Realizadas

#### 1. Importação do Hook de Autenticação
**Adicionado:**
```tsx
import { useAuth } from "@/contexts/AuthContext";
```

#### 2. Acesso aos Dados do Usuário
**Adicionado no início do componente:**
```tsx
export default function Tabela() {
    const { user } = useAuth();
    // ... resto do código
}
```

#### 3. Modificação da Função carregarDados

**Antes:**
```tsx
const carregarDados = async () => {
    try {
        setLoading(true);

        // Buscar dados de células
        const celulasResponse = await api.get<CelulaViewInterface[]>(
            `/celula/${idCurso}/semestre/${1}/ano/${2026}`,
        );
```

**Depois:**
```tsx
const carregarDados = async () => {
    try {
        setLoading(true);

        // Verificar se o usuário tem idCurso
        if (!user?.idCurso) {
            toast.error("Usuário não possui curso vinculado");
            setLoading(false);
            return;
        }

        // Buscar dados de células usando o idCurso do usuário
        const celulasResponse = await api.get<CelulaViewInterface[]>(
            `/celula/${user.idCurso}/semestre/${1}/ano/${2026}`,
        );
```

#### 4. Atualização do useEffect

**Antes:**
```tsx
useEffect(() => {
    carregarDados();
}, []);
```

**Depois:**
```tsx
useEffect(() => {
    if (user) {
        carregarDados();
    }
}, [user]);
```

## 🔐 Fluxo de Dados

### Origem do idCurso
```
Login → Token JWT → AuthContext → user.idCurso → API Request
```

1. **Login**: Usuário faz login no sistema
2. **Token JWT**: Backend retorna token com informações do usuário
3. **AuthContext**: Token é decodificado e informações são armazenadas no contexto
4. **user.idCurso**: Componente acessa o idCurso através do hook `useAuth()`
5. **API Request**: Requisição utiliza o idCurso para buscar células específicas

## 📊 Estrutura de Dados

### Interface User (com idCurso)
```typescript
export interface User {
    idUsuario: number;
    nomeUsuario: string;
    emailUsuario: string;
    idPerfil: number;
    nomePerfil: string;
    idCurso: number | null;      // ✅ ID do curso vinculado
    nomeCurso: string | null;     // Nome do curso
    roles: string[];
}
```

## ✅ Validações Implementadas

### 1. Verificação de Usuário Autenticado
```tsx
if (user) {
    carregarDados();
}
```
Garante que `carregarDados()` só é executado quando há um usuário autenticado.

### 2. Verificação de Curso Vinculado
```tsx
if (!user?.idCurso) {
    toast.error("Usuário não possui curso vinculado");
    setLoading(false);
    return;
}
```
Exibe mensagem de erro caso o usuário não tenha um curso vinculado.

## 🎯 Benefícios

1. **Segurança**: Usuários só podem visualizar dados do seu próprio curso
2. **Dinâmico**: Não depende de valores hardcoded ou variáveis globais
3. **Rastreável**: O idCurso vem diretamente do token autenticado
4. **Validação**: Tratamento de casos onde o usuário não possui curso vinculado
5. **Reatividade**: Atualiza automaticamente se o usuário mudar (através do useEffect)

## 🔄 Casos de Uso

### Caso 1: Usuário com Curso Vinculado
```
user.idCurso = 5
↓
GET /celula/5/semestre/1/ano/2026
↓
Exibe tabela com células do curso 5
```

### Caso 2: Usuário sem Curso Vinculado
```
user.idCurso = null
↓
Toast: "Usuário não possui curso vinculado"
↓
Tabela vazia (loading = false)
```

### Caso 3: Usuário Não Autenticado
```
user = null
↓
useEffect não executa carregarDados()
↓
Componente aguarda autenticação
```

## 🚀 Próximos Passos Sugeridos

1. **Cache de Dados**: Implementar cache para evitar requisições repetidas
2. **Loading State**: Melhorar feedback visual durante o carregamento
3. **Error Boundary**: Adicionar tratamento de erros mais robusto
4. **Refresh Manual**: Botão para recarregar dados da tabela
5. **Parâmetros Dinâmicos**: Permitir seleção de semestre e ano

## 📝 Notas Técnicas

- O `useEffect` tem `user` como dependência, então recarrega quando o usuário muda
- Optional chaining (`user?.idCurso`) previne erros se `user` for null/undefined
- O `setLoading(false)` garante que o loading seja desativado mesmo em caso de erro
- A validação acontece antes da requisição, economizando chamadas desnecessárias à API

## ⚠️ Considerações Importantes

- **Coordenadores**: Se um coordenador gerencia múltiplos cursos, pode ser necessário adicionar seletor de curso
- **Admins**: Administradores podem precisar de uma visão global (todos os cursos)
- **Proteção de Rota**: Complementar com `ProtectedRoute` na página que usa este componente
