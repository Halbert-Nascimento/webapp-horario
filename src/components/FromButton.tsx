import { FormProps } from "../interfaces/types";

export default function FormButton(props: FormProps) {
	return (
		<div className='flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 w-full'>
			{props.children}
		</div>
	);
}
