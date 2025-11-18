"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import DisciplinaSelector from "@/components/DisciplinaSelector";
import FormCadastro from "@/components/FormCadastro";
import PrivateRoute from "@/components/PrivateRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

import api from "@/services/api";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Professor, Disciplina } from "@/interfaces/types";

export default function VincularDisciplinaProfessor() {
	const [disciplinasIds, setDisciplinasIds] = useState<number[]>([]);
	const [professorId, setProfessorId] = useState<number | null>(null);
	const [professores, setProfessores] = useState<Professor[]>([]); // Adicione esta linha
	const [resetKey, setResetKey] = useState(0);
	const [loading, setLoading] = useState(false);
	const [loadingProfessores, setLoadingProfessores] = useState(false);

	// Carregar professores ao montar o componente
	useEffect(() => {
		const carregarProfessores = async () => {
			try {
				setLoadingProfessores(true);
				const response = await api.get<Professor[]>("/professor");
				setProfessores(response.data);
			} catch (error) {
				toast.error("Erro ao carregar professores");
			} finally {
				setLoadingProfessores(false);
			}
		};

		carregarProfessores();
	}, []);

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
			setLoading(true);

			console.log("📤 Iniciando cadastro de vínculos...");

			// Cadastrar cada disciplina separadamente
			for (const idDisciplina of disciplinasIds) {
				const payload = {
					idDisciplina: idDisciplina,
					idProfessor: professorId,
				};

				console.log("📤 Enviando payload:", payload);
				await api.post("/professorDisciplina", payload);
			}

			toast.success(
				`${disciplinasIds.length} disciplina(s) vinculada(s) com sucesso!`,
			);

			// Reset form
			setDisciplinasIds([]);
			setProfessorId(null);
			setResetKey((prev) => prev + 1);
		} catch (error: any) {
			let mensagemErro = "Erro ao vincular disciplinas";

			if (error.response?.data) {
				const errorData = error.response.data;
				mensagemErro =
					errorData.error ||
					errorData.message ||
					errorData.msg ||
					errorData.mensagem ||
					(typeof errorData === "string" ? errorData : mensagemErro);
			} else if (error.message) {
				mensagemErro = error.message;
			}

			toast.error(mensagemErro, {
				duration: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<PrivateRoute>
			<RoleProtectedRoute
				allowedProfiles={[1, 2]}
				pageName='Vincular Professor a Disciplina'
			>
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
			</RoleProtectedRoute>
		</PrivateRoute>
	);
}
