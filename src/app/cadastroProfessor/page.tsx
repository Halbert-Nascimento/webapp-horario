"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import FormCadastro from "@/components/FormCadastro";
import InputCadastro from "@/components/InputCadastro";
import DisponibilidadeDias from "@/components/DisponibilidadeDias";
import SelectCadastro from "@/components/SelectCadastro";
import ProtectedRoute from "@/components/ProtectedRoute";

import api from "@/services/api";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CadastroProfessor() {
	const [nomeProfessor, setNomeProfessor] = useState("");
	const [email, setEmail] = useState("");
	const [titulacao, setTitulacao] = useState("");
	const [curriculoLattes, setCurriculoLattes] = useState("");
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
				curriculo_lattes: curriculoLattes.trim() || null,
				idCoordenador: null, // Definir como null ou um ID específico se necessário
			};

			console.log("📤 Enviando payload professor:", payloadProfessor);

			const responseProfessor = await api.post("/professor", payloadProfessor);

			console.log("✅ Resposta professor:", responseProfessor.data);

			// 2. Buscar o ID do professor cadastrado
			const idProfessor =
				responseProfessor.data.data?.idProfessor ||
				responseProfessor.data.idProfessor ||
				responseProfessor.data.insertId;

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

					console.log("📤 Enviando disponibilidade:", payloadDisponibilidade);
					await api.post("/disponibilidade", payloadDisponibilidade);
				}
			} else {
				// 3. Cadastrar as disponibilidades
				for (const idDiaSemana of diasSelecionados) {
					const payloadDisponibilidade = {
						idProfessor: parseInt(idProfessor),
						idDiaSemana: parseInt(idDiaSemana),
					};

					console.log("📤 Enviando disponibilidade:", payloadDisponibilidade);
					await api.post("/disponibilidade", payloadDisponibilidade);
				}
			}

			toast.success("Professor e disponibilidades cadastrados com sucesso!");

			// Limpar os campos
			setNomeProfessor("");
			setEmail("");
			setTitulacao("");
			setCurriculoLattes("");
			setDiasSelecionados([]);
		} catch (error: any) {
			console.error("❌ ERRO completo:", error);
			console.error("❌ Resposta da API:", error.response?.data);

			let mensagemErro = "Erro ao cadastrar professor";

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

			console.error("📢 Mensagem de erro extraída:", mensagemErro);

			toast.error(mensagemErro, {
				duration: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<ProtectedRoute allowedRoles={["admin", "coordenador"]}>
			<Header title='Cadastro de professor' />
			<NavBar />
			<FormCadastro onSubmit={handleSubmit}>
				<InputCadastro
					label='Nome do Professor *'
					placeHolder='Ex: Sandir'
					type='text'
					value={nomeProfessor}
					onChange={(e) => setNomeProfessor(e.target.value)}
					disabled={loading}
				/>
				<InputCadastro
					label='Email do Professor *'
					placeHolder='Ex: email@email.com'
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={loading}
				/>
				<SelectCadastro
					label='Titulação *'
					placeholder='Escolha a titulação'
					options={opcoesTitulacao}
					value={titulacao}
					onChange={(e) => setTitulacao(e.target.value)}
					disabled={loading}
				/>
				<InputCadastro
					label='Currículo Lattes do Professor'
					placeHolder='Ex: http://lattes.cnpq.br/1234567890123456'
					type='text'
					value={curriculoLattes}
					onChange={(e) => setCurriculoLattes(e.target.value)}
					disabled={loading}
				/>
				<DisponibilidadeDias onChange={handleDisponibilidadeChange} />
			</FormCadastro>
		</ProtectedRoute>
	);
}
