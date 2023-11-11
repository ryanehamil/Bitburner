import { NS } from "@ns";

export interface Task {
    action: string;
    target: string;
    params?: any;
    priority?: number;
}

// Create something to make Task.idle() work
export namespace Task {
    export function idle(): Task {
        return { action: "idle", target: "" };
    }
    export function hack(target: string): Task {
        return { action: "hack", target };
    }
    export function grow(target: string): Task {
        return { action: "grow", target };
    }
    export function weaken(target: string): Task {
        return { action: "weaken", target };
    }
    export function halt(): Task {
        return { action: "halt", target: "" };
    }
}

// Convert a Task object to a JSON string
export function serializeTask(task: Task): string {
    return JSON.stringify(task);
}

// Convert a JSON string back to a Task object
export function deserializeTask(taskStr: string): Task {
    return JSON.parse(taskStr) as Task;
}
