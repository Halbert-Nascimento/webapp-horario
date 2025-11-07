"use client";

interface ModalDeleteProps {
	isOpen: boolean;
	onClose: () => void;
	onDelete: () => void;
	conteudo: string;
}

export default function ModalDelete({
	isOpen,
	onClose,
	onDelete,
	conteudo,
}: ModalDeleteProps) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl'>
				<div className='flex justify-center mb-6'>
					<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
						<svg
							className='w-8 h-8 text-red-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
							/>
						</svg>
					</div>
				</div>

				<h2 className='text-2xl font-bold text-center mb-4 text-gray-800'>
					Excluir Aula
				</h2>

				<p className='text-center text-gray-600 mb-6'>
					Tem certeza que deseja excluir esta aula?
				</p>

				<div className='bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200'>
					<p className='text-sm text-gray-700 whitespace-pre-line text-center font-medium'>
						{conteudo}
					</p>
				</div>

				<div className='flex flex-col sm:flex-row justify-center gap-3'>
					<button
						onClick={onClose}
						className='w-full sm:w-auto px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
					>
						Cancelar
					</button>
					<button
						onClick={onDelete}
						className='w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors'
					>
						Excluir
					</button>
				</div>
			</div>
		</div>
	);
}
