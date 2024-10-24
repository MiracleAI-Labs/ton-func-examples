/** create by MiracleAI (mai3.io) */
import * as dotenv from 'dotenv';
dotenv.config();

import { Counter } from "./Counter";

async function runScripts() {
    const counter = new Counter();

    const address = await counter.deploy();
    if (!address) {
        throw new Error("Failed to deploy contract");
    }

    await counter.setCounter(address, 101);
}

runScripts();