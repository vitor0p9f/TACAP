import { registerVoluntarioRoutes } from "./controllers/voluntarioController";
import { registerAvaliacaoRoutes } from "./controllers/avaliacaoController";
import { registerExportRoutes } from "./controllers/exportController";
import { registerSeedRoutes } from "./controllers/seedController";

export function registerRoutes() {
  registerVoluntarioRoutes();
  registerAvaliacaoRoutes();
  registerExportRoutes();
  registerSeedRoutes();
}
