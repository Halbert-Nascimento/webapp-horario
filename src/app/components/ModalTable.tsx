"use client";
import api from "@/services/api";
import { useEffect, useState } from "react";

import { Professor, Disciplina, ModalProps } from "../interfaces/types";

export default function Modal({
	isOpen,
	onClose,
	onSave,
	dia,
	semestre,
	idGrade = 1,
	idCelula,
}: ModalProps) {
	const [professores, setProfessores] = useState<Professor[]>([]);
	const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		professorId: "",
		disciplinaId: "",
	});

	useEffect(() => {
		if (isOpen) {
			carregarDados();
			setFormData({
				professorId: "",
				disciplinaId: "",
			});
		}
	}, [isOpen]);

	const carregarDados = async () => {
		try {
			setLoading(true);
			const [professoresResponse, disciplinasResponse] = await Promise.all([
				api.get<Professor[]>("/professor"),
				api.get<Disciplina[]>("/disciplina"),
			]);

			setProfessores(professoresResponse.data);
			setDisciplinas(disciplinasResponse.data);
		} catch (error) {
			console.error("Erro ao carregar professores e disciplinas:", error);
		} finally {
			setLoading(false);
		}
	};

	const getDiaSemanaNumero = (diaNome: string): number => {
		const diasMap: { [key: string]: number } = {
			"Segunda-feira": 1,
			"Terça-feira": 2,
			"Quarta-feira": 3,
			"Quinta-feira": 4,
			"Sexta-feira": 5,
			Sábado: 6,
			Domingo: 0,
		};
		return diasMap[diaNome] || 0;
	};

	const handleSalvar = async () => {
		if (!formData.professorId || !formData.disciplinaId) {
			alert("Por favor, selecione o professor e a disciplina");
			return;
		}

		const professorSelecionado = professores.find(
			(p) => p.idProfessor.toString() === formData.professorId,
		);
		const disciplinaSelecionada = disciplinas.find(
			(d) => d.idDisciplina.toString() === formData.disciplinaId,
		);

		if (!professorSelecionado || !disciplinaSelecionada) {
			alert("Erro ao encontrar professor ou disciplina selecionados");
			return;
		}

		const conteudo = `${disciplinaSelecionada.nomeDisciplina}\n${professorSelecionado.nomeProfessor}`;
		const semestreNumero = parseInt(semestre.replace("º Semestre", ""));
		const diaSemanaNumero = getDiaSemanaNumero(dia);

		try {
			const payload = {
				idGrade: idGrade,
				idDisciplina: parseInt(formData.disciplinaId),
				idProfessor: parseInt(formData.professorId),
				dia_semana: diaSemanaNumero,
				semestre: semestreNumero,
			};

			await api.post("/celula", payload);
			onSave(conteudo);
		} catch (error: any) {
			console.error("Erro ao salvar:", error);
			alert(
				`Erro ao salvar os dados: ${
					error.response?.data?.message || error.message
				}`,
			);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50'>
			<div className='bg-white rounded-2xl p-8 w-full max-w-5xl shadow-2xl'>
				<div className='flex justify-center mb-6'>
					<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
						<svg
							className='w-8 h-8 text-green-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
					</div>
				</div>

				<h2 className='text-2xl font-bold text-center mb-8 text-gray-800'>
					Adicionar Aula
				</h2>

				{loading ? (
					<div className='text-center py-8'>Carregando opções...</div>
				) : (
					<div className='grid grid-cols-3 gap-6 mb-8'>
						<div className='flex flex-col'>
							<label className='block text-sm font-semibold mb-3 text-gray-700 h-6'>
								Disciplina
							</label>
							<select
								value={formData.disciplinaId}
								onChange={(e) =>
									setFormData({ ...formData, disciplinaId: e.target.value })
								}
								className='w-full h-12 border border-gray-300 rounded-lg pl-4 pr-8 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								style={{ backgroundPosition: "right 0.5rem center" }}
							>
								<option value=''>Selecione a disciplina</option>
								{disciplinas.map((disciplina) => (
									<option
										key={disciplina.idDisciplina}
										value={disciplina.idDisciplina}
									>
										{disciplina.nomeDisciplina}
									</option>
								))}
							</select>
						</div>

						<div className='flex flex-col'>
							<label className='block text-sm font-semibold mb-3 text-gray-700 h-6'>
								Professor
							</label>
							<select
								value={formData.professorId}
								onChange={(e) =>
									setFormData({ ...formData, professorId: e.target.value })
								}
								className='w-full h-12 border border-gray-300 rounded-lg pl-4 pr-8 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								style={{ backgroundPosition: "right 0.5rem center" }}
							>
								<option value=''>Selecione o professor</option>
								{professores.map((professor) => (
									<option
										key={professor.idProfessor}
										value={professor.idProfessor}
									>
										{professor.nomeProfessor}
										{professor.titulacao && ` (${professor.titulacao})`}
									</option>
								))}
							</select>
						</div>

						<div className='flex flex-col'>
							<label className='block text-sm font-semibold mb-3 text-gray-700 h-6'>
								Horário
							</label>
							<div className='w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 bg-gray-50 flex items-center'>
								{dia} - {semestre}
							</div>
						</div>
					</div>
				)}

				<div className='flex justify-center gap-4'>
					<button
						onClick={onClose}
						className='px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
					>
						Voltar
					</button>
					<button
						onClick={handleSalvar}
						disabled={loading}
						className='px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400'
					>
						Criar
					</button>
				</div>
			</div>
		</div>
	);
}
