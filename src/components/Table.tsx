"use client";
import api from "@/services/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CelulaViewInterface, ModalData } from "../interfaces/types";

import ModalCreate from "./ModalCreate";
import ModalDelete from "./ModalDelete";

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
	const [celulasMap, setCelulasMap] = useState<{ [key: string]: number }>({});
	const [apenasImpares, setApenasImpares] = useState(true);
	const [loading, setLoading] = useState(true);
	const [modalAberto, setModalAberto] = useState(false);
	const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
	const [modalData, setModalData] = useState<ModalData | null>(null);
	const [celulaParaDeletar, setCelulaParaDeletar] = useState<{
		id: number;
		conteudo: string;
	} | null>(null);
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

			// Buscar dados de células
			const celulasResponse = await api.get<CelulaViewInterface[]>("/celula");

			// Mapear os dados da API para o formato do estado
			const dadosMapeados: { [key: string]: string } = {};
			const celulasIdMap: { [key: string]: number } = {};

			celulasResponse.data.forEach((celula: CelulaViewInterface) => {
				// Tratar dia_semana
				let diaSemana: string;
				if (typeof celula.dia_semana === "number") {
					diaSemana = getDiaSemanaString(celula.dia_semana);
				} else {
					diaSemana = celula.dia_semana;
				}

				// semestreCelula é o semestre onde a célula será exibida na tabela (1, 2, 3, etc.)
				const semestreCelula = celula.semestreCelula || 1;

				// Verificar se o dia é válido
				if (!dias.includes(diaSemana)) {
					console.warn(`⚠️ Dia inválido ignorado: ${diaSemana}`);
					return;
				}

				// Criar a chave usando dia_semana e semestreCelula
				const chave = `${diaSemana}-${semestreCelula}º Semestre`; // Armazenar o ID da célula
				if (celula.idCelula !== undefined && celula.idCelula !== null) {
					celulasIdMap[chave] = celula.idCelula;
				}

				// Construir o conteúdo formatado
				const linhas: string[] = [];

				// Linha 1: Código + Nome da Disciplina
				if (celula.codigoDisciplina && celula.disciplina) {
					linhas.push(`${celula.codigoDisciplina} - ${celula.disciplina}`);
				} else if (celula.disciplina) {
					linhas.push(celula.disciplina);
				}

				// Linha 2: Tipo de Sala
				if (celula.tipo_sala) {
					linhas.push(`${celula.tipo_sala}`);
				}

				// Linha 3: Professor + Titulação
				if (celula.professor && celula.titulacao) {
					linhas.push(`${celula.professor} (${celula.titulacao})`);
				} else if (celula.professor) {
					linhas.push(celula.professor);
				}

				const conteudo = linhas.join("\n");
				dadosMapeados[chave] = conteudo;
			});

			setDados(dadosMapeados);
			setCelulasMap(celulasIdMap);
		} catch (error) {
			toast.error("Erro ao carregar dados da tabela");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		carregarDados();
	}, []);

	const handleCellClick = (dia: string, semestre: string) => {
		const chave = `${dia}-${semestre}`;
		const idCelula = celulasMap[chave];
		const conteudo = dados[chave];

		// Verifica se tem conteúdo (célula preenchida)
		if (conteudo && conteudo.trim() !== "") {
			// Célula já existe - abrir modal de exclusão
			setCelulaParaDeletar({ id: idCelula || 0, conteudo });
			setModalDeleteAberto(true);
		} else {
			// Célula vazia - abrir modal de criação
			setModalData({ dia, semestre, chave });
			setModalAberto(true);
		}
	};

	const handleDeletar = async () => {
		if (!celulaParaDeletar) return;

		try {
			await api.delete(`/celula/${celulaParaDeletar.id}`);
			toast.success("Aula excluída com sucesso!");
			setModalDeleteAberto(false);
			setCelulaParaDeletar(null);
			await carregarDados();
		} catch (error: any) {
			let mensagemErro = "Erro ao excluir a aula";

			if (error.response?.data?.error) {
				mensagemErro = error.response.data.error;
			} else if (error.response?.data?.message) {
				mensagemErro = error.response.data.message;
			} else if (typeof error.response?.data === "string") {
				mensagemErro = error.response.data;
			}

			toast.error(mensagemErro);
		}
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

	const handleFecharModalDelete = () => {
		setModalDeleteAberto(false);
		setCelulaParaDeletar(null);
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

			{/* Modal de Criação */}
			{modalData && (
				<ModalCreate
					isOpen={modalAberto}
					onClose={handleFecharModal}
					onSave={handleSalvar}
					dia={modalData.dia}
					semestre={modalData.semestre}
					idGrade={1}
				/>
			)}

			{/* Modal de Exclusão */}
			{celulaParaDeletar && (
				<ModalDelete
					isOpen={modalDeleteAberto}
					onClose={handleFecharModalDelete}
					onDelete={handleDeletar}
					conteudo={celulaParaDeletar.conteudo}
				/>
			)}
		</div>
	);
}
