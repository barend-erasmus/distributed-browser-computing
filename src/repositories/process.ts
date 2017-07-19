// Imports
import * as lowdb from 'lowdb';
import * as path from 'path';

// Imports models
import { Process } from './../models/process';

export class ProcessRepository {

    public list(): Promise<Process[]> {
        const db = lowdb(path.join(__dirname, 'db.json'));

        const processes: Process[] = db.get('processes').value();

        return Promise.resolve(processes);
    }

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
        const db = lowdb(path.join(__dirname, 'db.json'));

        const processes: Process[] = db.get('processes').value();

        if (processes.length === 0) {
            return Promise.resolve(null);
        }

        const process: Process = processes.find((x) => x.id === id);

        if (!process) {
            return Promise.resolve(null);
        }

        return Promise.resolve(new Process(process.id, process.hash, process.answer));
    }

    public insert(process: Process): Promise<boolean> {
        const db = lowdb(path.join(__dirname, 'db.json'));

        const processes: Process[] = db.get('processes').value();

        processes.push(process);

        db.set('processes', processes).write();

        return Promise.resolve(true);
    }

    public update(process: Process): Promise<boolean> {
        const db = lowdb(path.join(__dirname, 'db.json'));

        db.get('processes')
            .find({ id: process.id })
            .assign(process)
            .write();

        return Promise.resolve(true);
    }
}