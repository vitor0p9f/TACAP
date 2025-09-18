import { app, BrowserWindow } from "electron";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

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
        const prodIndex = path.join(__dirname, "../dist/index.html");
        console.log("📦 Carregando produção:", prodIndex);

        await mainWindow.loadFile(prodIndex);
    }

    // Debug extra
    mainWindow.webContents.on("did-finish-load", () => {
        console.log("🎉 Conteúdo finalizado");
    });

    mainWindow.webContents.on("did-fail-load", (_, code, desc) => {
        console.error("⚠️ Falha no carregamento:", code, desc);
    });
}
console.log("hello,world");
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
