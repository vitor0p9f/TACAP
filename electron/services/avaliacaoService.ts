import { DbProvider } from "../db";
import { Avaliacao } from "../models/avaliacao";

export class AvaliacaoService {
    async create(data: Avaliacao): Promise<Avaliacao> {
        const info = await DbProvider.run(`
            INSERT INTO avaliacoes (
                voluntario_id, iacap, if_valor, potencia, rfc, pse, golpes
            ) VALUES (
                @voluntario_id, @iacap, @if_valor, @potencia, @rfc, @pse, @golpes
            )
        `, data);
        return { ...data, id: Number(info.lastID) };
    }

    async listByVoluntario(voluntarioId: number): Promise<Avaliacao[]> {
        return await DbProvider.all<Avaliacao>(
            `SELECT * FROM avaliacoes WHERE voluntario_id = ? ORDER BY created_at DESC`,
            [voluntarioId]
        );
    }

    async remove(id: number): Promise<boolean> {
        const info = await DbProvider.run(`DELETE FROM avaliacoes WHERE id = ?`, [id]);
        return info.changes > 0;
    }
}


