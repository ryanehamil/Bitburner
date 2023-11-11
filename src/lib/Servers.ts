import { NS } from "@ns";
import { canGainRootAccess, attemptRootAccess } from "lib/rootAccess";

// ServerInfo type definition
export interface ServerInfo {
    hostname: string;
    moneyAvailable: number;
    securityLevel: number;
    hackingLevel: number;
    hasRootAccess: boolean;
    canRoot: boolean;
}

// Spider function: discovers servers and attempts root access
export async function spider(ns: NS): Promise<ServerInfo[]> {
    const serverInfos: ServerInfo[] = [];
    await discoverServers(ns, 'home', new Set<string>(), serverInfos);
    return serverInfos;
}

// Recursive function to discover servers
async function discoverServers(ns: NS, currentServer: string, visitedServers: Set<string>, serverInfos: ServerInfo[]): Promise<void> {
    if (visitedServers.has(currentServer)) {
        return;
    }
    visitedServers.add(currentServer);

    const connectedServers = ns.scan(currentServer);
    for (const server of connectedServers) {
        if (server === 'home') continue;

        const info: ServerInfo = {
            hostname: server,
            moneyAvailable: ns.getServerMoneyAvailable(server),
            securityLevel: ns.getServerSecurityLevel(server),
            hackingLevel: ns.getServerRequiredHackingLevel(server),
            hasRootAccess: ns.hasRootAccess(server),
            canRoot: canGainRootAccess(ns, server)
        };

        if (!info.hasRootAccess && info.canRoot) {
            info.hasRootAccess = await attemptRootAccess(ns, server);
        }

        // Check if the server is already in the list so we dont add duplicates
        const existingInfo = serverInfos.find(i => i.hostname === server);
        if (existingInfo) {
            // If the server is already in the list, update the info
            existingInfo.hasRootAccess = info.hasRootAccess;
            existingInfo.canRoot = info.canRoot;
        } else {
            // Otherwise, add the server to the list
            serverInfos.push(info);
        }

        await discoverServers(ns, server, visitedServers, serverInfos);
    }
}

// Server table printer function
export function printServerTable(ns: NS, serverInfos: ServerInfo[]): void {
    const header = 'Hostname'.padEnd(20) + 'Money'.padEnd(15) + 'Security'.padEnd(10) + 'Hack Lvl'.padEnd(10) + 'Root Access';
    ns.tprint(header);
    serverInfos.forEach(info => {
        const row = `${info.hostname.padEnd(20)} ${Math.round(info.moneyAvailable).toString().padEnd(15)} ${Math.round(info.securityLevel).toString().padEnd(10)} ${Math.round(info.hackingLevel).toString().padEnd(10)} ${info.hasRootAccess}`;
        ns.tprint(row);
    });
}
