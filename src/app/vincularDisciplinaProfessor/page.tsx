"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import DisciplinaSelector from "@/components/DisciplinaSelector";
import FormCadastro from "@/components/FormCadastro";

import api from "@/services/api";
import toast from "react-hot-toast";
import { useState } from "react";

export default function VincularDisciplinaProfessor() {
	const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<
		number[]
	>([]);
	const [professorSelecionado, setProfessorSelecionado] = useState<
		number | null
	>(null);
	const [loading, setLoading] = useState(false);

	const handleDisciplinasChange = (
		ids: number[],
		professorId: number | null,
	) => {
		setDisciplinasSelecionadas(ids);
		setProfessorSelecionado(professorId);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!professorSelecionado) {
			toast.error("Selecione um professor");
			return;
		}

		if (disciplinasSelecionadas.length === 0) {
			toast.error("Selecione pelo menos uma disciplina");
			return;
		}

		try {
			setLoading(true);

			// Cadastrar cada disciplina separadamente
			for (const idDisciplina of disciplinasSelecionadas) {
				const payload = {
					idDisciplina: idDisciplina,
					idProfessor: professorSelecionado,
				};
				await api.post("/professorDisciplina", payload);
			}

			toast.success(
				`${disciplinasSelecionadas.length} disciplina(s) vinculada(s) com sucesso!`,
			);

			// Limpar seleções
			setDisciplinasSelecionadas([]);
			setProfessorSelecionado(null);
		} catch (error: any) {
			console.error("❌ ERRO:", error);
			console.error("❌ Resposta da API:", error.response?.data);

			let mensagemErro = "Erro ao vincular disciplinas";

			if (error.response?.data?.message) {
				mensagemErro = error.response.data.message;
			} else if (error.response?.data?.error) {
				mensagemErro = error.response.data.error;
			}

			toast.error(mensagemErro);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Header title='Vincular Professor a Disciplina' />
			<NavBar />
			<div className='[&>div>div]:lg:max-w-3xl'>
				<FormCadastro onSubmit={handleSubmit}>
					<DisciplinaSelector courseId={3} onChange={handleDisciplinasChange} />
				</FormCadastro>
			</div>
		</>
	);
}
