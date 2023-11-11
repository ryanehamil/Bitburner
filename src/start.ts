import { NS } from "@ns";

export async function main(ns: NS) {
    // start the swarmController
    if (ns.run('/scripts/swarmController.js', 1) === 0) {
        ns.tprint('swarmController failed to start');
    }

    // sleep a second
    await ns.sleep(1000);

    // Run the startZombies script
    if (ns.run('/scripts/startZombies.js', 1) === 0) {
        ns.tprint('startZombies failed to start');
    }
}