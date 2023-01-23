import * as fs from "fs";
import chalk from "chalk";

function sleep(msg?: string, ms = 700): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (msg && msg !== undefined) {
                console.log(msg);
                resolve("");
            } else {
                resolve("");
            }
        }, ms);
    });
}

type newUsrDetail = { [id: number]: [string, number, number] };

async function writeDetail(
    name: string,
    id: number,
    pin: number,
    amount: number
) {
    fs.stat("./build/data.json", (err, stats) => {
        //if no file found
        if (err) {
            // console.log(typeof pin, pin);
            let newUsrDetail_obj: newUsrDetail = { [id]: [name, pin, amount] };
            let json_newusrDetail = JSON.stringify(newUsrDetail_obj);
            fs.writeFileSync("./build/data.json", json_newusrDetail, "utf8");

            //if file is empty
        } else if (stats.size === 0) {
            let newUsrDetail_obj: newUsrDetail = { [id]: [name, pin, amount] };
            let json_newusrDetail = JSON.stringify(newUsrDetail_obj);
            fs.writeFileSync("./build/data.json", json_newusrDetail, "utf8");

            //if file has content then only update
        } else {
            let newUsrDetail_obj: newUsrDetail = JSON.parse(
                fs.readFileSync("build/data.json", "utf8")
            );
            newUsrDetail_obj[id] = [name, pin, amount];
            let json_newusrDetail = JSON.stringify(newUsrDetail_obj);
            fs.writeFileSync("./build/data.json", json_newusrDetail, "utf8");
        }
    });
}

async function readDetail(id: number, idMSG: boolean) {
    try {
        var UsrDetails: newUsrDetail = JSON.parse(
            fs.readFileSync("build/data.json", "utf-8")
        );
    } catch {
        return false;
    }
    if (id in UsrDetails) {
        if (idMSG) {
            console.log(chalk.cyan("ID found!"));
        }
        // await sleep("----------------------");
        let rslt = UsrDetails[id];
        return rslt;
    } else {
        return chalk.yellow("ID not found!!!");
    }
}

export { writeDetail, readDetail, sleep };
