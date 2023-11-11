import { NS } from "@ns";
import { ensureScriptExists, portName } from "lib/utilities";
import { ServerInfo, spider } from "lib/Servers";
import { Task, serializeTask } from "lib/Task";
import { SwarmCommand } from "./swarmController";

export async function main(ns: NS) {
    // parse the command as "action target" as 2 aguments
    const args = ns.args;
    const action = args[0] as string;
    const target = args[1] as string | "";

    const command: SwarmCommand = { action, target };

    ns.clearPort(portName("Swarm Command"));
    ns.writePort(portName("Swarm Command"), JSON.stringify(command));

}