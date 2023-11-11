import { NS } from "@ns";
import { spider, printServerTable } from "lib/Servers";

export async function main(ns: NS) {
    // Perform server discovery and attempt to gain root access
    const serverInfos = await spider(ns);
    
    // Print the server information in a table format
    printServerTable(ns, serverInfos);
}
