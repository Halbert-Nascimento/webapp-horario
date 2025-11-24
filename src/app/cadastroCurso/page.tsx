"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import FormCadastro from "@/components/FormCadastro";
import InputCadastro from "@/components/InputCadastro";
import ProtectedRoute from "@/components/ProtectedRoute";

import api from "@/services/api";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CadastroCurso() {
	const [nomeCurso, setNomeCurso] = useState("");
	const [codigoCurso, setCodigoCurso] = useState("");
	const [descricaoCurso, setDescricaoCurso] = useState("");
	const [quantidadeSemestres, setQuantidadeSemestres] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!nomeCurso.trim()) {
			toast.error("Nome do curso é obrigatório");
			return;
		}

		if (!quantidadeSemestres || parseInt(quantidadeSemestres) <= 0) {
			toast.error("Quantidade de semestres inválida");
			return;
		}

		try {
			setLoading(true);

			const payload = {
				nomeCurso: nomeCurso.trim(),
				duracaoSemestres: parseInt(quantidadeSemestres),
				descricaoCurso: descricaoCurso.trim(),
				codigoCurso: codigoCurso.trim(),
			};

			await api.post("/curso", payload);

			toast.success("Curso cadastrado com sucesso!");

			// Limpar os campos
			setNomeCurso("");
			setCodigoCurso("");
			setDescricaoCurso("");
			setQuantidadeSemestres("");
		} catch (error: any) {
			let mensagemErro = "Erro ao cadastrar curso";

			if (error.response?.data?.message) {
				mensagemErro = error.response.data.message;
			} else if (error.response?.data?.error) {
				mensagemErro = error.response.data.error;
			}

			toast.error(mensagemErro);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ProtectedRoute allowedRoles={["admin"]}>
			<Header title='Cadastro de Curso' />
			<NavBar />
			<FormCadastro onSubmit={handleSubmit}>
				<InputCadastro
					label='Nome do Curso'
					placeHolder='Ex: Sistema de Informação'
					type='text'
					value={nomeCurso}
					onChange={(e) => setNomeCurso(e.target.value)}
					disabled={loading}
				/>
				<InputCadastro
					label='Código do Curso'
					placeHolder='Ex: SIN'
					type='text'
					value={codigoCurso}
					onChange={(e) => setCodigoCurso(e.target.value)}
					disabled={loading}
				/>
				<InputCadastro
					label='Descriçao Curso'
					placeHolder='Ex: Curso voltado para...'
					type='text'
					value={descricaoCurso}
					onChange={(e) => setDescricaoCurso(e.target.value)}
					disabled={loading}
				/>
				<InputCadastro
					label='Quantidade de Semestres'
					placeHolder='Ex: 8'
					type='number'
					value={quantidadeSemestres}
					onChange={(e) => setQuantidadeSemestres(e.target.value)}
					disabled={loading}
				/>
			</FormCadastro>
		</ProtectedRoute>
	);
}
