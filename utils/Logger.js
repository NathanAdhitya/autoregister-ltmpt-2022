import chalk from "chalk";

export function log(...data) {
    return console.log(
        `${chalk.bgGray(`[${new Date().toLocaleString()}]`)}`,
        ...data
    );
}
