export interface CelulaViewInterface {
	idCelula: number;
	semestreCelula: number;
	idCurso: number;
	curso: string;
	duraçaoSemestres: number;
	idDisciplina: number;
	codigoDisciplina: string;
	disciplina: string;
	modalidade: string;
	tipo_sala: string;
	idProfessor: number;
	professor: string;
	titulacao: string;
	idDiaSemana: number;
	dia_semana: string;
	idGrade: number;
	semestreLetivo: number;
	anoLetivo: number;
	idSala: number;
	codigoSala: string;
	nomeSala: string;
}

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (conteudo: string) => void;
	dia: string;
	semestre: string;
	idGrade?: number;
	idCelula?: number;
}

export interface Professor {
	idProfessor: number;
	nomeProfessor: string;
	titulacao?: string;
}

export interface ModalData {
	dia: string;
	semestre: string;
	chave: string;
}

export interface DisponibilidadeDiasProps {
	onChange?: (diasSelecionados: string[]) => void;
}

export interface Disciplina {
	idDisciplina: number;
	nomeDisciplina: string;
	codigoDisciplina: string;
	cargaHoraria: number;
	semestreDisciplina?: number; // Campo antigo (pode manter para compatibilidade)
	periodo: number; // ✅ NOVO: Campo que vem da API
	tipoSala?: string;
	idCurso?: number;
}

export interface DisciplinaSelectorProps {
	courseId?: number;
	onChange?: (disciplinasIds: number[], professorId: number | null) => void;
	className?: string;
}

export interface ModalDeleteProps {
	isOpen: boolean;
	onClose: () => void;
	onDelete: () => void;
	conteudo: string;
}

export interface FormCadastroProps {
	children?: React.ReactNode;
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
	className?: string;
}

// Renamed to avoid conflict with InputCadastroPropsAlt below
export interface InputCadastroProps {
	label: string;
	type: string;
	placeHolder: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // More specific type
	disabled?: boolean;
}

export interface ButtonCadastroProps {
	text: string;
	onClick?: () => void;
	textColor?: string;
	bgColor?: string;
	style?: string;
}

export interface FormProps {
	children: React.ReactNode;
	className?: string;
}

export interface SelectCadastroProps {
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	disabled?: boolean;
	options: { value: string | number; label: string }[];
	placeholder?: string;
}

// ========================================
// 🔐 TIPOS DE AUTENTICAÇÃO
// ========================================

export interface User {
	idUsuario: number;
	nomeUsuario: string;
	emailUsuario: string;
	idPerfil: number;
	nomePerfil: string;
	idCurso: number | null;
	nomeCurso: string | null;
	roles: string[];
}

export interface LoginCredentials {
	email: string;
	senha: string;
}

export interface AuthResponse {
	message: string;
	token: string;
	user: User;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
	isLoading: boolean;
}
