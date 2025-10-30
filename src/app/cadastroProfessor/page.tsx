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
					value=''
				/>
				<InputCadastro
					label='Curso do Professor'
					placeHolder='Escolha o curso'
					type='text'
					value=''
				/>
				<InputCadastro
					label='Titulação'
					placeHolder='Escolha a titulação'
					type='text'
					value=''
				/>
				<DisponibilidadeDias />
			</FormCadastro>
		</>
	);
}
