import * as dotenv from 'dotenv';
import { Counter } from "./Counter";

// 加载 .env 文件中的变量到 process.env
dotenv.config();

async function runScripts() {
    const counter = new Counter();

    const address = await counter.deploy();
    if (!address) {
        throw new Error("Failed to deploy contract");
    }

    await counter.setCounter(address, 101);
}

runScripts();