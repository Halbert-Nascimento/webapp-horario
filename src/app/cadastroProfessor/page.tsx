import FormCadastro from "@/components/FormCadastro";
import Header from "@/components/Header";
import InputCadastro from "@/components/InputCadastro";
import NavBar from "@/components/NavBar";
import DisponibilidadeDias from "@/components/DisponibilidadeDias";

export default function CadastroProfessor() {
	return (
		<>
			<Header />
			<NavBar />
			<FormCadastro>
				<InputCadastro
					label='Nome do Professor'
					placeHolder='Ex: Sandir'
					type='text'
				/>
				<InputCadastro
					label='Curso do Professor'
					placeHolder='Escolha o curso'
					type='text'
				/>
				<InputCadastro
					label='Titulação'
					placeHolder='Escolha a titulação'
					type='text'
				/>
				<DisponibilidadeDias />
			</FormCadastro>
		</>
	);
}
