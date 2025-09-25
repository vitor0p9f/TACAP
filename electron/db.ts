import * as path from "path";
import { app } from "electron";
import Database from "better-sqlite3";

export type RunResult = { lastID: number; changes: number };

export class DbProvider {
    private static instance: Database.Database | null = null;

    private static open(): Database.Database {
        const userDataDir = app.getPath("userData");
        const dbPath = path.join(userDataDir, "tacap.db");
        const db = new Database(dbPath);
        this.applyMigrations(db);
        return db;
    }

    static getDatabase(): Database.Database {
        if (!this.instance) {
            this.instance = this.open();
        }
        return this.instance!;
    }

    static run(sql: string, params?: any): RunResult {
        const db = this.getDatabase();
        const stmt = db.prepare(sql);
        const result = stmt.run(params);
        return { lastID: result.lastInsertRowid as number, changes: result.changes };
    }

    static get<T = any>(sql: string, params?: any): T | undefined {
        const db = this.getDatabase();
        const stmt = db.prepare(sql);
        return stmt.get(params) as T | undefined;
    }

    static all<T = any>(sql: string, params?: any): T[] {
        const db = this.getDatabase();
        const stmt = db.prepare(sql);
        return stmt.all(params) as T[];
    }

    private static applyMigrations(db: Database.Database): void {
        const sql = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS voluntarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                apelido TEXT,
                idade INTEGER,
                tempo_pratica INTEGER,
                documento_id TEXT,
                peso REAL,
                altura REAL,
                graduacao TEXT,
                genero TEXT,
                endereco TEXT,
                contato TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS avaliacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                voluntario_id INTEGER NOT NULL,
                iacap REAL,
                if_valor REAL,
                potencia REAL,
                rfc REAL,
                pse REAL,
                golpes INTEGER,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY(voluntario_id) REFERENCES voluntarios(id) ON DELETE CASCADE
            );
        `;
        db.exec(sql);
    }
}


