import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import InputCadastro from "@/components/InputCadastro";

import FormCadastro from "@/components/FormCadastro";

export default function CadastroDisciplina() {
	return (
		<>
			<Header />
			<NavBar />
			<FormCadastro>
				<InputCadastro
					label='Nome da Disciplina'
					placeHolder='Ex: Práticas Orientadas'
					type='text'
				/>
				<InputCadastro
					label='Curso da Disciplina'
					placeHolder='Escolha o curso'
					type='text'
				/>
				<InputCadastro
					label='Modalidade da Disciplina'
					placeHolder='Escolha a modalidade'
					type='text'
				/>
				<InputCadastro
					label='Carga Horária'
					placeHolder='Ex: 120'
					type='number'
				/>
			</FormCadastro>
		</>
	);
}
