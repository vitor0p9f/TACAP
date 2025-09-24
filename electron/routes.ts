import { registerVoluntarioRoutes } from "./controllers/voluntarioController";
import { registerAvaliacaoRoutes } from "./controllers/avaliacaoController";

export function registerRoutes() {
    registerVoluntarioRoutes();
    registerAvaliacaoRoutes();
}

