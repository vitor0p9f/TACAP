import { DbProvider } from "../db";
import { Avaliacao } from "../models/avaliacao";

export class AvaliacaoService {
    create(data: Avaliacao): Avaliacao {
        const info = DbProvider.run(`
            INSERT INTO avaliacoes (
                voluntario_id, iacap, if_valor, potencia, rfc, pse, golpes
            ) VALUES (
                @voluntario_id, @iacap, @if_valor, @potencia, @rfc, @pse, @golpes
            )
        `, data);
        return { ...data, id: Number(info.lastID) };
    }

    listByVoluntario(voluntarioId: number): Avaliacao[] {
        return DbProvider.all<Avaliacao>(
            `SELECT * FROM avaliacoes WHERE voluntario_id = ? ORDER BY created_at DESC`,
            [voluntarioId]
        );
    }

    remove(id: number): boolean {
        const info = DbProvider.run(`DELETE FROM avaliacoes WHERE id = ?`, [id]);
        return info.changes > 0;
    }
}


