"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";

import { Disciplina, DisciplinaSelectorProps } from "../interfaces/types";

interface Professor {
	idProfessor: number;
	nomeProfessor: string;
	titulacao?: string;
}

export default function DisciplinaSelector({
	courseId = 3,
	onChange,
	className = "",
}: DisciplinaSelectorProps) {
	const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
	const [professores, setProfessores] = useState<Professor[]>([]);
	const [selecionados, setSelecionados] = useState<number[]>([]);
	const [professorSelecionado, setProfessorSelecionado] = useState<
		number | null
	>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const carregar = async () => {
			try {
				setLoading(true);
				setError(null);
				const [disciplinasRes, professoresRes] = await Promise.all([
					api.get<Disciplina[]>(`/disciplina/curso/${courseId}`),
					api.get<Professor[]>(`/professor/curso/${courseId}`),
				]);
				setDisciplinas(disciplinasRes.data || []);
				setProfessores(professoresRes.data || []);
			} catch (err: any) {
				console.error(err);
				setError("Erro ao carregar dados");
			} finally {
				setLoading(false);
			}
		};

		carregar();
	}, [courseId]);

	const toggle = (id: number) => {
		const novo = selecionados.includes(id)
			? selecionados.filter((i) => i !== id)
			: [...selecionados, id];
		setSelecionados(novo);
		onChange?.(
			novo,
			disciplinas.filter((d) => novo.includes(d.idDisciplina)),
		);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen ml-0 lg:ml-72 pt-16'>
				<span className='text-sm text-gray-600'>Carregando dados...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen ml-0 lg:ml-72 pt-16'>
				<span className='text-sm text-red-600'>{error}</span>
			</div>
		);
	}

	return (
		<div className='flex items-center justify-center min-h-screen ml-0 lg:ml-72 pt-16 px-4'>
			<div
				className={`flex flex-col gap-6 items-center w-full max-w-5xl ${className}`}
			>
				{/* Select de Professor */}
				<div className='flex flex-col gap-2 w-full max-w-md'>
					<label className='text-gray-800 font-medium text-sm sm:text-base'>
						Selecione o Professor
					</label>
					<select
						value={professorSelecionado || ""}
						onChange={(e) =>
							setProfessorSelecionado(Number(e.target.value) || null)
						}
						className='w-full px-4 py-2.5 border-2 border-gray-800 rounded-full text-sm sm:text-base text-gray-700 bg-white focus:outline-none focus:border-blue-600 transition-colors'
					>
						<option value=''>Selecione um professor</option>
						{professores.map((prof) => (
							<option key={prof.idProfessor} value={prof.idProfessor}>
								{prof.nomeProfessor}
								{prof.titulacao && ` (${prof.titulacao})`}
							</option>
						))}
					</select>
				</div>

				{/* Label de Disciplinas */}
				<label className='text-gray-800 font-semibold text-base sm:text-lg text-center'>
					Selecione as disciplinas
				</label>

				{/* Botões de Disciplinas */}
				<div className='flex flex-wrap justify-center items-center gap-3'>
					{disciplinas.map((d) => {
						const id = d.idDisciplina;
						const ativo = selecionados.includes(id);
						return (
							<button
								key={id}
								type='button'
								onClick={() => toggle(id)}
								className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 transition-colors text-sm sm:text-base whitespace-nowrap
                                    ${
																			ativo
																				? "bg-blue-800 text-white border-blue-800 hover:bg-blue-950 hover:border-blue-950"
																				: "bg-white text-black border-black hover:bg-gray-200"
																		}
                                `}
								title={d.nomeDisciplina}
							>
								{d.nomeDisciplina}
							</button>
						);
					})}
					{disciplinas.length === 0 && (
						<span className='text-sm text-gray-600'>
							Nenhuma disciplina encontrada.
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
