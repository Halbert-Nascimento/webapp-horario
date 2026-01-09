export default function formatarNome(nome: string) {
	// Função auxiliar para verificar se uma palavra é um número romano
	const ehNumeroRomano = (palavra: string): boolean => {
		// Remove espaços e converte para maiúscula para validação
		const palavraLimpa = palavra.trim().toUpperCase();

		// Verifica se a palavra contém apenas caracteres válidos de números romanos
		const regexRomano = /^[IVXLCDM]+$/;

		if (!regexRomano.test(palavraLimpa)) {
			return false;
		}

		// Lista de números romanos válidos comuns (1-100 e alguns especiais)
		const romanosValidos = [
			"I",
			"II",
			"III",
			"IV",
			"V",
			"VI",
			"VII",
			"VIII",
			"IX",
			"X",
			"XI",
			"XII",
			"XIII",
			"XIV",
			"XV",
			"XVI",
			"XVII",
			"XVIII",
			"XIX",
			"XX",
			"XXI",
			"XXII",
			"XXIII",
			"XXIV",
			"XXV",
			"XXVI",
			"XXVII",
			"XXVIII",
			"XXIX",
			"XXX",
			"XL",
			"L",
			"LX",
			"LXX",
			"LXXX",
			"XC",
			"C",
			"CC",
			"CCC",
			"CD",
			"D",
			"DC",
			"DCC",
			"DCCC",
			"CM",
			"M",
			"MM",
			"MMM",
		];

		return romanosValidos.includes(palavraLimpa);
	};

	return nome
		.toLowerCase()
		.split(" ")
		.map((palavra: string, index: number) => {
			// Verifica se é um número romano
			if (ehNumeroRomano(palavra)) {
				return palavra.toUpperCase();
			}

			// Se a palavra tiver 2 letras ou menos e não for a primeira
			if (palavra.length <= 2 && index !== 0) {
				return palavra;
			}

			// Caso contrário, capitaliza
			return palavra.charAt(0).toUpperCase() + palavra.slice(1);
		})
		.join(" ");
}
