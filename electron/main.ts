import { app, BrowserWindow, protocol } from "electron";
import { registerRoutes } from "./routes";
import * as path from "path";
import * as fs from "fs";

// 🔧 Registrar protocolo ANTES do app.whenReady
app.whenReady().then(() => {
    console.log("🚀 App ready, registrando protocolo...");

    // Registrar protocolo customizado
    protocol.registerBufferProtocol('app', (request, respond) => {
        console.log("📨 Requisição recebida:", request.url);

        try {
            let pathName = new URL(request.url).pathname;
            pathName = decodeURI(pathName); // Decode URL-encoded characters

            let filePath;
            if (app.isPackaged) {
                // Quando empacotado, usa process.resourcesPath + app
                filePath = path.join(process.resourcesPath, "app", "dist", pathName);
            } else {
                // Quando em desenvolvimento, usa o caminho relativo ao projeto
                filePath = path.join(__dirname, "..", "..", "dist", pathName);
            }

            console.log("🔍 Procurando arquivo:", filePath);
            console.log("📂 Arquivo existe?", fs.existsSync(filePath));

            fs.readFile(filePath, (error, data) => {
                if (error) {
                    console.error("❌ Erro ao ler arquivo:", error);
                    console.error("❌ Caminho:", filePath);
                    respond({ error: -2 }); // net::ERR_FAILED
                } else {
                    let extension = path.extname(pathName).toLowerCase();
                    let mimeType = '';

                    if (extension === '.js') {
                        mimeType = 'text/javascript';
                    } else if (extension === '.html') {
                        mimeType = 'text/html';
                    } else if (extension === '.css') {
                        mimeType = 'text/css';
                    } else if (extension === '.svg' || extension === '.svgz') {
                        mimeType = 'image/svg+xml';
                    } else if (extension === '.json') {
                        mimeType = 'application/json';
                    } else {
                        mimeType = 'text/plain';
                    }

                    console.log("✅ Arquivo enviado:", pathName, "tipo:", mimeType, "tamanho:", data.length);
                    respond({
                        mimeType,
                        data
                    });
                }
            });
        } catch (error) {
            console.error("❌ Erro no protocolo:", error);
            respond({ error: -2 });
        }
    });

    console.log("✅ Protocolo 'app://' registrado!");

    registerRoutes();
    createWindow();
});

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    console.log("📦 app.isPackaged:", app.isPackaged);
    console.log("📦 process.env.NODE_ENV:", process.env.NODE_ENV);

    if (!app.isPackaged) {
        const devUrl = "http://localhost:5173";
        console.log("🔗 Carregando renderer em:", devUrl);

        try {
            await mainWindow.loadURL(devUrl);
            console.log("✅ Renderer carregado!");
        } catch (err) {
            console.error("❌ Erro ao carregar renderer:", err);
        }

        mainWindow.webContents.openDevTools();
    } else {
        console.log("📦 __dirname:", __dirname);
        console.log("📦 process.resourcesPath:", process.resourcesPath);

        // 🔧 Usar protocolo customizado para evitar restrições de file://
        const prodUrl = "app://./index.html";
        console.log("📦 URL do app:", prodUrl);

        // Pequeno delay para garantir que o protocolo foi registrado
        setTimeout(async () => {
            try {
                console.log("🔗 Tentando carregar URL:", prodUrl);
                await mainWindow.loadURL(prodUrl);
                console.log("✅ App carregado via protocolo customizado");
            } catch (error) {
                console.error("❌ Erro ao carregar URL:", error);
                // Fallback: tentar loadFile
                console.log("🔄 Tentando fallback com loadFile...");
                const fallbackPath = path.join(process.resourcesPath, "dist", "index.html");
                try {
                    await mainWindow.loadFile(fallbackPath);
                    console.log("✅ Fallback bem-sucedido");
                } catch (fallbackError) {
                    console.error("❌ Fallback também falhou:", fallbackError);
                }
            }
        }, 100);
    }

    // Debug extra
    mainWindow.webContents.on("did-finish-load", () => {
        console.log("🎉 Conteúdo finalizado");
    });

    mainWindow.webContents.on("did-fail-load", (_, code, desc) => {
        console.error("⚠️ Falha no carregamento:", code, desc);
    });

    // Debug do console do renderer
    mainWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
        console.log(`[RENDERER ${level}] ${message} (linha ${line} em ${sourceId})`);
    });

    // Debug de erros de JavaScript
    mainWindow.webContents.on("render-process-gone", (event, details) => {
        console.error("❌ Processo de renderização falhou:", details);
    });
}
console.log("hello,world");

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
