import ora from "ora";
import chalk from "chalk";
import fs from "fs/promises";
import { JSDOM } from "jsdom";
import { log } from "../utils/Logger.js";
import fetch from "../utils/TimeoutFetch.js";
import * as validators from "../utils/Validators.js";

/**
 *
 * @returns {Promise<false | string>}
 */
export async function prepareRegisterPart2({
    NISN,
    TGL_LAHIR,
    EMAIL,
    PASSWORD,
}) {
    // get form, fill data automatically according to .env
    var fileData;
    try {
        fileData = await fs.readFile("registerPart1.html", "utf-8");
    } catch (e) {
        await fs
            .unlink("registerPart1-backup.html")
            .then(() => undefined)
            .catch(() => undefined);
        await fs.rename("registerPart1.html", "registerPart1-backup.html");
        log("registerPart1.html not found. Redoing part 1 again.");
        return false;
    }

    // Validate the registerPart1.html to the validator
    const validationResult = validators.validatePart1(fileData);
    if (!validationResult) {
        await fs
            .unlink("registerPart1-backup.html")
            .then(() => undefined)
            .catch(() => undefined);
        await fs.rename("registerPart1.html", "registerPart1-backup.html");
        return log("registerPart1.html is invalid. Redoing part 1 again.");
    }

    const dom = new JSDOM(fileData);
    const { FormData } = dom.window;
    const htmlForm = dom.window.document.querySelector("form");

    if (!htmlForm) {
        log(
            `Failed to read registerPart1.html. May be invalid and or corrupt. Renaming file and retrying...`
        );
        await fs
            .unlink("registerPart1-backup.html")
            .then(() => undefined)
            .catch(() => undefined);
        await fs.rename("registerPart1.html", "registerPart1-backup.html");
        return false;
    }

    const data = new FormData(htmlForm);

    // make sure it is the same as the NISN in the .env.
    const currentNISN = data.get("nisn");
    if (currentNISN != NISN) {
        log(
            chalk.redBright(
                "NISN Mismatch. Delete registerPart1.html manually and retry."
            )
        );
        process.exit(0);
    }
    data.set("email", EMAIL);
    data.set("email_confirm", EMAIL);
    data.set("tgl_lahir", TGL_LAHIR);
    data.set("pwd", PASSWORD);
    data.set("pwd_confirm", PASSWORD);
    data.set("term", "on");

    const fdObj = {};
    data.forEach((value, key) => (fdObj[key] = value));
    // console.log(JSON.stringify(fdObj));

    // convert to urlsearchparams
    const databody = new URLSearchParams(data).toString();

    return databody;
}

/**
 * @param {import("ora").Ora} spinner
 * @param {string} dataBody
 * @returns {Promise<Boolean>}
 */
export async function registerPart2(spinner, dataBody) {
    const [fetchPromise] = fetch("https://reg.ltmpt.ac.id/reg/siswa/register", {
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
        body: dataBody,
        method: "POST",
    });

    /** @type {import("node-fetch").Response}*/
    const fetchData = await fetchPromise;
    /** @type {string} */
    const res = await fetchData.text();

    // success?
    const validationResult = validators.validatePart2(res);

    if (fetchData.status < 400) {
        if (validationResult === "SUCCESS") {
            spinner.stopAndPersist({
                prefixText: `${chalk.bgGray(
                    `[${new Date().toLocaleString()}]`
                )}`,
                text: "Part 2 registration completed. Check your email for further instructions.",
                symbol: chalk.greenBright("✔"),
            });

            const fileSpinner = ora(
                "Writing results to registerPart2.html"
            ).start();
            await fs.writeFile("registerPart2.html", res);
            fileSpinner.stopAndPersist({
                prefixText: `${chalk.bgGray(
                    `[${new Date().toLocaleString()}]`
                )}`,
                text: "Successfully written results to registerPart2.html",
                symbol: "📝",
            });
            return true;
        } else if (validationResult === "SITE_ERROR") {
            spinner.clear();
            log(`Response validation mismatch, trying again.`);
            return false;
        } else if (validationResult === "UNEXPECTED_ERROR") {
            spinner.stopAndPersist({
                prefixText: `${chalk.bgGray(
                    `[${new Date().toLocaleString()}]`
                )}`,
                text: "Unexpected site error. Please report this issue in GitHub and or directly to the developers. Attach errorReport.html in the issue report.",
                symbol: chalk.redBright("❌"),
            });
            const fileSpinner = ora(
                "Censoring error report and writing to errorReport.html"
            ).start();
            let reportData = res;
            ["NISN", "NPSN", "TGL_LAHIR", "EMAIL", "PASSWORD"].forEach((v) => {
                reportData = reportData.replaceAll(
                    process.env[v],
                    `--REDACTED ${v}--`
                );
            });
            await fs.writeFile("errorReport.html", reportData);
            fileSpinner.stopAndPersist({
                prefixText: `${chalk.bgGray(
                    `[${new Date().toLocaleString()}]`
                )}`,
                text: "Successfully written error report to registerPart2.html",
                symbol: "📝",
            });
            return true;
        }
    }
    return false;
}
