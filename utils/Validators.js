/**
 * @description Validates .env and the responses from LTMPT's websites.
 */
import { JSDOM } from "jsdom";

/**
 *
 * @param {Record<string, string>} env
 */
export function validateEnv(env = process.env) {
    const validations = [
        [
            "NISN harus terdiri dari sepuluh angka.",
            env["NISN"] && String(env["NISN"]).length === 10,
        ],
        [
            "NPSN harus terdiri dari delapan angka.",
            env["NPSN"] && String(env["NPSN"]).length === 8,
        ],
        [
            "TGL_LAHIR harus sesuai format DD/MM/YYYY",
            env["TGL_LAHIR"] &&
                String(env["TGL_LAHIR"]).match(/^\d\d\/\d\d\/\d\d\d\d$/),
        ],
        [
            "EMAIL tidak valid.",
            env["EMAIL"] &&
                String(env["EMAIL"]).match(
                    // eslint-disable-next-line no-useless-escape
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
        ],
        [
            "PASSWORD tidak valid, harus hanya terdiri dari huruf dan angka dan minimal 8 karakter.",
            env["PASSWORD"] &&
                String(env["PASSWORD"]).match(/^[a-zA-Z0-9]{8,}$/),
        ],
    ];

    return validations.filter((value) => value[1] === false);
}

/**
 * @param {String} res
 */
export function validatePart1(res) {
    // Pre-validation without DOM
    const preValidation =
        !res.match("Terjadi masalah dengan API Pusdatin Kemdikbud") &&
        !res.match("Fatal error") &&
        !res.match("installation in progress") &&
        !res.match("Mohon maaf antrian penuh");

    if (!preValidation) return false;

    // Validate the existence of the form.
    const dom = new JSDOM(res);
    const htmlForm = dom.window.document.querySelector("form");

    if (!htmlForm) return false;
    return true;
}
/**
 * @param {String} res
 */
export function validatePart2(res) {
    if (res.match("Pembuatan akun LTMPT dengan username")) {
        return "SUCCESS";
    } else if (
        //res.match("Fatal error") ||
        res.match("installation in progress")
    ) {
        return "SITE_ERROR";
    } else {
        return "UNEXPECTED_ERROR";
    }
}
