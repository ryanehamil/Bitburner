import { NS } from "@ns";
import { ensureScriptExists, portName } from "lib/utilities";
import { ServerInfo, spider } from "lib/Servers";

export async function main(ns: NS) {
    // Get all servers
    const servers = await spider(ns);

    // Get all servers we have root access to
    const rootServers = servers.filter((s) => s.hasRootAccess);

    // ensure the zombie and utilities scripts exist on all servers
    for (const server of rootServers) {
        await ensureScriptExists(ns, '/lib/payloads/zombie.js', server.hostname);
        await ensureScriptExists(ns, '/lib/Task.js', server.hostname);
        await ensureScriptExists(ns, '/lib/utilities.js', server.hostname);
    }

    // Start the zombie script on all servers with 1 thread
    for (const server of rootServers) {
        ns.exec('/lib/payloads/zombie.js', server.hostname, 1);
    }
}