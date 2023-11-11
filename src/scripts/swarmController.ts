import { NS, Server } from "@ns";
import { ensureScriptExists, portName } from "lib/utilities";
import { ServerInfo, spider } from "lib/Servers";
import { Task, serializeTask } from "lib/Task";



// swarmController.js
export async function main(ns: NS) {
  ns.tprint("Swarm Controller started");
  ns.tprint(
    "Listening for new zombies to join the swarm on port " +
      portName("Zombie Queue")
  );
  

  let zombies: ServerInfo[] = [];
  let allServers = await spider(ns);

  while (true) {
    await addZombies(ns, zombies);

    // Check swarm control ports for new tasks
    if (!ns.getPortHandle(portName("Swarm Command")).empty()) {
        const swarmCommand = JSON.parse(ns.peek(portName("Swarm Command")) as string) as SwarmCommand;
        if (swarmCommand) {
            switch (swarmCommand.action) {
                case "hack":
                    setTasks(ns, zombies, Task.hack(swarmCommand.target));
                    break;
                case "grow":
                    setTasks(ns, zombies, Task.grow(swarmCommand.target));
                    break;
                case "weaken":
                    setTasks(ns, zombies, Task.weaken(swarmCommand.target));
                    break;
                case "halt":
                    setTasks(ns, zombies, Task.halt());
                    break;
                case "idle":
                    setTasks(ns, zombies, Task.idle());
                    break;
                default:
                    break;
            }
        }
    }

    await ns.sleep(1000); // Check the port every second
  }
}

async function addZombies(ns: NS, zombies: ServerInfo[]) {
    const zombieQueuePort = ns.getPortHandle(portName("Zombie Queue"));
    let allServers = await spider(ns);

    if (!zombieQueuePort.empty()) {
        const servername = zombieQueuePort.read() as string;
  
        // Get the server info for the new zombie
        const server = allServers.find((s) => s.hostname === servername);
        if (!server) {
          return;
        }
        if (zombies.find((z) => z.hostname === servername)) {
          return;
        }
        zombies.push(server);
  
        ns.toast(`New zombie joined the swarm: ${server.hostname}`, "info");
  
        ns.writePort(portName(server.hostname), serializeTask(Task.idle()) ); // Tell the zombie to hack
      }
}
async function setTasks(ns: NS, zombies: ServerInfo[], task: Task) {
    for (const zombie of zombies) {
        ns.clearPort(portName(zombie.hostname));
        ns.writePort(portName(zombie.hostname), serializeTask(task) );
    }
}

export interface SwarmCommand {
    action: string;
    target: string;
}