# Alterações no DisciplinaSelector.tsx

## Data: 07/01/2026

## Objetivo

Filtrar disciplinas e dados do curso com base no `idCurso` presente no token do usuário autenticado, garantindo que cada usuário veja apenas as informações relacionadas ao seu curso.

---

## Mudanças Implementadas

### 1. **Remoção da prop `courseId`**

**Antes:**

```typescript
// Dependia da prop courseId passada externamente
useEffect(() => {
	if (!courseId) {
		setDisciplinas([]);
		setCurso(null);
		return;
	}
	// ...
}, [courseId]);
```

**Depois:**

```typescript
// Usa o idCurso do contexto de autenticação
useEffect(() => {
	if (!user?.idCurso) {
		setDisciplinas([]);
		setCurso(null);
		setError("Usuário sem curso associado");
		return;
	}
	// ...
}, [user?.idCurso]);
```

**Motivo:** O ID do curso agora vem diretamente do token JWT do usuário autenticado através do contexto `AuthContext`, eliminando a necessidade de passar essa informação como prop.

---

### 2. **Atualização das chamadas API**

**Antes:**

```typescript
const [cursoRes, disciplinasRes] = await Promise.all([
	api.get(`/curso/${1}`), // ID fixo
	api.get(`/disciplina/curso/${1}`), // ID fixo
]);
```

**Depois:**

```typescript
const [cursoRes, disciplinasRes] = await Promise.all([
	api.get(`/curso/${user.idCurso}`),
	api.get(`/disciplina/curso/${user.idCurso}`),
]);
```

**Motivo:** As requisições agora buscam dados específicos do curso do usuário logado, garantindo isolamento de dados entre diferentes cursos.

---

### 3. **Melhoria nas mensagens de validação**

**Antes:**

```typescript
!courseId ? (
    <span className='text-sm text-gray-600'>
        Nenhum curso selecionado
    </span>
)
```

**Depois:**

```typescript
!user?.idCurso ? (
    <span className='text-sm text-gray-600'>
        Usuário sem curso associado
    </span>
)
```

**Motivo:** Mensagens mais precisas que refletem a nova lógica de autenticação e contexto do usuário.

---

### 4. **Adição de tratamento de erro específico**

**Novo:**

```typescript
if (!user?.idCurso) {
	setDisciplinas([]);
	setCurso(null);
	setError("Usuário sem curso associado");
	return;
}
```

**Motivo:** Tratamento explícito para casos onde o usuário não possui um curso associado no token.

---

## Benefícios das Mudanças

1. **Segurança:** Cada usuário vê apenas disciplinas do seu próprio curso
2. **Simplicidade:** Remove a necessidade da prop `courseId`
3. **Consistência:** Usa o mesmo padrão de autenticação do resto da aplicação
4. **Manutenibilidade:** Centraliza a lógica de identificação do curso no contexto de autenticação

---

## Impactos

### Componentes Afetados

- `DisciplinaSelector.tsx` - Componente modificado
- Componentes pais que usam `DisciplinaSelector` - Podem remover a prop `courseId`

### API Endpoints Utilizados

- `GET /curso/{idCurso}` - Agora usa `user.idCurso`
- `GET /disciplina/curso/{idCurso}` - Agora usa `user.idCurso`
- `GET /professor/curso/{idCurso}` - Já utilizava `user.idCurso`

---

## Próximos Passos Recomendados

1. ✅ Atualizar componentes pais para remover a prop `courseId`
2. ✅ Testar com diferentes usuários de cursos diferentes
3. ✅ Verificar se o token JWT contém o campo `idCurso` corretamente
4. ✅ Adicionar testes unitários para validar o filtro por curso

---

## Observações Técnicas

- O componente agora depende totalmente do `AuthContext`
- Certifique-se de que o token JWT sempre contenha o campo `idCurso`
- A prop `courseId` ainda existe na interface `DisciplinaSelectorProps` mas não é mais utilizada (pode ser removida em uma refatoração futura)
