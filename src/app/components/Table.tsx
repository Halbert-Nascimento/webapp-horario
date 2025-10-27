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
	const semestres = gerarSemestres(10, apenasImpares);

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
			const response = await api.get<CelulaViewInterface[]>("/celula");

			// Mapear os dados da API para o formato do estado
			const dadosMapeados: { [key: string]: string } = {};
			response.data.forEach((celula: CelulaViewInterface, index) => {
				// Verificar se dia_semana é número ou string
				let diaSemana: string;
				if (typeof celula.dia_semana === "number") {
					diaSemana = getDiaSemanaString(celula.dia_semana);
				} else {
					diaSemana = celula.dia_semana;
				}

				// Extrair número do semestre
				let semestreNumero: string;
				if (typeof celula.semestre === "number") {
					semestreNumero = String(celula.semestre);
				} else if (
					typeof celula.semestre === "string" &&
					celula.semestre.includes("/")
				) {
					semestreNumero = celula.semestre.split("/")[1];
				} else if (typeof celula.semestre === "string") {
					semestreNumero = celula.semestre;
				} else {
					semestreNumero = "";
				}

				// Criar a chave usando dia_semana e semestre
				const chave = `${diaSemana}-${semestreNumero}º Semestre`;

				// Criar o conteúdo da célula
				const conteudo = `${celula.disciplina}\n${celula.professor}`;
				dadosMapeados[chave] = conteudo;
			});

			setDados(dadosMapeados);
		} catch (error) {
			console.error("❌ Erro ao carregar dados:", error);
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
			<div className='flex justify-center items-center h-screen'>
				<div className='text-xl'>Carregando dados...</div>
			</div>
		);
	}

	return (
		<div className='overflow-auto max-w-2/3 h-[80vh] p-4'>
			<button
				onClick={() => setApenasImpares(!apenasImpares)}
				className='mb-4 bg-blue-600 text-white px-4 py-2 rounded'
			>
				Mostrar {apenasImpares ? "Semestres Pares" : "Semestres Ímpares"}
			</button>

			<table className='border-separate border-spacing-0 border text-center'>
				<thead>
					<tr className='bg-blue-900 text-white'>
						<th className='p-2 w-40 min-w-40 max-w-40 h-20'>Dia</th>
						{semestres.map((s) => (
							<th key={s} className='p-2 w-48 min-w-48 max-w-48 h-20'>
								{s}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{dias.map((dia) => (
						<tr key={dia}>
							<td className='border p-2 font-semibold w-40 min-w-40 max-w-40 bg-gray-50 sticky left-0 z-10 h-24'>
								{dia}
							</td>
							{semestres.map((sem) => {
								const chave = `${dia}-${sem}`;
								const conteudo = dados[chave];
								return (
									<td
										key={chave}
										onClick={() => handleCellClick(dia, sem)}
										className='border p-2 hover:bg-blue-50 cursor-pointer w-48 min-w-48 max-w-48 h-24 max-h-24 overflow-hidden align-top'
										title={conteudo || chave}
									>
										<div className='h-full overflow-auto text-xs leading-tight whitespace-pre-line break-words'>
											{conteudo || ""}
										</div>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>

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
