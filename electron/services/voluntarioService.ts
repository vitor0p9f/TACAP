import { Voluntario } from "../models/voluntario";
import { DbProvider } from "../db";

export class VoluntarioService {
    create(data: Voluntario): Voluntario {
        const info = DbProvider.run(`
            INSERT INTO voluntarios (
                nome, apelido, idade, tempo_pratica, peso, altura, graduacao, genero, endereco, contato
            ) VALUES (
                @nome, @apelido, @idade, @tempo_pratica, @peso, @altura, @graduacao, @genero, @endereco, @contato
            )
        `, data);
        return { ...data, id: Number(info.lastID) };
    }

    list(search?: string): Voluntario[] {
        const hasSearch = Boolean(search && String(search).trim().length > 0);
        const whereClause = hasSearch
            ? `WHERE 
                v.nome LIKE @term COLLATE NOCASE OR 
                v.apelido LIKE @term COLLATE NOCASE OR 
                v.graduacao LIKE @term COLLATE NOCASE OR 
                CAST(v.tempo_pratica AS TEXT) LIKE @term`
            : '';

        const query = `
            SELECT 
                v.*,
                CASE WHEN COUNT(a.id) > 0 THEN 1 ELSE 0 END as realizouAvaliacao
            FROM voluntarios v
            LEFT JOIN avaliacoes a ON v.id = a.voluntario_id
            ${whereClause}
            GROUP BY v.id
            ORDER BY v.created_at DESC
        `;

        const params = hasSearch ? { term: `%${String(search).trim()}%` } : undefined;
        return DbProvider.all<Voluntario>(query, params as any);
    }

    getById(id: number): Voluntario | undefined {
        return DbProvider.get<Voluntario>(`SELECT * FROM voluntarios WHERE id = ?`, [id]);
    }

    update(id: number, data: Partial<Voluntario>): Voluntario | undefined {
        const current = this.getById(id);
        if (!current) return undefined;
        const updated = { ...current, ...data } as Voluntario;
        DbProvider.run(`
            UPDATE voluntarios SET
                nome=@nome, apelido=@apelido, idade=@idade, tempo_pratica=@tempo_pratica,
                peso=@peso, altura=@altura, graduacao=@graduacao, genero=@genero, 
                endereco=@endereco, contato=@contato
            WHERE id=@id
        `, { ...updated, id });
        return { ...updated, id };
    }

    remove(id: number): boolean {
        const info = DbProvider.run(`DELETE FROM voluntarios WHERE id = ?`, [id]);
        return info.changes > 0;
    }
}


