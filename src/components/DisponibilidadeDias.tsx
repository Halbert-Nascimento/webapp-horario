"use client";
import { useState } from "react";

import { DisponibilidadeDiasProps } from "../interfaces/types";

export default function DisponibilidadeDias({
	onChange,
}: DisponibilidadeDiasProps) {
	const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);

	const dias = [
		{ id: "seg", label: "SEG" },
		{ id: "ter", label: "TER" },
		{ id: "qua", label: "QUA" },
		{ id: "qui", label: "QUI" },
		{ id: "sex", label: "SEX" },
		{ id: "sab", label: "SAB" },
	];

	const toggleDia = (diaId: string) => {
		const novosDias = diasSelecionados.includes(diaId)
			? diasSelecionados.filter((d) => d !== diaId)
			: [...diasSelecionados, diaId];

		setDiasSelecionados(novosDias);
		onChange?.(novosDias);
	};

	return (
		<div className='flex flex-col gap-3 sm:gap-4 py-2 sm:py-3 w-full'>
			<label className='text-gray-800 font-bold text-xs sm:text-sm lg:text-base text-center'>
				Escolha as disponibilidades do professor
			</label>
			<div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
				{dias.map((dia) => (
					<button
						key={dia.id}
						type='button'
						onClick={() => toggleDia(dia.id)}
						className={`
                            w-2
                            px-6 sm:px-6 lg:px-8 
                            py-2 sm:py-2.5 lg:py-3 
                            border-2 border-black 
                            rounded-lg sm:rounded-xl
                            font-semibold 
                            text-xs sm:text-sm lg:text-base
                            transition-all
                            flex items-center justify-center
                            ${
															diasSelecionados.includes(dia.id)
																? "bg-blue-800 text-white border-blue-800 hover:bg-blue-950 hover:border-blue-950"
																: "bg-white text-black hover:bg-gray-200"
														}
                        `}
					>
						{dia.label}
					</button>
				))}
			</div>
		</div>
	);
}
