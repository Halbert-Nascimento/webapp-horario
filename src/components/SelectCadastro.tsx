import { SelectCadastroProps } from "@/interfaces/types";

export default function SelectCadastro({
	label,
	value,
	onChange,
	disabled,
	options,
	placeholder = "Selecione uma opção",
}: SelectCadastroProps) {
	return (
		<div className='flex flex-col gap-1.5 sm:gap-2 py-2 sm:py-3 w-full'>
			<label className='text-gray-800 font-bold text-xs sm:text-sm lg:text-base'>
				{label}
			</label>
			<select
				value={value}
				onChange={onChange}
				disabled={disabled}
				className='w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3.5 border-2 border-gray-800 rounded-2xl text-sm sm:text-base text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 transition-colors'
			>
				<option value=''>{placeholder}</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
