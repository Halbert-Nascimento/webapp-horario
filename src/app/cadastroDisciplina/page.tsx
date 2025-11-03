"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import InputCadastro from "@/components/InputCadastro";
import SelectCadastro from "@/components/SelectCadastro";
import FormCadastro from "@/components/FormCadastro";
import api from "@/services/api";
import toast from "react-hot-toast";

interface Curso {
	idCurso: number;
	nomeCurso: string;
}

export default function CadastroDisciplina() {
	const [nomeDisciplina, setNomeDisciplina] = useState("");
	const [idCurso, setIdCurso] = useState("");
	const [modalidade, setModalidade] = useState("");
	const [tipoSala, setTipoSala] = useState("");
	const [cargaHoraria, setCargaHoraria] = useState("");
	const [cursos, setCursos] = useState<Curso[]>([]);
	const [loading, setLoading] = useState(false);
	const [loadingCursos, setLoadingCursos] = useState(true);

	const modalidades = [
		{ value: "Presencial", label: "Presencial" },
		{ value: "Online", label: "Online" },
		{ value: "Hibrido", label: "Híbrido" },
	];

	const tiposSala = [
		{ value: "Laboratório", label: "Laboratório" },
		{ value: "Sala", label: "Sala" },
		{ value: "Sincrona", label: "Síncrona" },
	];

	useEffect(() => {
		carregarCursos();
	}, []);

	const carregarCursos = async () => {
		try {
			setLoadingCursos(true);
			const response = await api.get<Curso[]>("/curso");
			setCursos(response.data);
		} catch (error) {
			console.error("Erro ao carregar cursos:", error);
			toast.error("Erro ao carregar lista de cursos");
		} finally {
			setLoadingCursos(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!nomeDisciplina.trim()) {
			toast.error("Nome da disciplina é obrigatório");
			return;
		}

		if (!idCurso) {
			toast.error("Selecione um curso");
			return;
		}

		if (!modalidade) {
			toast.error("Selecione a modalidade");
			return;
		}

		if (!tipoSala) {
			toast.error("Selecione o tipo de sala");
			return;
		}

		if (!cargaHoraria || parseInt(cargaHoraria) <= 0) {
			toast.error("Carga horária inválida");
			return;
		}

		try {
			setLoading(true);

			const payloadDisciplina = {
				nomeDisciplina: nomeDisciplina.trim(),
				modalidade: modalidade,
				tipo_sala: tipoSala,
				carga_horaria: parseInt(cargaHoraria),
			};

			// 1. Cadastrar a disciplina
			await api.post("/disciplina", payloadDisciplina);

			// 2. Buscar todas as disciplinas para pegar o ID da recém-criada
			const responseDisciplinas = await api.get("/disciplina");

			// 3. Encontrar a disciplina pelo nome (a última criada com esse nome)
			const disciplinaCriada = responseDisciplinas.data.find(
				(disc: any) => disc.nomeDisciplina === nomeDisciplina.trim(),
			);

			if (!disciplinaCriada || !disciplinaCriada.idDisciplina) {
				throw new Error(
					"Não foi possível encontrar o ID da disciplina cadastrada",
				);
			}

			// 4. Associar disciplina ao curso
			const payloadDisciplinaCurso = {
				idDisciplina: disciplinaCriada.idDisciplina,
				idCurso: parseInt(idCurso),
			};

			await api.post("/disciplina/curso", payloadDisciplinaCurso);

			toast.success("Disciplina cadastrada e associada ao curso com sucesso!");

			// Limpar os campos
			setNomeDisciplina("");
			setIdCurso("");
			setModalidade("");
			setTipoSala("");
			setCargaHoraria("");
		} catch (error: any) {
			console.error("❌ ERRO:", error);

			let mensagemErro = "Erro ao cadastrar disciplina";

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
			<Header title='Cadastro de Disciplina' />
			<NavBar />
			<FormCadastro onSubmit={handleSubmit}>
				<InputCadastro
					label='Nome da Disciplina'
					placeHolder='Ex: Práticas Orientadas'
					type='text'
					value={nomeDisciplina}
					onChange={(e) => setNomeDisciplina(e.target.value)}
					disabled={loading}
				/>

				<SelectCadastro
					label='Curso da Disciplina'
					value={idCurso}
					onChange={(e) => setIdCurso(e.target.value)}
					disabled={loading || loadingCursos}
					placeholder={
						loadingCursos ? "Carregando cursos..." : "Selecione um curso"
					}
					options={cursos.map((curso) => ({
						value: curso.idCurso,
						label: curso.nomeCurso,
					}))}
				/>

				<SelectCadastro
					label='Modalidade da Disciplina'
					value={modalidade}
					onChange={(e) => setModalidade(e.target.value)}
					disabled={loading}
					placeholder='Selecione a modalidade'
					options={modalidades}
				/>

				<SelectCadastro
					label='Tipo de Sala'
					value={tipoSala}
					onChange={(e) => setTipoSala(e.target.value)}
					disabled={loading}
					placeholder='Selecione o tipo de sala'
					options={tiposSala}
				/>

				<InputCadastro
					label='Carga Horária'
					placeHolder='Ex: 120'
					type='number'
					value={cargaHoraria}
					onChange={(e) => setCargaHoraria(e.target.value)}
					disabled={loading}
				/>
			</FormCadastro>
		</>
	);
}
