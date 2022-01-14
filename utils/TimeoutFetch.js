import fetch, { AbortError } from "node-fetch";
const AbortController = globalThis.AbortController;

/**
 *
 * @param {import("node-fetch").RequestInfo} url
 * @param {import("node-fetch").RequestInit} options
 * @param {Number} timeoutMs
 * @returns {[Promise<Response|any|AbortError>, AbortController]}
 */
export default function (url, options, timeoutMs = 45000) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, timeoutMs);

    return [
        (async () => {
            var returnData;

            try {
                const response = await fetch(url, {
                    signal: controller.signal,
                    ...options,
                });
                returnData = response;
            } catch (error) {
                if (error instanceof AbortError) {
                    return false;
                }
                returnData = error;
            } finally {
                clearTimeout(timeout);
            }

            return returnData;
        })(),
        controller,
    ];
}
