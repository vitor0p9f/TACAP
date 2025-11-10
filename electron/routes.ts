import { registerVoluntarioRoutes } from "./controllers/voluntarioController";
import { registerAvaliacaoRoutes } from "./controllers/avaliacaoController";
import { registerExportRoutes } from "./controllers/exportController";

export function registerRoutes() {
  registerVoluntarioRoutes();
  registerAvaliacaoRoutes();
  registerExportRoutes();
}