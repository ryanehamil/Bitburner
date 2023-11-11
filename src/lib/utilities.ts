import { NS } from "@ns";

// Ensures that a script in a specific subfolder exists on a target server.
// If it doesn't, attempts to copy it.
export async function ensureScriptExists(
  ns: NS,
  scriptPath: string,
  targetServer: string
): Promise<boolean> {
  try {
    ns.scp(scriptPath, targetServer, "home");
    return ns.fileExists(scriptPath, targetServer);
  } catch (e) {
    ns.tprint(`Error copying ${scriptPath} to ${targetServer}: ${e}`);
    return false;
  }
}

export function portName(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000007; // Prime number
  }
  return hash;
}
