import { useEffect } from "react";
import Layout from "./Layout";
import Dashboard from "./dashboard/Dashboard";

export default function Home({ theme }: any) {
    useEffect(() => {
        document.title = "Employer Dossier Manager";
    });
    
    return (
        <Layout theme={theme} areaTitle="Dashboard">
            <Dashboard />
        </Layout>
    );
};