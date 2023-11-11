import { NS } from "@ns";
import { portName } from "/lib/utilities";
import { Task, deserializeTask } from "/lib/Task";

export async function main(ns: NS) {
  const hostname = ns.getHostname();
  const uniquePort = portName(hostname);
  const swarmQueuePort = portName("Zombie Queue");

  const uniquePortHandle = ns.getPortHandle(uniquePort);
  const swarmQueuePortHandle = ns.getPortHandle(swarmQueuePort);

  // Join the swarm
  swarmQueuePortHandle.write(hostname);

  // Wait for the swarm controller to add this server to the swarm
  while (uniquePortHandle.empty()) {
    await ns.sleep(1000);
  }

  // Once we have data on our port, we know we have been added to the swarm
  ns.tprint(`Joined the swarm!`);

  // Start looping to perform the swarm's task
  while (true) {
    let task = deserializeTask(uniquePortHandle.peek() as string);

    switch (task.action) {
      case "idle":
        // If the task is idle, do nothing
        break;
      case "hack":
        // If the task is hack, hack the target server
        ns.tprint(`Hacking ${task.params.target}`);
        await ns.hack(task.params.target);
        break;
      case "grow":
        // If the task is grow, grow the target server
        ns.tprint(`Growing ${task.params.target}`);
        await ns.grow(task.params.target);
        break;
      case "weaken":
        // If the task is weaken, weaken the target server
        ns.tprint(`Weakening ${task.params.target}`);
        await ns.weaken(task.params.target);
        break;
      case "halt":
        // If the task is halt, stop the script
        ns.tprint(`Halting`);
        ns.exit();
        break;
      default:
        // If the task is anything else, do nothing
        break;
    }

    await ns.sleep(1000);
  }
}
