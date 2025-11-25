"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import DisciplinaSelector from "@/components/DisciplinaSelector";
import FormCadastro from "@/components/FormCadastro";
import ProtectedRoute from "@/components/ProtectedRoute";

import api from "@/services/api";
import toast from "react-hot-toast";
import { useState } from "react";

export default function VincularDisciplinaProfessor() {
	const [disciplinasIds, setDisciplinasIds] = useState<number[]>([]);
	const [professorId, setProfessorId] = useState<number | null>(null);
	const [resetKey, setResetKey] = useState(0);
	const [submitting, setSubmitting] = useState(false);

	const handleDisciplinasChange = (
		disciplinasIds: number[],
		professorId: number | null,
	) => {
		setDisciplinasIds(disciplinasIds);
		setProfessorId(professorId);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!professorId) {
			toast.error("Selecione um professor");
			return;
		}

		if (disciplinasIds.length === 0) {
			toast.error("Selecione pelo menos uma disciplina");
			return;
		}

		try {
			setSubmitting(true);

			// Cadastrar cada disciplina separadamente
			for (const idDisciplina of disciplinasIds) {
				const payload = {
					idDisciplina: idDisciplina,
					idProfessor: professorId,
				};
				await api.post("/professorDisciplina", payload);
			}

			toast.success(
				`${disciplinasIds.length} disciplina(s) vinculada(s) com sucesso!`,
			);

			// Reset form
			setDisciplinasIds([]);
			setProfessorId(null);
			setResetKey((prev) => prev + 1);
		} catch (error) {
			const axiosError = error as { response?: { data?: string | { error?: string; message?: string; msg?: string; mensagem?: string } }; message?: string };
			let mensagemErro = "Erro ao vincular disciplinas";

			if (axiosError.response?.data) {
				const errorData = axiosError.response.data;
				if (typeof errorData === "string") {
					mensagemErro = errorData;
				} else {
					mensagemErro = errorData.error || errorData.message || errorData.msg || errorData.mensagem || mensagemErro;
				}
			} else if (axiosError.message) {
				mensagemErro = axiosError.message;
			}

			toast.error(mensagemErro, {
				duration: 5000,
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ProtectedRoute allowedRoles={["admin", "coordenador"]}>
			<Header title='Vincular Professor a Disciplina' />
			<NavBar />
			<div className='[&>div>div]:lg:max-w-3xl'>
				<FormCadastro onSubmit={handleSubmit}>
					<DisciplinaSelector
						key={resetKey} // Força remontagem quando resetKey muda
						courseId={3}
						onChange={handleDisciplinasChange}
					/>
				</FormCadastro>
			</div>
		</ProtectedRoute>
	);
}
