import  React from "react" ;
import ReactDOM from "react-dom/client";
import App from "./App";
import './styles/global.css'
import PopulationContextProvider from "./context/population";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <PopulationContextProvider>
            <App />
        </PopulationContextProvider>
    </React.StrictMode>
);