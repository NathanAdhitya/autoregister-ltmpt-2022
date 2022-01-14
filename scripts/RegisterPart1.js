import ora from "ora";
import chalk from "chalk";
import fetch from "../utils/TimeoutFetch.js";
import fs from "fs/promises";
import { log } from "../utils/Logger.js";
import * as validators from "../utils/Validators.js";

/**
 * @param {import("ora").Ora} spinner
 * @param {import("events")} progEvents
 * @returns {Promise<Boolean>}
 */
export default async function registerPart1(
    spinner,
    progEvents,
    { NISN, NPSN, TGL_LAHIR }
) {
    // send POST data for the first registration part.
    const [fetchPromise, abortController] = fetch(
        "https://reg.ltmpt.ac.id/reg/siswa/confirm",
        {
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                Referer: "https://reg.ltmpt.ac.id/reg/siswa/confirm",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: `nisn=${encodeURIComponent(NISN)}&npsn=${encodeURIComponent(
                NPSN
            )}&tgl_lahir=${encodeURIComponent(TGL_LAHIR)}`,
            method: "POST",
        }
    );

    // Setup Abort Controller and Event Handler
    let isAborted = false;
    const abort = () => {
        isAborted = true;
        abortController.abort();
    };
    progEvents.once("abort", abort);
    const fetchData = await fetchPromise;
    progEvents.removeListener("abort", abort);

    if (fetchData !== false) {
        const res = await fetchData.text();
        // success?
        const success = fetchData.status < 400 && validators.validatePart1(res);

        if (success) {
            spinner.stopAndPersist({
                prefixText: `${chalk.bgGray(
                    `[${new Date().toLocaleString()}]`
                )}`,
                text: `Part 1 succeeded. Cleaning up and doing part 2 next.`,
                symbol: chalk.greenBright("✔"),
            });
            const fileSpinner = ora(
                "Writing results to registerPart1.html"
            ).start();
            await fs.writeFile("registerPart1.html", res);
            fileSpinner.stopAndPersist({
                prefixText: `${chalk.bgGray(
                    `[${new Date().toLocaleString()}]`
                )}`,
                text: "Written to registerPart1.html",
                symbol: "📝",
            });

            return true;
        } else {
            spinner.clear();
            log("Response validation mismatch. Trying again...");
        }
    } else {
        if (!isAborted) {
            spinner.clear();
            log("TIMEOUT. Trying again...");
        }
    }

    return false;
}
