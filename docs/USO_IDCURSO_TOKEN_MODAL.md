# Uso do idCurso do Token no Modal de Criação

## 📋 Resumo

Modificação do componente `ModalCreate.tsx` para utilizar o `idCurso` presente no token JWT do usuário autenticado ao buscar disciplinas, garantindo que apenas disciplinas do curso vinculado ao usuário sejam exibidas.

## 🎯 Objetivo

Filtrar as disciplinas disponíveis no modal de criação de aulas com base no curso ao qual o usuário está vinculado, utilizando as informações presentes no token de autenticação.

## 🔧 Implementação

### Arquivo Modificado

- `src/components/ModalCreate.tsx`

### Mudanças Realizadas

#### 1. Importação do Hook de Autenticação

**Adicionado:**

```tsx
import { useAuth } from "@/contexts/AuthContext";
```

#### 2. Acesso aos Dados do Usuário

**Adicionado no início do componente:**

```tsx
export default function Modal({
	isOpen,
	onClose,
	onSave,
	dia,
	semestre,
	idGrade = 1,
	idCelula,
}: ModalProps) {
	const { user } = useAuth();
	// ... resto do código
}
```

#### 3. Modificação da Função carregarDisciplinas

**Antes:**

```tsx
const carregarDisciplinas = async () => {
	try {
		setLoading(true);
		const disciplinasResponse = await api.get<Disciplina[]>(
			`/disciplina/curso/${1}/periodo/${semestreNumero}`,
		);

		setDisciplinas(disciplinasResponse.data);
	} catch (error) {
		toast.error("Erro ao carregar disciplinas");
	} finally {
		setLoading(false);
	}
};
```

**Depois:**

```tsx
const carregarDisciplinas = async () => {
	try {
		setLoading(true);

		// Verificar se o usuário tem idCurso
		if (!user?.idCurso) {
			toast.error("Usuário não possui curso vinculado");
			setLoading(false);
			return;
		}

		const disciplinasResponse = await api.get<Disciplina[]>(
			`/disciplina/curso/${user.idCurso}/periodo/${semestreNumero}`,
		);

		setDisciplinas(disciplinasResponse.data);
	} catch (error) {
		toast.error("Erro ao carregar disciplinas");
	} finally {
		setLoading(false);
	}
};
```

## 🔐 Fluxo de Dados

### Cadeia de Informação

```
Login → Token JWT → AuthContext → user.idCurso → API /disciplina → Modal
```

1. **Login**: Usuário faz autenticação no sistema
2. **Token JWT**: Backend retorna token com dados do usuário (incluindo idCurso)
3. **AuthContext**: Token é processado e dados armazenados no contexto
4. **user.idCurso**: Modal acessa o ID do curso através do hook `useAuth()`
5. **API /disciplina**: Requisição busca disciplinas específicas do curso
6. **Modal**: Exibe apenas disciplinas relevantes ao curso do usuário

## 📊 Endpoint Utilizado

### Rota da API

```
GET /disciplina/curso/{idCurso}/periodo/{semestreNumero}
```

**Parâmetros:**

- `idCurso`: ID do curso vinculado ao usuário (obtido do token)
- `semestreNumero`: Número do semestre extraído da célula selecionada

**Exemplo de Requisição:**

```
GET /disciplina/curso/3/periodo/5
```

Busca disciplinas do curso ID 3, período 5

## ✅ Validações Implementadas

### 1. Verificação de Usuário com Curso Vinculado

```tsx
if (!user?.idCurso) {
	toast.error("Usuário não possui curso vinculado");
	setLoading(false);
	return;
}
```

**Comportamento:**

- Se `user` for `null` ou `undefined`: Não executa a requisição
- Se `user.idCurso` for `null`: Exibe mensagem de erro e interrompe o carregamento
- Desativa o estado de loading para permitir que o usuário feche o modal

## 🎯 Benefícios da Implementação

1. **Segurança**: Usuários só podem criar aulas com disciplinas do seu curso
2. **UX Melhorada**: Lista apenas opções relevantes, evitando confusão
3. **Consistência**: Alinhado com outras telas que usam idCurso do token
4. **Integridade de Dados**: Previne criação de células com dados incompatíveis
5. **Performance**: Reduz quantidade de dados transferidos na API

## 🔄 Casos de Uso

### Caso 1: Coordenador de Curso Específico

```
user.idCurso = 3 (Engenharia de Software)
semestre selecionado = "5º Semestre"
↓
GET /disciplina/curso/3/periodo/5
↓
Modal exibe: Estrutura de Dados, Banco de Dados II, etc.
```

### Caso 2: Usuário sem Curso Vinculado

```
user.idCurso = null
↓
Toast: "Usuário não possui curso vinculado"
↓
Modal não carrega disciplinas
Lista de disciplinas fica vazia
```

### Caso 3: Administrador com Curso Vinculado

```
user.idCurso = 1 (Administração)
user.roles = ["admin"]
semestre selecionado = "3º Semestre"
↓
GET /disciplina/curso/1/periodo/3
↓
Modal exibe disciplinas do curso de Administração
```

## 🔗 Integração com Outros Componentes

### Componentes Relacionados

1. **Table.tsx**: Também usa `user.idCurso` para carregar células
2. **AuthContext.tsx**: Fornece os dados do usuário autenticado
3. **ProtectedRoute.tsx**: Controla acesso às páginas por role

### Fluxo Completo de Criação de Aula

```
1. Table.tsx (carrega células do curso)
   ↓
2. Usuário clica em célula vazia
   ↓
3. ModalCreate.tsx abre
   ↓
4. Modal busca disciplinas do user.idCurso
   ↓
5. Usuário seleciona disciplina e professor
   ↓
6. Célula é criada com dados do curso correto
```

## 📝 Dependências do useEffect

O modal recarrega as disciplinas quando:

- `isOpen` muda (modal é aberto/fechado)
- `semestreNumero` muda (semestre diferente selecionado)

```tsx
useEffect(() => {
	if (isOpen) {
		carregarDisciplinas();
		setFormData({
			professorId: "",
			disciplinaId: "",
		});
		setProfessores([]);
	}
}, [isOpen, semestreNumero]);
```

**Nota:** `user` não está nas dependências porque o modal só é acessível após login, então `user` já está definido quando o modal abre.

## 🚀 Próximos Passos Sugeridos

1. **Tratamento de Loading**: Exibir skeleton loader enquanto carrega disciplinas
2. **Cache de Disciplinas**: Evitar requisições repetidas para o mesmo período
3. **Mensagem Personalizada**: Feedback diferenciado para lista vazia vs erro
4. **Pré-seleção**: Auto-selecionar disciplina se houver apenas uma opção
5. **Filtros Adicionais**: Permitir filtrar por tipo de sala ou outras características

## ⚠️ Considerações Importantes

### Para Administradores

Se um administrador precisar criar aulas para múltiplos cursos:

- Atualmente está limitado ao curso em `user.idCurso`
- Solução: Adicionar seletor de curso para usuários com role `admin`

### Para Coordenadores Multi-Curso

Se um coordenador gerencia mais de um curso:

- Sistema atual vincula apenas 1 curso por usuário no token
- Solução possível: Implementar seletor de contexto de curso

### Validação no Backend

- O frontend filtra disciplinas pelo curso, mas o backend deve validar
- Garantir que a célula criada pertence ao curso correto
- Validar consistência entre idCurso da disciplina e do usuário

## 🧪 Testes Recomendados

### Cenários de Teste

1. ✅ Usuário com curso vinculado - deve carregar disciplinas corretamente
2. ✅ Usuário sem curso vinculado - deve exibir mensagem de erro
3. ✅ Mudança de período - deve recarregar disciplinas do novo período
4. ✅ Modal fechado e reaberto - deve limpar seleções anteriores
5. ✅ Erro na API - deve exibir mensagem de erro apropriada

## 📚 Documentação Relacionada

- [RESTRICAO_ACESSO_COORDENADOR.md](../RESTRICAO_ACESSO_COORDENADOR.md) - Controle de acesso por role
- [USO_IDCURSO_TOKEN_TABELA.md](../USO_IDCURSO_TOKEN_TABELA.md) - Uso do idCurso na tabela
- AuthContext - Gerenciamento de autenticação e token JWT
