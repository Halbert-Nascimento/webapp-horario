import { ButtonCadastroProps } from "../interfaces/types";

export default function ButtonCadastro(props: ButtonCadastroProps) {
	return (
		<button
			onClick={props.onClick}
			type={props.text === "Voltar" ? "button" : "submit"} // ✅ Voltar não envia
			className={`w-full px-4 sm:px-7 lg:px-8 py-2 sm:py-2.5 lg:py-3 border-black ${
				props.style
			} ${
				props.textColor || "text-white"
			} font-medium text-sm sm:text-base rounded-2xl transition-colors ${
				props.bgColor || "bg-blue-800 hover:bg-blue-950"
			}`}
		>
			{props.text}
		</button>
	);
}
