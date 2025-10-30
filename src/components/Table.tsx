"use client";
import api from "@/services/api";
import { useEffect, useState } from "react";

import { CelulaViewInterface, ModalData } from "../interfaces/types";
import ModalTable from "./ModalTable";

const dias = [
	"Segunda-feira",
	"Terça-feira",
	"Quarta-feira",
	"Quinta-feira",
	"Sexta-feira",
	"Sábado",
];

const gerarSemestres = (quantidade: number, apenasImpares = true) => {
	const lista: string[] = [];
	for (let i = 1; i <= quantidade; i++) {
		const ehImpar = i % 2 !== 0;
		if (apenasImpares && ehImpar) {
			lista.push(`${i}º Semestre`);
		} else if (!apenasImpares && !ehImpar) {
			lista.push(`${i}º Semestre`);
		}
	}
	return lista;
};

export default function Tabela() {
	const [dados, setDados] = useState<{ [key: string]: string }>({});
	const [apenasImpares, setApenasImpares] = useState(true);
	const [loading, setLoading] = useState(true);
	const [modalAberto, setModalAberto] = useState(false);
	const [modalData, setModalData] = useState<ModalData | null>(null);
	const semestres = gerarSemestres(8, apenasImpares);

	// Converter número do dia da semana para nome
	const getDiaSemanaString = (diaNumero: number): string => {
		const diasMap: { [key: number]: string } = {
			1: "Segunda-feira",
			2: "Terça-feira",
			3: "Quarta-feira",
			4: "Quinta-feira",
			5: "Sexta-feira",
			6: "Sábado",
			0: "Domingo",
		};
		return diasMap[diaNumero] || "";
	};

	const carregarDados = async () => {
		try {
			setLoading(true);

			// Buscar dados de células, professores e disciplinas em paralelo
			const [celulasResponse, professoresResponse, disciplinasResponse] =
				await Promise.all([
					api.get<CelulaViewInterface[]>("/celula"),
					api.get("/professor"),
					api.get("/disciplina"),
				]);

			// Criar mapas para acesso rápido por NOME
			const professoresMap = new Map();
			professoresResponse.data.forEach((prof: any) => {
				professoresMap.set(prof.nomeProfessor, {
					titulacao: prof.titulacao,
				});
			});

			const disciplinasMap = new Map();
			disciplinasResponse.data.forEach((disc: any) => {
				disciplinasMap.set(disc.nomeDisciplina, {
					tipoSala: disc.tipo_sala,
				});
			});

			// Mapear os dados da API para o formato do estado
			const dadosMapeados: { [key: string]: string } = {};

			celulasResponse.data.forEach((celula: CelulaViewInterface) => {
				// Tratar dia_semana
				let diaSemana: string;
				if (typeof celula.dia_semana === "number") {
					diaSemana = getDiaSemanaString(celula.dia_semana);
				} else {
					diaSemana = celula.dia_semana;
				}

				// Tratar semestre - extrair apenas o número
				let semestreNumero: number;
				if (typeof celula.semestre === "number") {
					semestreNumero = celula.semestre;
				} else if (typeof celula.semestre === "string") {
					const match = celula.semestre.match(/\d+/);
					semestreNumero = match ? parseInt(match[0]) : 0;
				} else {
					semestreNumero = 0;
				}

				// Verificar se o dia é válido
				if (!dias.includes(diaSemana)) {
					return;
				}

				// Criar a chave usando dia_semana e semestre
				const chave = `${diaSemana}-${semestreNumero}º Semestre`;

				// Buscar informações adicionais do professor e disciplina usando NOMES
				const professorInfo = professoresMap.get(celula.nomeProfessor);
				const disciplinaInfo = disciplinasMap.get(celula.nomeDisciplina);

				// Criar o conteúdo da célula
				let conteudo = celula.nomeDisciplina;

				// Adicionar professor com titulação
				if (celula.nomeProfessor) {
					if (professorInfo?.titulacao) {
						conteudo += `\n${celula.nomeProfessor} (${professorInfo.titulacao})`;
					} else {
						conteudo += `\n${celula.nomeProfessor}`;
					}
				}

				// Adicionar tipo de sala
				if (disciplinaInfo?.tipoSala) {
					conteudo += `\n${disciplinaInfo.tipoSala}`;
				}

				dadosMapeados[chave] = conteudo;
			});

			setDados(dadosMapeados);
		} catch (error) {
			console.error("Erro ao carregar dados:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		carregarDados();
	}, []);

	const handleCellClick = (dia: string, semestre: string) => {
		const chave = `${dia}-${semestre}`;
		setModalData({ dia, semestre, chave });
		setModalAberto(true);
	};

	const handleSalvar = async (conteudo: string) => {
		if (!modalData) return;

		// Atualizar o estado local imediatamente para feedback visual
		setDados({ ...dados, [modalData.chave]: conteudo });
		setModalAberto(false);
		setModalData(null);

		// Recarregar os dados da API para garantir sincronização
		await carregarDados();
	};

	const handleFecharModal = () => {
		setModalAberto(false);
		setModalData(null);
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-screen lg:ml-72'>
				<div className='text-xl'>Carregando dados...</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 lg:ml-72 pt-20'>
			<button
				onClick={() => setApenasImpares(!apenasImpares)}
				className='mb-4 bg-blue-800 text-white px-4 py-2 rounded text-sm sm:text-base'
			>
				{apenasImpares ? "Semestres Pares" : "Semestres Ímpares"}
			</button>

			<div className='w-full overflow-x-auto shadow-lg max-w-[95vw] lg:max-w-[1200px]'>
				<table className='border-separate border-spacing-0 border text-center w-full'>
					<thead>
						<tr className='bg-blue-900 text-white'>
							<th
								className='p-1 sm:p-2 h-16 sm:h-20 border border-black text-xs sm:text-sm lg:text-base sticky left-0 z-20 bg-blue-900'
								style={{ minWidth: "188px", width: "188px" }}
							>
								Dia
							</th>
							{semestres.map((s) => (
								<th
									key={s}
									className='p-1 sm:p-2 h-16 sm:h-20 border border-black text-xs sm:text-sm lg:text-base'
									style={{ width: `${100 / semestres.length}%` }}
								>
									{s}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{dias.map((dia) => (
							<tr key={dia}>
								<td
									className='border p-1 sm:p-2 font-semibold bg-gray-50 sticky left-0 z-10 h-20 sm:h-24 text-xs sm:text-sm lg:text-base'
									style={{ minWidth: "188px", width: "188px" }}
								>
									<div className='break-words'>{dia}</div>
								</td>
								{semestres.map((sem) => {
									const chave = `${dia}-${sem}`;
									const conteudo = dados[chave];
									return (
										<td
											key={chave}
											onClick={() => handleCellClick(dia, sem)}
											className='border p-1 sm:p-2 hover:bg-blue-50 cursor-pointer h-20 sm:h-24 overflow-hidden'
											style={{ width: `${100 / semestres.length}%` }}
											title={conteudo || chave}
										>
											<div className='h-full flex items-center justify-center overflow-auto text-[10px] sm:text-xs leading-tight whitespace-pre-line break-words'>
												{conteudo || ""}
											</div>
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal */}
			{modalData && (
				<ModalTable
					isOpen={modalAberto}
					onClose={handleFecharModal}
					onSave={handleSalvar}
					dia={modalData.dia}
					semestre={modalData.semestre}
					idGrade={1}
				/>
			)}
		</div>
	);
}
