import { Voluntario } from "../models/voluntario";
import { DbProvider } from "../db";

export class VoluntarioService {
    async create(data: Voluntario): Promise<Voluntario> {
        const info = await DbProvider.run(`
            INSERT INTO voluntarios (
                nome, apelido, idade, tempo_pratica, documento_id, peso, altura, graduacao, genero, endereco, contato
            ) VALUES (
                @nome, @apelido, @idade, @tempo_pratica, @documento_id, @peso, @altura, @graduacao, @genero, @endereco, @contato
            )
        `, data);
        return { ...data, id: Number(info.lastID) };
    }

    async list(): Promise<Voluntario[]> {
        return await DbProvider.all<Voluntario>(`SELECT * FROM voluntarios ORDER BY created_at DESC`);
    }

    async getById(id: number): Promise<Voluntario | undefined> {
        return await DbProvider.get<Voluntario>(`SELECT * FROM voluntarios WHERE id = ?`, [id]);
    }

    async update(id: number, data: Partial<Voluntario>): Promise<Voluntario | undefined> {
        const current = await this.getById(id);
        if (!current) return undefined;
        const updated = { ...current, ...data } as Voluntario;
        await DbProvider.run(`
            UPDATE voluntarios SET
                nome=@nome, apelido=@apelido, idade=@idade, tempo_pratica=@tempo_pratica,
                documento_id=@documento_id, peso=@peso, altura=@altura, graduacao=@graduacao,
                genero=@genero, endereco=@endereco, contato=@contato
            WHERE id=@id
        `, { ...updated, id });
        return { ...updated, id };
    }

    async remove(id: number): Promise<boolean> {
        const info = await DbProvider.run(`DELETE FROM voluntarios WHERE id = ?`, [id]);
        return info.changes > 0;
    }
}


