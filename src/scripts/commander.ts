import { NS, Server } from "@ns";
import { spider, ServerInfo } from "lib/Servers";
import { ensureScriptExists } from "lib/utilities";

export async function main(ns: NS) {
    const action = ns.args[0] as string;
    const target = ns.args[1] as string;
    const serverInfos: ServerInfo[] = await spider(ns);
    const scriptPath = `/lib/payloads/${action}.js`; // Path to the script in the subfolder

    // Ensure the action is valid
    if (!['hack', 'weaken', 'grow'].includes(action)) {
        ns.tprint(`Invalid action: ${action}`);
        return;
    }
    
    const scriptRam = ns.getScriptRam(scriptPath);
    ns.tprint(`Script ${scriptPath} requires ${scriptRam}GB of RAM`);


    for (const server of serverInfos) {
        if (server.hasRootAccess && server.hostname !== 'home') {
            const maxRam = ns.getServerMaxRam(server.hostname);
            const usedRam = ns.getServerUsedRam(server.hostname);
            const threads = Math.floor((maxRam - usedRam) / scriptRam);

            if (threads > 0) {
                if (await ensureScriptExists(ns, scriptPath, server.hostname)) {
                    ns.tprint(`Running ${scriptPath} on ${server.hostname} with ${threads} threads`);
                    await ns.exec(scriptPath, server.hostname, threads, target);
                } else {
                    ns.tprint(`Failed to ensure script ${scriptPath} exists on ${server.hostname}`);
                }
            } else {
                ns.tprint(`Not enough RAM on ${server.hostname} to run ${scriptPath} (max: ${maxRam}GB, used: ${usedRam}GB)`);
            }
        }
    }
}

export function autocomplete(data: any, args: any) {
    return [...data.servers]; // This script autocompletes the list of servers.
}