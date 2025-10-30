export interface CelulaViewInterface {
	idCelula: number;
	nomeCurso: string;
	nomeDisciplina: string;
	modalidade: string;
	tipo_sala: string;
	nomeProfessor: string;
	titulacao: string;
	dia_semana: string;
	semestre: string;
	data_criacao: Date;
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

export interface Disciplina {
	idDisciplina: number;
	nomeDisciplina: string;
}

export interface ModalData {
	dia: string;
	semestre: string;
	chave: string;
}

export interface InputCadastroProps {
	label: string;
	type: string;
	placeHolder: string;
	value: string;
	onChange?: () => void;
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
}

export interface DisponibilidadeDiasProps {
	onChange?: (diasSelecionados: string[]) => void;
}
