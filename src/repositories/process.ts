// Imports
import * as lowdb from 'lowdb';
import * as path from 'path';

// Imports models
import { Process } from './../models/process';

export class ProcessRepository {

    public findUnanswered(): Promise<Process> {
        const db = lowdb(path.join(__dirname, 'db.json'));

        const processes: Process[] = db.get('processes').value();

        if (processes.length === 0) {
            return Promise.resolve(null);
        }

        const process: Process = processes.find((x) => x.answer === null);

        if (!process) {
            return Promise.resolve(null);
        }

        return Promise.resolve(new Process(process.id, process.hash, process.answer));
    }

    public findById(id: string): Promise<Process> {
        return Promise.resolve(null);
    }

    public insert(process: Process): Promise<boolean> {
        return Promise.resolve(null);
    }

    public update(process: Process): Promise<boolean> {
        return Promise.resolve(null);
    }
}