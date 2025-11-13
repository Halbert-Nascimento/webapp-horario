"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";

import { Disciplina, DisciplinaSelectorProps } from "../interfaces/types";

interface Professor {
	idProfessor: number;
	nomeProfessor: string;
	titulacao?: string;
}

interface Curso {
	idCurso: number;
	nomeCurso: string;
	duracaoSemestres: number;
}

export default function DisciplinaSelector({
	courseId,
	onChange,
	className = "",
}: DisciplinaSelectorProps) {
	const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
	const [professores, setProfessores] = useState<Professor[]>([]);
	const [curso, setCurso] = useState<Curso | null>(null);
	const [selecionados, setSelecionados] = useState<number[]>([]);
	const [professorSelecionado, setProfessorSelecionado] = useState<
		number | null
	>(null);
	const [semestreSelecionado, setSemestreSelecionado] = useState<number | null>(
		null,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Carregar professores ao montar o componente
	useEffect(() => {
		const carregarProfessores = async () => {
			try {
				const response = await api.get<Professor[]>(`/professor`);
				const professoresUnicos = response.data.filter(
					(prof, index, self) =>
						index === self.findIndex((p) => p.idProfessor === prof.idProfessor),
				);
				setProfessores(professoresUnicos || []);
			} catch (err) {
				console.error("Erro ao carregar professores:", err);
			}
		};

		carregarProfessores();
	}, []);

	// Carregar dados do curso e disciplinas
	useEffect(() => {
		if (!courseId) {
			setDisciplinas([]);
			setCurso(null);
			return;
		}

		const carregarDados = async () => {
			try {
				setLoading(true);
				setError(null);

				console.log("🔍 Buscando curso:", courseId);

				// Buscar dados do curso e disciplinas em paralelo
				const [cursoRes, disciplinasRes] = await Promise.all([
					api.get<Curso>(`/curso/${courseId}`),
					api.get<Disciplina[]>(`/disciplina/curso/${courseId}`),
				]);

				console.log("📚 Resposta curso completa:", cursoRes);
				console.log("📚 Dados do curso:", cursoRes.data);
				console.log("📚 Tipo de cursoRes.data:", typeof cursoRes.data);

				// Verificar se os dados vêm dentro de um wrapper
				const dadosCurso = cursoRes.data?.data || cursoRes.data;

				console.log("✅ Dados processados do curso:", dadosCurso);

				// Definir curso
				setCurso(dadosCurso);

				// Processar disciplinas
				const disciplinasArray = Array.isArray(disciplinasRes.data)
					? disciplinasRes.data
					: disciplinasRes.data?.data || [];

				const disciplinasUnicas = disciplinasArray.filter(
					(disc, index, self) =>
						index ===
						self.findIndex((d) => d.idDisciplina === disc.idDisciplina),
				);

				console.log("📖 Disciplinas carregadas:", disciplinasUnicas);

				setDisciplinas(disciplinasUnicas || []);
			} catch (err: any) {
				console.error("❌ Erro ao carregar dados:", err);
				console.error("❌ Resposta do erro:", err.response?.data);
				setError("Erro ao carregar dados");
			} finally {
				setLoading(false);
			}
		};

		carregarDados();
	}, [courseId]);

	const toggle = (id: number) => {
		const novo = selecionados.includes(id)
			? selecionados.filter((i) => i !== id)
			: [...selecionados, id];
		setSelecionados(novo);
		onChange?.(novo, professorSelecionado);
	};

	const handleProfessorChange = (profId: number | null) => {
		setProfessorSelecionado(profId);
		onChange?.(selecionados, profId);
	};

	// Agrupar disciplinas por semestre
	const disciplinasPorSemestre = disciplinas.reduce((acc, disc) => {
		const semestre = disc.semestreDisciplina;
		if (!acc[semestre]) {
			acc[semestre] = [];
		}
		acc[semestre].push(disc);
		return acc;
	}, {} as Record<number, Disciplina[]>);

	// Gerar array de semestres baseado na duração do curso
	const semestres = curso
		? Array.from({ length: curso.duracaoSemestres }, (_, i) => i + 1)
		: [];

	console.log("🎨 Renderizando - curso:", curso);
	console.log("🎨 Renderizando - semestres:", semestres);

	// Filtrar disciplinas do semestre selecionado
	const disciplinasFiltradas = semestreSelecionado
		? disciplinasPorSemestre[semestreSelecionado] || []
		: [];

	if (error) {
		return <span className='text-sm text-red-600'>{error}</span>;
	}

	return (
		<div className={`flex flex-col gap-4 ${className}`}>
			{/* Select de Professor */}
			<div className='flex flex-col gap-2'>
				<label className='text-gray-800 font-bold text-xs sm:text-sm lg:text-base'>
					Selecione o Professor
				</label>
				<select
					value={professorSelecionado || ""}
					onChange={(e) =>
						handleProfessorChange(Number(e.target.value) || null)
					}
					className='w-full px-4 py-3.5 border-2 border-gray-800 rounded-2xl text-sm sm:text-base text-gray-700 bg-white focus:outline-none focus:border-blue-600 transition-colors'
				>
					<option value=''>Selecione um professor</option>
					{professores.map((prof) => (
						<option
							key={`professor-${prof.idProfessor}`}
							value={prof.idProfessor}
						>
							{prof.nomeProfessor}
							{prof.titulacao && ` (${prof.titulacao})`}
						</option>
					))}
				</select>
			</div>

			{/* Container de Semestres e Disciplinas */}
			<div className='flex flex-col gap-4'>
				<label className='text-gray-800 font-semibold text-base sm:text-lg'>
					Selecione o semestre e as disciplinas
				</label>

				{loading ? (
					<span className='text-sm text-gray-600'>
						Carregando disciplinas...
					</span>
				) : !courseId ? (
					<span className='text-sm text-gray-600'>
						Nenhum curso selecionado
					</span>
				) : semestres.length > 0 ? (
					<div className='flex flex-col gap-4'>
						{/* Botões de Semestres */}
						<div className='flex flex-wrap gap-3'>
							{semestres.map((semestre) => {
								const qtdDisciplinas =
									disciplinasPorSemestre[semestre]?.length || 0;
								return (
									<button
										key={`semestre-${semestre}`}
										type='button'
										onClick={() => setSemestreSelecionado(semestre)}
										className={`px-6 py-2.5 rounded-lg border-2 transition-colors font-medium text-sm sm:text-base
                                        ${
																					semestreSelecionado === semestre
																						? "bg-green-700 text-white border-green-700 hover:bg-green-800 hover:border-green-800"
																						: "bg-white text-gray-800 border-gray-800 hover:bg-gray-100"
																				}
                                    `}
									>
										{semestre}º Semestre ({qtdDisciplinas})
									</button>
								);
							})}
						</div>

						{/* Disciplinas do Semestre Selecionado */}
						{semestreSelecionado ? (
							<div className='border-2 border-gray-300 rounded-2xl p-6 bg-gray-50'>
								<h3 className='text-gray-800 font-semibold text-base sm:text-lg mb-4'>
									Disciplinas do {semestreSelecionado}º Semestre
								</h3>
								<div className='flex flex-wrap gap-3'>
									{disciplinasFiltradas.length > 0 ? (
										disciplinasFiltradas.map((d) => {
											const id = d.idDisciplina;
											const ativo = selecionados.includes(id);
											return (
												<button
													key={`disciplina-${id}`}
													type='button'
													onClick={() => toggle(id)}
													className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm sm:text-base whitespace-nowrap
                                                    ${
																											ativo
																												? "bg-blue-800 text-white border-blue-800 hover:bg-blue-950 hover:border-blue-950"
																												: "bg-white text-gray-800 border-gray-800 hover:bg-gray-200"
																										}
                                                `}
													title={d.nomeDisciplina}
												>
													{d.nomeDisciplina}
												</button>
											);
										})
									) : (
										<span className='text-sm text-gray-600'>
											Nenhuma disciplina cadastrada neste semestre
										</span>
									)}
								</div>
							</div>
						) : (
							<div className='border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center'>
								<span className='text-gray-500 text-sm sm:text-base'>
									👆 Selecione um semestre acima para ver as disciplinas
								</span>
							</div>
						)}
					</div>
				) : (
					<div className='flex flex-col gap-2 text-sm text-gray-600'>
						<span>❌ Nenhum curso encontrado</span>
						<span className='text-xs text-gray-500'>
							courseId: {courseId} | curso: {curso ? "carregado" : "null"}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
