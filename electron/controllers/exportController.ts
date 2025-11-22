import { ipcMain, dialog, BrowserWindow } from 'electron';
import { VoluntarioService } from '../services/voluntarioService';
import { AvaliacaoService } from '../services/avaliacaoService';
import * as fs from 'fs';
import { Voluntario } from '../models/voluntario';
import { Avaliacao } from '../models/avaliacao';

const voluntarioService = new VoluntarioService();
const avaliacaoService = new AvaliacaoService();

// Função para converter um array de objetos para uma string CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) {
    return '';
  }
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')]; // Cabeçalho

  for (const row of data) {
    const values = headers.map((header) => {
      const escaped = ('' + row[header]).replace(/"/g, '""'); // Lida com aspas
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}

export function registerExportRoutes() {
  ipcMain.handle("export:csv", async (event, filteredIds?: number[]) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) {
      return { success: false, message: "Janela não encontrada." };
    }

    try {
      // Buscar todos os voluntários
      let voluntarios: Voluntario[] = await voluntarioService.list();

      // Se houver IDs filtrados, filtrar a lista
      if (filteredIds && Array.isArray(filteredIds)) {
        voluntarios = voluntarios.filter((v) => filteredIds.includes(v.id!));
      }

      if (voluntarios.length === 0) {
        return {
          success: false,
          message: "Nenhum voluntário encontrado para exportar.",
        };
      }

      // Para cada voluntário, buscar suas avaliações
      const dataToExport = [];

      for (const voluntario of voluntarios) {
        const avaliacoes: Avaliacao[] = await avaliacaoService.listByVoluntario(
          voluntario.id!
        );

        if (avaliacoes.length > 0) {
          for (const avaliacao of avaliacoes) {
            // Combinar os dados em um formato plano
            dataToExport.push({
              "ID Voluntario": voluntario.id,
              Nome: voluntario.nome,
              Apelido: voluntario.apelido,
              Graduacao: voluntario.graduacao,
              "Tempo Pratica (anos)": voluntario.tempo_pratica,
              "ID Avaliacao": avaliacao.id,
              "Data Avaliacao": avaliacao.created_at,
              IACAP: avaliacao.iacap,
              "IF Valor": avaliacao.if_valor,
              Potencia: avaliacao.potencia,
              RFC: avaliacao.rfc,
              PSE: avaliacao.pse,
              "Total Golpes": avaliacao.golpes,
            });
          }
        } else {
          // Inclui voluntários mesmo sem avaliação
          dataToExport.push({
            "ID Voluntario": voluntario.id,
            Nome: voluntario.nome,
            Apelido: voluntario.apelido,
            Graduacao: voluntario.graduacao,
            "Tempo Pratica (anos)": voluntario.tempo_pratica,
            "ID Avaliacao": "N/A",
            "Data Avaliacao": "N/A",
            IACAP: "N/A",
            "IF Valor": "N/A",
            Potencia: "N/A",
            RFC: "N/A",
            PSE: "N/A",
            "Total Golpes": "N/A",
          });
        }
      }

      // Converter para CSV
      const csvData = convertToCSV(dataToExport);

      // Abrir diálogo para salvar o arquivo
      const result = await dialog.showSaveDialog(window, {
        title: "Salvar Relatório de Voluntários",
        defaultPath: `relatorio_tacap_${Date.now()}.csv`,
        filters: [{ name: "CSV Files", extensions: ["csv"] }],
      });

      if (result.canceled || !result.filePath) {
        return {
          success: false,
          message: "Exportação cancelada pelo usuário.",
        };
      }

      // Salvar o arquivo
      fs.writeFileSync(result.filePath, csvData);

      return { success: true, message: "Dados exportados com sucesso!" };
    } catch (error) {
      console.error("Erro detalhado ao exportar CSV:", error);
      return {
        success: false,
        message: "Ocorreu um erro ao exportar os dados.",
      };
    }
  });
}
