import { InputCadastroProps } from "../interfaces/types";

export default function InputCadastro(props: InputCadastroProps) {
	return (
		<div className='flex flex-col gap-1.5 sm:gap-2 py-2 sm:py-3 w-full'>
			<label className='text-gray-800 font-bold text-xs sm:text-sm lg:text-base'>
				{props.label}
			</label>
			<input
				type={props.type}
				value={props.value}
				placeholder={props.placeHolder}
				onChange={props.onChange}
				className='w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border-2 border-gray-800 rounded-2xl text-sm sm:text-base text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 transition-colors'
			/>
		</div>
	);
}
