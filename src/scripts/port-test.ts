import { NS, PortData } from "@ns";

export async function main(ns: NS) {
    // create a test string
    const testString = "Hello World!";

    // Choose 5 numbers from 1 thousand to 1 billion
    const portNumbers = [Math.floor(Math.random() * 1000) + 1000,
                         Math.floor(Math.random() * 10000) + 10000,
                         Math.floor(Math.random() * 100000) + 100000,
                         Math.floor(Math.random() * 1000000) + 1000000,
                         Math.floor(Math.random() * 10000000) + 10000000];
    
    // Sort them
    portNumbers.sort((a, b) => a - b);

    // Test each port
    for (const portNumber of portNumbers) {
        testPort(ns, portNumber, testString);
    }

}


function testPort(ns: NS, portNumber: number, testData: PortData) {

    ns.tprint(`Writing test string to port ${portNumber}...`);
    ns.writePort(portNumber, testData);

    // read the test string from the port
    const readString = ns.readPort(portNumber);
    ns.tprint(`Read string from port ${portNumber}: ${readString}`);

    // verify the test string matches the read string
    if (testData === readString) {
        ns.tprint(`Port test successful!`);
    } else {
        ns.tprint(`Port test failed!`);
    }
}