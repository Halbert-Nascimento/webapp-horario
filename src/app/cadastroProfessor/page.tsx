"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import FormCadastro from "@/components/FormCadastro";
import InputCadastro from "@/components/InputCadastro";
import DisponibilidadeDias from "@/components/DisponibilidadeDias";
import SelectCadastro from "@/components/SelectCadastro";

import api from "@/services/api";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CadastroProfessor() {
	const [nomeProfessor, setNomeProfessor] = useState("");
	const [email, setEmail] = useState("");
	const [titulacao, setTitulacao] = useState("");
	const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const opcoesTitulacao = [
		{ value: "Graduado", label: "Graduado" },
		{ value: "Especialista", label: "Especialista" },
		{ value: "Mestre", label: "Mestre" },
		{ value: "Doutor", label: "Doutor" },
		{ value: "Pos Doutor", label: "Pós Doutor" },
	];

	const handleDisponibilidadeChange = (dias: string[]) => {
		setDiasSelecionados(dias);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!nomeProfessor.trim()) {
			toast.error("Nome do professor é obrigatório");
			return;
		}

		if (!email.trim()) {
			toast.error("Email é obrigatório");
			return;
		}

		if (!titulacao.trim()) {
			toast.error("Titulação é obrigatória");
			return;
		}

		// Validação básica de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Email inválido");
			return;
		}

		if (diasSelecionados.length === 0) {
			toast.error("Selecione pelo menos um dia de disponibilidade");
			return;
		}

		try {
			setLoading(true);

			// 1. Cadastrar o professor
			const payloadProfessor = {
				nomeProfessor: nomeProfessor.trim(),
				email: email.trim(),
				titulacao: titulacao.trim(),
			};

			const responseProfessor = await api.post("/professor", payloadProfessor);

			// 2. Buscar o ID do professor cadastrado
			const idProfessor =
				responseProfessor.data.data?.idProfessor ||
				responseProfessor.data.idProfessor;

			if (!idProfessor) {
				// Se não retornou o ID, buscar todos os professores e pegar o último
				const responseProfessores = await api.get("/professor");
				const professorCadastrado = responseProfessores.data.find(
					(prof: any) => prof.email === email.trim(),
				);

				if (!professorCadastrado || !professorCadastrado.idProfessor) {
					throw new Error(
						"Não foi possível obter o ID do professor cadastrado",
					);
				}

				// 3. Cadastrar as disponibilidades
				for (const idDiaSemana of diasSelecionados) {
					const payloadDisponibilidade = {
						idProfessor: professorCadastrado.idProfessor,
						idDiaSemana: parseInt(idDiaSemana),
					};

					await api.post("/disponibilidade", payloadDisponibilidade);
				}
			} else {
				// 3. Cadastrar as disponibilidades
				for (const idDiaSemana of diasSelecionados) {
					const payloadDisponibilidade = {
						idProfessor: parseInt(idProfessor),
						idDiaSemana: parseInt(idDiaSemana),
					};

					await api.post("/disponibilidade", payloadDisponibilidade);
				}
			}

			toast.success("Professor e disponibilidades cadastrados com sucesso!");

			// Limpar os campos
			setNomeProfessor("");
			setEmail("");
			setTitulacao("");
			setDiasSelecionados([]);
		} catch (error: any) {
			let mensagemErro = "Erro ao cadastrar professor";

			if (error.response?.data?.message) {
				mensagemErro = error.response.data.message;
			} else if (error.response?.data?.error) {
				mensagemErro = error.response.data.error;
			} else if (error.message) {
				mensagemErro = error.message;
			}

			toast.error(mensagemErro);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Header title='Cadastro de professor' />
			<NavBar />
			<FormCadastro onSubmit={handleSubmit}>
				<InputCadastro
					label='Nome do Professor'
					placeHolder='Ex: Sandir'
					type='text'
					value={nomeProfessor}
					onChange={(e) => setNomeProfessor(e.target.value)}
				/>
				<InputCadastro
					label='Email do Professor'
					placeHolder='Ex: email@email.com'
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<SelectCadastro
					label='Titulação'
					placeholder='Escolha a titulação'
					options={opcoesTitulacao}
					value={titulacao}
					onChange={(e) => setTitulacao(e.target.value)}
				/>
				<InputCadastro
					label='Currículo Lattes do Professor'
					placeHolder='Ex: http://lattes.cnpq.br/1234567890123456'
					type='text'
					value={nomeProfessor}
					onChange={(e) => setNomeProfessor(e.target.value)}
				/>
				<DisponibilidadeDias onChange={handleDisponibilidadeChange} />
			</FormCadastro>
		</>
	);
}
