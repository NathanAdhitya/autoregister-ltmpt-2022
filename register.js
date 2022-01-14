/**
 * Automatic script that runs and retries automatically, because LTMPT keeps erroring and is frustrating.
 * Registrasi LTMPT 2022, isi .env sesuai dengan kebutuhan.
 * Script is partially tested as was only used twice. Use at your own risk.
 */

// Need to load the .env file
import dotenv from "dotenv";
dotenv.config();

// Main dependencies
import ora from "ora";
import chalk from "chalk";
import EventEmitter from "events";
import fs from "fs/promises";
import { log } from "./utils/Logger.js";
import * as validators from "./utils/Validators.js";

// The scripts themselves
import registerPart1 from "./scripts/RegisterPart1.js";
import {
    prepareRegisterPart2,
    registerPart2,
} from "./scripts/RegisterPart2.js";

// Check validity of env variables.
const envValidation = validators.validateEnv();
if (envValidation.length === 0) {
    log(".env sesuai ketentuan. Melanjutkan program.");
} else {
    log(chalk.redBright(".env tidak sesuai ketentuan. Errors:"));
    envValidation.forEach((v) => log(chalk.red(v[0])));
    process.exit(0);
}

(async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // check if registerPart1.html exists already, if not, then do part 1.
        if (
            (await fs
                .access("registerPart1.html")
                .then(() => true)
                .catch(() => false)) === false
        ) {
            const spinner1 = ora("Running registration part 1").start();
            const abortEmitter = new EventEmitter();

            let isPart1Finished = false;
            const p1Func = async () => {
                while (!isPart1Finished) {
                    if (
                        (await registerPart1(
                            spinner1,
                            abortEmitter,
                            process.env
                        )) === true
                    ) {
                        break;
                    }
                }
            };

            await Promise.race([
                p1Func(),
                p1Func(),
                p1Func(),
                p1Func(),
                p1Func(),
            ]);

            // abort and cleanup
            isPart1Finished = true;
            abortEmitter.emit("abort");
        }

        const dataBody = await prepareRegisterPart2(process.env);
        if (!dataBody) continue;

        const spinner2 = ora("Running registration part 2").start();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const part2Res = await registerPart2(spinner2, dataBody);
            if (part2Res === true)
                // Ensure everything terminates correctly.
                process.exit(0);
        }
    }
})();
