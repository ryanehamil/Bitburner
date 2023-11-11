import { NS } from "@ns";

// Function to count the number of port-opening tools available
function countAvailableTools(ns: NS): number {
    let toolCount = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) toolCount++;
    // ... other tool checks
    return toolCount;
}

// Function to check if enough tools are available to open the required ports
export function canGainRootAccess(ns: NS, hostname: string): boolean {
    const requiredPorts = ns.getServerNumPortsRequired(hostname);
    const availableTools = countAvailableTools(ns);
    return availableTools >= requiredPorts;
}

// Function to attempt to gain root access on a server
export async function attemptRootAccess(ns: NS, hostname: string): Promise<boolean> {
    if (ns.hasRootAccess(hostname)) {
        return true;
    }

    if (canGainRootAccess(ns, hostname)) {
        // Use port-opening tools and nuke
        if (ns.fileExists("BruteSSH.exe", "home")) ns.brutessh(hostname);
        // ... other tool usage
        ns.nuke(hostname);
        return true;
    }

    return false;
}
