"use client";
import { useState } from "react";

interface Disciplina {
	idDisciplina: number;
	nomeDisciplina: string;
}

interface ResumoSelecaoProps {
	professorNome?: string;
	disciplinas: Disciplina[];
	onRemoverDisciplina: (id: number) => void;
}

export default function ResumoSelecao({
	professorNome,
	disciplinas,
	onRemoverDisciplina,
}: ResumoSelecaoProps) {
	const [expandido, setExpandido] = useState(false);
	const temSelecao = disciplinas.length > 0 || professorNome;

	if (!temSelecao) {
		return null;
	}

	return (
		<div className='w-full mt-6'>
			<div className='max-w-4xl mx-auto border-2 border-black rounded-xl bg-gray-50 shadow-md overflow-hidden transition-all'>
				{/* Header - Sempre Visível */}
				<button
					type='button'
					onClick={() => setExpandido(!expandido)}
					className='w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors'
				>
					<div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1'>
						<h3 className='text-black font-bold text-base flex items-center gap-2'>
							📋 Resumo da Seleção
						</h3>
						<div className='flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto'>
							{professorNome && (
								<span className='bg-blue-200 text-gray-800 px-3 py-1.5 rounded-full font-medium truncate max-w-full sm:max-w-xs'>
									👨‍🏫 {professorNome}
								</span>
							)}
							{disciplinas.length > 0 && (
								<span className='bg-green-200 text-gray-800 px-3 py-1.5 rounded-full font-medium whitespace-nowrap'>
									📚 {disciplinas.length} disciplina
									{disciplinas.length !== 1 ? "s" : ""}
								</span>
							)}
						</div>
					</div>
					<span
						className='text-black font-bold text-xl transition-transform duration-300 flex-shrink-0 ml-2'
						style={{ transform: expandido ? "rotate(180deg)" : "rotate(0deg)" }}
					>
						▼
					</span>
				</button>

				{/* Conteúdo - Expansível */}
				<div
					className={`transition-all duration-300 ease-in-out ${
						expandido ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<div className='px-4 pb-4'>
						<div className='border-t-2 border-gray-300 pt-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{/* Professor Selecionado */}
								{professorNome && (
									<div className='flex flex-col gap-1.5'>
										<span className='text-black font-semibold text-xs'>
											👨‍🏫 Professor:
										</span>
										<div className='bg-white px-3 py-2 rounded-lg border border-gray-300'>
											<span className='text-gray-800 text-sm font-medium'>
												{professorNome}
											</span>
										</div>
									</div>
								)}

								{/* Disciplinas Selecionadas */}
								{disciplinas.length > 0 && (
									<div className='flex flex-col gap-1.5 md:col-span-2'>
										<span className='text-black font-semibold text-xs'>
											📚 Disciplinas Selecionadas ({disciplinas.length}):
										</span>
										<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
											{disciplinas.map((d) => (
												<div
													key={`resumo-${d.idDisciplina}`}
													className='bg-white px-3 py-2 rounded-lg border border-gray-300 flex items-center justify-between hover:border-gray-600 transition-colors'
												>
													<span className='text-gray-800 text-xs font-medium line-clamp-2 flex-1 mr-2'>
														{d.nomeDisciplina}
													</span>
													<button
														type='button'
														onClick={() => onRemoverDisciplina(d.idDisciplina)}
														className='text-red-600 hover:text-red-800 hover:bg-red-100 px-2 py-1 rounded transition-colors font-bold text-sm flex-shrink-0'
														title='Remover disciplina'
													>
														✕
													</button>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Mensagens de Alerta */}
								<div className='flex flex-col gap-2 md:col-span-2'>
									{disciplinas.length === 0 && (
										<div className='text-amber-700 text-xs bg-amber-50 px-3 py-2 rounded-lg border border-amber-300 text-center'>
											⚠️ Selecione disciplinas
										</div>
									)}

									{!professorNome && (
										<div className='text-amber-700 text-xs bg-amber-50 px-3 py-2 rounded-lg border border-amber-300 text-center'>
											⚠️ Selecione um professor
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
