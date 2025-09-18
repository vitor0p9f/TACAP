# Projeto TACAP

Estrutura do projeto **TACAP**, que integra **Electron** com **React + Vite**.

## Estrutura de pastas

TACAP/
│── electron/ # Código do Electron
│ ├── main.ts # Processo principal
│ ├── preload.ts # Preload (compila para JS)
│ └── tsconfig.json # Config TS específico para Electron
│
│── src/ # React + Vite
│ ├── index.html # HTML do React
│ ├── main.tsx # Entry point React
│ ├── App.tsx # Componente principal
│ └── components/ # Componentes React
│
│── dist/ # Build do Vite (produção)
│── dist_electron/ # Build do Electron (produção/executável)
│
│── package.json
│── tsconfig.json
│── vite.config.ts

markdown
Copiar código

## Descrição das pastas principais

- `electron/` – Contém o código do Electron, incluindo o processo principal e arquivos de configuração.
- `src/` – Contém o código do **React + Vite**, incluindo páginas, componentes e assets.
- `dist/` – Build final do **frontend** (Vite).
- `dist_electron/` – Build final do **Electron** (executável).
