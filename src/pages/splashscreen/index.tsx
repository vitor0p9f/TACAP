import Button from "../../components/button"
import "./style.css"

const SplashScreenPage: React.FC = () => {
    return(
        <main className="SplashScreenPageContainer">
            <img 
                src="univasf_logo.svg" 
                id="UNIVASFLogo" 
                alt="Logo da Universidade Federal Do Vale Do São Francisco (UNIVASF). O pingo do i é amarelo e 
                    o s esta desenhado em azul, de forma a lembrar o Rio São Francisco"
            />
            <img src="capoeirista.svg"
                id="CapoeiristaLogo"
            />
            <h1>TACAP</h1>
            <p>Teste De Aptidão Física Do Capoeirista</p>
            <Button variant="success">Acessar</Button>
        </main>
    )
}

export default SplashScreenPage