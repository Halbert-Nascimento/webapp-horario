import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="bg-blue-900 fixed left-0 top-0 w-72 h-screen overflow-y-auto z-10">
      <div className="flex flex-col h-full">
        {/* Logo e título no topo */}
        <div className="flex flex-col items-center py-8">
          <Image
            src="/logo-iesgo.png"
            width={120}
            height={45}
            alt="Logo IESGO"
            className="mb-2"
          />
          <h2 className="text-white text-xl font-semibold tracking-wide">
            FISIOTERAPIA
          </h2>
        </div>

        {/* Links de navegação */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/home"
                className="flex items-center text-gray-200 hover:bg-blue-800 rounded-lg px-4 py-3 transition-colors"
              >
                <span className="text-lg">Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/disponibilidade"
                className="flex items-center text-gray-200 hover:bg-blue-800 rounded-lg px-4 py-3 transition-colors"
              >
                <span className="text-lg">Disponibilidade</span>
              </Link>
            </li>
            <li>
              <Link
                href="/cadastroPaciente"
                className="flex items-center text-gray-200 hover:bg-blue-800 rounded-lg px-4 py-3 transition-colors"
              >
                <span className="text-lg">Cadastro de Paciente</span>
              </Link>
            </li>
            <li>
              <Link
                href="/cadastroUsuario"
                className="flex items-center text-gray-200 hover:bg-blue-800 rounded-lg px-4 py-3 transition-colors"
              >
                <span className="text-lg">Cadastro de Usuário</span>
              </Link>
            </li>
            <li>
              <Link
                href="/cadastroConsulta"
                className="flex items-center text-gray-200 hover:bg-blue-800 rounded-lg px-4 py-3 transition-colors"
              >
                <span className="text-lg">Cadastro de Consulta</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default NavBar;