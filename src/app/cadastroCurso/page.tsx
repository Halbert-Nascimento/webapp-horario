import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import FormCadastro from "@/components/FormCadastro";
import InputCadastro from "@/components/InputCadastro";

export default function CadastroCurso() {
	return (
		<>
			<Header />
			<NavBar />
			<FormCadastro>
				<InputCadastro
					label='Nome do Curso'
					placeHolder='Ex: Sistema de Informação'
					type='text'
				/>
				<InputCadastro
					label='Nome do Coordenador'
					placeHolder='Ex: Sandir'
					type='text'
				/>
				<InputCadastro
					label='Quantidade de Semestres'
					placeHolder='Ex: 8'
					type='number'
				/>
			</FormCadastro>
		</>
	);
}
