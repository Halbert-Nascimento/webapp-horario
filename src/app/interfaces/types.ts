export interface CelulaViewInterface {
	idCelula: number;
	curso: string;
	disciplina: string;
	modalidade: string;
	tipo_sala: string;
	professor: string;
	titulacao: string;
	dia_semana: string;
	semestre: string;
	data_criacao: Date;
}

export interface CelulaCursoViewInterface {
	idCurso: number;
	curso: string;
	disciplina: string;
	modadalidade: string;
	professor: string;
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
	nome: string;
	titulacao?: string;
}

export interface Disciplina {
	idDisciplina: number;
	nome: string;
}

export interface ModalData {
	dia: string;
	semestre: string;
	chave: string;
}
