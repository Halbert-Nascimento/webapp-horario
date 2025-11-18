export interface CelulaViewInterface {
	idCelula: number;
	idCurso: number;
	curso: string;
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
	semestre: string;
	idSala: number;
	codigoSala: string;
	nomeSala: string;
	criadoEm: string | null;
	semestreDisciplina?: number; // Semestre da disciplina no curso
	semestreCelula?: number; // Semestre onde a célula será exibida na tabela (1, 2, 3, etc)
}

export interface CelulaCursoViewInterface {
	idCurso: number;
	nomeCurso: string;
	nomeDisciplina: string;
	modadalidade: string;
	nomeProfessor: string;
	titulacao: string;
	dia_semana: string;
	semestre: string;
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
	codigoDisciplina: string;
	nomeDisciplina: string;
	cargaHoraria: number;
	modalidade: "Presencial" | "Online" | "Hibrido";
	tipoSala: "Laboratório" | "Sala" | "Sincrona";
	semestreDisciplina: number;
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

// Authentication interfaces
export interface User {
	id: number;
	email: string;
	nome: string;
	perfil: string;
	perfil_id: number;
}

export interface LoginResponse {
	token: string;
	user: User;
}

export interface LoginCredentials {
	email: string;
	senha: string;
}

export interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, senha: string) => Promise<User>;
	logout: () => void;
	isAuthenticated: () => boolean;
	hasRole: (roles: string[] | number[] | string | number) => boolean;
}
