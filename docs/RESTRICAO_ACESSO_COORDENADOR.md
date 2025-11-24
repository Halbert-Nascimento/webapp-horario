# Restrição de Acesso por Role - Coordenador

## 📋 Resumo

Implementação de controle de acesso baseado em roles para restringir páginas específicas para usuários com a role `coordenador`.

## 🎯 Objetivo

Impedir que coordenadores acessem as seguintes páginas através do menu de navegação:

- **Cadastro de Curso**
- **Cadastrar Sala**

## 🔧 Implementação

### Arquivo Modificado

- `src/components/NavBar.tsx`

### Mudanças Realizadas

#### 1. Cadastro de Curso

**Antes:**

```tsx
<li>
	<Link
		href='/cadastroCurso'
		onClick={() => setIsOpen(false)}
		className='flex items-center text-gray-200 hover:bg-blue-800 rounded-lg px-4 py-3 transition-colors'
	>
		<span className='text-lg'>Cadastro Curso</span>
	</Link>
</li>
```

**Depois:**

```tsx
{
	!user.roles.includes("coordenador") && (
		<li>
			<Link
				href='/cadastroCurso'
				onClick={() => setIsOpen(false)}
				className='flex items-center text-gray-200 hover:bg-blue-800 rounded-lg px-4 py-3 transition-colors'
			>
				<span className='text-lg'>Cadastro Curso</span>
			</Link>
		</li>
	);
}
```

#### 2. Cadastrar Sala

**Antes:**

```tsx
<li>
	<Link
		href='/cadastroSala'
		onClick={() => setIsOpen(false)}
		className='flex items-center text-gray-200 hover:bg-blue-800 rounded-lg px-4 py-3 transition-colors'
	>
		<span className='text-lg'>Cadastrar Sala</span>
	</Link>
</li>
```

**Depois:**

```tsx
{
	!user.roles.includes("coordenador") && (
		<li>
			<Link
				href='/cadastroSala'
				onClick={() => setIsOpen(false)}
				className='flex items-center text-gray-200 hover:bg-blue-800 rounded-lg px-4 py-3 transition-colors'
			>
				<span className='text-lg'>Cadastrar Sala</span>
			</Link>
		</li>
	);
}
```

## 🔐 Lógica de Permissões

### Hierarquia de Acesso

| Role             | Cadastro Curso | Cadastro Disciplina | Cadastro Professor | Vincular Disciplina | Cadastrar Sala |
| ---------------- | -------------- | ------------------- | ------------------ | ------------------- | -------------- |
| **Professor**    | ❌             | ❌                  | ❌                 | ❌                  | ❌             |
| **Coordenador**  | ❌             | ✅                  | ✅                 | ✅                  | ❌             |
| **Admin/Outros** | ✅             | ✅                  | ✅                 | ✅                  | ✅             |

### Verificação de Roles

A verificação é feita utilizando o array `roles` presente no objeto `user`, que é obtido do token JWT:

```tsx
{user && !user.roles.includes("professor") && (
    <>
        {/* Cadastros disponíveis para não-professores */}

        {!user.roles.includes("coordenador") && (
            /* Páginas bloqueadas para coordenador */
        )}
    </>
)}
```

## 📊 Estrutura de Dados

### Interface User

```typescript
export interface User {
	idUsuario: number;
	nomeUsuario: string;
	emailUsuario: string;
	idPerfil: number;
	nomePerfil: string;
	idCurso: number | null;
	nomeCurso: string | null;
	roles: string[]; // Array com as roles do usuário
}
```

## 🔍 Fonte dos Dados

As informações de roles são extraídas do **token JWT** retornado pela API no momento do login e armazenadas no `AuthContext`.

## ✅ Validação

Para testar a implementação:

1. Faça login com um usuário que possua a role `coordenador`
2. Verifique que o menu lateral **NÃO** exibe:
   - Cadastro Curso
   - Cadastrar Sala
3. Verifique que o menu lateral **EXIBE**:
   - Cadastro Disciplina
   - Cadastro Professor
   - Vincular Professor a Disciplina

## 📝 Notas Importantes

- A restrição atual é apenas **visual** (oculta os links do menu)
- Recomenda-se implementar **proteção de rotas** nas próprias páginas para segurança adicional
- O acesso direto via URL ainda pode ser possível se não houver validação no lado do servidor ou nas páginas

## 🚀 Próximos Passos Sugeridos

1. Implementar `ProtectedRoute` com validação de roles nas páginas individuais
2. Adicionar middleware de validação de permissões nas rotas
3. Implementar feedback visual quando usuário tentar acessar rota não autorizada
