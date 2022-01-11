/**
 * Automatic script that runs and retries automatically, because LTMPT keeps erroring and is frustrating.
 * Registrasi LTMPT 2022, isi .env sesuai dengan kebutuhan.
 * Script is untested as was only used twice. Use at your own risk.
 */

import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import fs from "fs/promises";

import dotenv from 'dotenv';
dotenv.config()

const { NISN, NPSN, TGL_LAHIR, EMAIL, PASSWORD } = process.env;
console.log((NISN && NPSN && TGL_LAHIR && EMAIL && PASSWORD) ? ".env fully loaded." : "missing env variable/file?");

var registerPart1Done = false;

async function registerPart1() {
    while (!registerPart1Done) {
        const fetchData = await fetch("https://reg.ltmpt.ac.id/reg/siswa/confirm", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referer": "https://reg.ltmpt.ac.id/reg/siswa/confirm",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `nisn=${encodeURIComponent(NISN)}&npsn=${encodeURIComponent(NPSN)}&tgl_lahir=${encodeURIComponent(TGL_LAHIR)}`,
            "method": "POST"
        });

        const res = await fetchData.text();

        // success?
        const success = (fetchData.status < 400) && !res.match("Terjadi masalah dengan API Pusdatin Kemdikbud");

        if (success) {
            console.log(`[${new Date().toISOString()}] ======succeeded======`);
            console.log(`[${new Date().toISOString()}] writing file results to registerPart1.html`);
            await fs.writeFile("registerPart1.html", res);
            break;
        } else {
            console.log(`[${new Date().toISOString()}] failed, trying again.`);
        }
    }
    return true;
}

async function registerPart2() {
    // get form, fill data automatically according to .env
    var fileData;
    try {
        fileData = await fs.readFile("registerPart1.html", "utf-8");
    } catch (e) {
        return false;
    }
    const dom = new JSDOM(fileData);
    const { FormData } = dom.window;
    const htmlForm = dom.window.document.querySelector("form");
    const data = new FormData(htmlForm);
    data.set("email", EMAIL);
    data.set("email_confirm", EMAIL);
    data.set("pwd", PASSWORD);
    data.set("pwd_confirm", PASSWORD);
    data.set("term", "on");

    const fdObj = {};
    data.forEach((value, key) => fdObj[key] = value);
    console.log(JSON.stringify(fdObj));

    // convert to urlsearchparams
    const databody = new URLSearchParams(data).toString();
    console.log(databody);

    while (true) {
        const fetchData = await fetch("https://reg.ltmpt.ac.id/reg/siswa/register", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referer": "https://reg.ltmpt.ac.id/reg/siswa/confirm",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": databody,
            "method": "POST"
        });

        const res = await fetchData.text();

        // success?
        const success = (fetchData.status < 400);

        if (success) {
            console.log(`[${new Date().toISOString()}] ======succeeded fully registering======`);
            console.log(`[${new Date().toISOString()}] writing file results to registerPart2.html`);
            await fs.writeFile("registerPart2.html", res);
            break;
        } else {
            console.log(`[${new Date().toISOString()}] failed, trying again.`);
        }
    }
}

(async () => {
    // check  if registerPart1.html exists already, if not, then do the first part.
    if (await fs.access("registerPart1.html").then(() => true).catch(() => false) === false)
        await Promise.race([registerPart1(), registerPart1(), registerPart1(), registerPart1(), registerPart1()]);
    registerPart1Done = true;
    await registerPart2();
    process.exit(0);
})();

