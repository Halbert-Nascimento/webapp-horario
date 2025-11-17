import Table from "@/components/Table";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import PrivateRoute from "@/components/PrivateRoute";

export default function Home() {
	return (
		<PrivateRoute>
			<Header title='Home' />
			<NavBar />
			<Table />
		</PrivateRoute>
	);
}
