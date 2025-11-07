export default function Header(props: { title: string }) {
	return (
		<header className='fixed top-0 left-0 lg:left-72 right-0 lg:w-[calc(100vw-288px)] w-full h-16 bg-blue-100 flex justify-center px-4 lg:px-8 z-40'>
			<h1 className='text-blue-950 font-bold text-xl lg:text-2xl flex items-center'>
				{props.title}
			</h1>
		</header>
	);
}
