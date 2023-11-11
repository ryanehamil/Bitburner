import { NS } from "@ns";

export async function main(ns: NS) {
    const target = ns.args[0] as string; // Target server name
    await ns.weaken(target); // Weaken operation on the target
}
