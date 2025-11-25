export default function formatarNome(nome: string) {
	return nome
		.toLowerCase()
		.split(" ")
		.map((palavra: string, index: number) => {
			// Se a palavra tiver 2 letras ou menos e não for a primeira
			if (palavra.length <= 2 && index !== 0) {
				return palavra;
			}
			// Caso contrário, capitaliza
			return palavra.charAt(0).toUpperCase() + palavra.slice(1);
		})
		.join(" ");
}
