# Teste Específico de Aptidão Física na Capoeira - TACAP

<div align="justify">
  
A **Capoeira** é uma expressão cultural afro-brasileira, praticada mundialmente, que combina movimentos de ataque, defesa, ritmo e estratégia. Sua prática envolve diferentes
jogos e toques (Angola, Benguela, Iuna e São Bento Grande), que demandam tanto o **metabolismo aeróbio** quanto o **anaeróbio**, devido à alternância entre movimentos
contínuos e explosivos. Como esporte de combate, caracteriza-se por esforços físicos **intermitentes**, exigindo elevada capacidade aeróbia e anaeróbia para sustentar o
desempenho técnico e tático.  

Apesar da relevância do condicionamento físico, havia uma **lacuna na literatura** sobre métodos específicos de avaliação do desempenho de capoeiristas. Para suprir essa
necessidade, foi desenvolvido o **Teste Específico de Aptidão Física na Capoeira (TACAP)**, um protocolo que considera as particularidades da modalidade.  
</div>

## 🎯 Objetivo do TACAP

<div align="justify">
  
O principal objetivo do **TACAP** é avaliar a **aptidão físico-fisiológica específica** do capoeirista.O protocolo foi desenvolvido para:  

- Propor e verificar a **reprodutibilidade** do teste;  
- Verificar a **sensibilidade** do protocolo em relação ao nível técnico, sexo e idade dos praticantes;  
- Validar o **componente aeróbio** do teste, associando-o a parâmetros convencionais de aptidão aeróbia.  
</div>


## ⚙️ Como o TACAP Funciona: Metodologia do Teste

### Estrutura do TACAP  

<div align="justify">
  
O **TACAP** foi idealizado para refletir as demandas da **Capoeira**, incorporando movimentos fundamentais como a **ginga** e golpes **giratório** e **de linha** (com e sem 
rotação do corpo), comuns a ambos os estilos de Capoeira.  

O teste consiste em **três séries de desempenho**, com as seguintes durações:  
- **Série 1:** 15 segundos  
- **Série 2:** 30 segundos  
- **Série 3:** 30 segundos  

Entre cada série, há **intervalos de recuperação de 10 segundos**.  

Durante cada série, o capoeirista deve realizar o **maior número possível de ataques com as pernas** contra um **assistente de jogo**. Esse assistente simula um oponente, mas
apenas **ginga e esquiva** dos golpes, permitindo que o avaliado demonstre seu melhor desempenho físico.  
</div>

---

### Regras para o Avaliado no TACAP  

<div align="justify">
  
1. **Precisão no alvo:** golpes devem ser direcionados ao assistente.  
2. **Exigência bilateral:** uso de ambos os membros inferiores.  
3. **Variedade de golpes:** inclusão de golpes giratórios e de linha (com e sem rotação do corpo).  
4. **Agilidade:** trocas de direção nos golpes.  
5. **Contagem de golpes:** não são considerados mais de **dois golpes consecutivos** (de linha ou giratórios) para o mesmo lado sem troca de direção.  
6. **Início da contagem:** o tempo começa quando o avaliado entra no espaço de testagem após executar um **Aú** (acrobacia simples, como uma estrelinha), tocando os dois pés
no solo.  
</div>

## 💻 Sobre o software
# TACAP - Teste Específico de Aptidão Física na Capoeira

Este projeto implementa o software do **TACAP** utilizando **Electron + Vite + React + TypeScript**, permitindo registrar e analisar o desempenho físico do capoeirista.

---

### 🏗 Estrutura do Projeto

```
TACAP/
│── electron/                  # Código do Electron
│   ├── main.ts                # Processo principal
│   ├── preload.ts             # Preload (compila para JS)
│   └── tsconfig.json          # Config TS específico para Electron
│
│── src/                       # React + Vite
│   ├── index.html             # HTML do React
│   ├── main.tsx               # Entry point React
│   ├── App.tsx                # Componente principal
│   └── components/            # Componentes React
│
│── dist/                      # Build do Vite (produção)
│── dist_electron/                      # Build do electron (produção/ executável )
│
│── package.json
│── tsconfig.json
│── vite.config.ts
```

---

### 💾 Pré-requisitos

* [Node.js](https://nodejs.org/) ≥ 18
* [npm](https://www.npmjs.com/)
* Windows / macOS / Linux

---

### ⚙️ Instalação

1. Clone o repositório:

```bash
git clone <url-do-repo>
cd TACAP
```

2. Instale as dependências:

```bash
npm install
```

---

### 🛠 Scripts Disponíveis

| Script         | Descrição                                                          |
| -------------- | ------------------------------------------------------------------ |
| `dev:vite`     | Inicia o servidor de desenvolvimento do Vite (React) na porta 5173 |
| `dev:electron` | Inicia o Electron apontando para o Vite                            |
| `dev`          | Roda Vite + Electron simultaneamente para desenvolvimento          |
| `build`        | Gera a build de produção do React na pasta `dist`                  |
| `start`        | Executa o Electron carregando a build de produção                  |

---

## 🚀 Executando em Desenvolvimento

Roda o projeto em modo dev:

```bash
  npm run dev
```

* O **Vite** sobe em `http://localhost:5173`.
* O **Electron** abre a janela carregando a URL do Vite.
* Caso a porta 5173 esteja ocupada, altere no `vite.config.ts`.

---

## 🏗 Produção

1. Compile o React:

    ```bash
    npm run build
    ```

2. Execute o Electron carregando a build:
    
    ```bash
    npm run start
    ```

---

## 📌 Observações

* **Preload:** Deve ser sempre **JS** para o Electron. O TypeScript é usado apenas para desenvolvimento, e o arquivo é compilado.
* **Porta do Vite:** Certifique-se de que a porta 5173 está livre ou altere no `vite.config.ts`.
* **Segurança:** Electron utiliza `contextIsolation: true` e `nodeIntegration: false`.
* **Estrutura de pastas:** `electron/` para main + preload, `src/` para React + Vite, `dist/` para build.
* **Debug:** Para depurar o main process, use `electron --inspect ./electron/main.js`. Para depurar o preload, coloque `console.log` e abra DevTools do Electron (`mainWindow.webContents.openDevTools()`).

---

## 📚 Referências

* [Electron First Step](https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app)
* [Electron + TypeScript ](https://www.electronjs.org/blog/typescript)
* [Vite First Step](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)