import Table from "@/components/Table";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
	return (
		<ProtectedRoute>
			<Header title='Home' />
			<NavBar />
			<Table />
		</ProtectedRoute>
	);
}
