import * as path from "path";
import { app } from "electron";
import sqlite3 from "sqlite3";

sqlite3.verbose();

export type RunResult = { lastID: number; changes: number };

export class DbProvider {
    private static instance: sqlite3.Database | null = null;

    private static async open(): Promise<sqlite3.Database> {
        const userDataDir = app.getPath("userData");
        const dbPath = path.join(userDataDir, "tacap.db");
        return await new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath, (err) => {
                if (err) return reject(err);
                resolve(db);
            });
        });
    }

    static async getDatabase(): Promise<sqlite3.Database> {
        if (!this.instance) {
            const db = await this.open();
            await this.applyMigrations(db);
            this.instance = db;
        }
        return this.instance!;
    }

    static async run(sql: string, params?: any): Promise<RunResult> {
        const db = await this.getDatabase();
        return await new Promise((resolve, reject) => {
            db.run(sql, params ?? [], function (this: sqlite3.RunResult, err) {
                if (err) return reject(err);
                resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }

    static async get<T = any>(sql: string, params?: any): Promise<T | undefined> {
        const db = await this.getDatabase();
        return await new Promise((resolve, reject) => {
            db.get(sql, params ?? [], (err, row) => {
                if (err) return reject(err);
                resolve(row as T | undefined);
            });
        });
    }

    static async all<T = any>(sql: string, params?: any): Promise<T[]> {
        const db = await this.getDatabase();
        return await new Promise((resolve, reject) => {
            db.all(sql, params ?? [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows as T[]);
            });
        });
    }

    private static async applyMigrations(db: sqlite3.Database): Promise<void> {
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
        await new Promise<void>((resolve, reject) => {
            db.exec(sql, (err) => (err ? reject(err) : resolve()));
        });
    }
}


