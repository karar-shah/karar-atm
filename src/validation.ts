import { getPin } from "./UsrInp.js";
import { readDetail, sleep, writeDetail } from "./read_write.js";
import { transferMSG, figletMSG } from "./message.js";
import chalk from "chalk";

type id_detail = [string, number, number];

async function get_validate_ID(): Promise<[boolean, id_detail, number]> {
    let chance_id = 4;
    while (true) {
        var UsrID = await getPin("Enter A/C ID: ", "number");
        await sleep("----------------------");
        // Verify ID
        var UsrID_valid = await readDetail(UsrID, true);
        if (typeof UsrID_valid === "string") {
            console.log(UsrID_valid); //return yellow warning
            await sleep("----------------------");

            --chance_id;
            if (chance_id <= 0) {
                console.log(
                    chalk.yellow(
                        "Too many wrong attempts\nRelauch the process!!!"
                    )
                );
                await sleep("----------------------");
                var id_found = false;
                var return_detail: id_detail = ["", 0, 0];
                break;
            }
        } else if (typeof UsrID_valid === "boolean") {
            var id_found = false;
            var return_detail: id_detail = ["", 0, 0];
            console.log(chalk.yellow("Please Create new account!"));
            await sleep("----------------------")
            await sleep(undefined,500)
            break;
        } else {
            //ID found
            // its a [string, number]
            var id_found = true;
            var return_detail = UsrID_valid;
            break
        }
    }
    return [id_found, return_detail, UsrID];
}

async function get_validate_PIN(id_found: boolean, UsrID_valid: id_detail) {
    if (id_found) {
        let pin_chance = 4;
        while (pin_chance > 0) {
            --pin_chance;
            let curr_PIN = await getPin("Enter 4 digit Pin", "password");
            await sleep("----------------------", 700);
            if (curr_PIN === UsrID_valid[1]) {
                console.log(chalk.cyan("PIN matched!"));
                return true;
            }
        }
    } else {
        return false;
    }
}

async function transfer_amount(
    UserID: number,
    name_1: string,
    pin_1: number,
    amount_1: number
) {
    var transfer_ID = await getPin("Receiver ID:", "number");
    var amount_transfer = await getPin("Enter transfer amount:", "amount");
    await sleep("----------------------");
    await sleep(undefined, 500);

    if (amount_transfer <= amount_1) {
        amount_1 -= amount_transfer;
        //Updating user detail
        await writeDetail(name_1, UserID, pin_1, amount_1);
        
        let transfer_recipt = await transferMSG(
            UserID,
            transfer_ID,
            amount_transfer
        );
        console.log(transfer_recipt);

        //Updating recipient account
        var rslt_temp_r = await readDetail(transfer_ID, false);
        if (typeof rslt_temp_r != "string" && typeof rslt_temp_r != "boolean") {
            var name_2 = rslt_temp_r[0];
            var pin_2 = rslt_temp_r[1];
            var amount_2 = rslt_temp_r[2];
            amount_2 += amount_transfer;
            await writeDetail(name_2, transfer_ID, pin_2, amount_2);
        }
    }else{
        console.log(chalk.yellow("Low balance!!!"))
    }
}

async function withdraw_cash(
    UserID: number,
    name_1: string,
    pin_1: number,
    amount_1: number
) {
    var withdrawal_amount = await getPin("Enter withdrawal amount:", "amount");
    if (withdrawal_amount <= amount_1) {
        amount_1 -= withdrawal_amount;
        //Updating user detail
        await writeDetail(name_1, UserID, pin_1, amount_1);
        await sleep("----------------------");
        await sleep(undefined, 500);
        let a1 = chalk.cyan(`
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                ${chalk.bold("Collect your cash!")}
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        `);
        console.log(a1);
    }
}

export { get_validate_ID, get_validate_PIN, transfer_amount, withdraw_cash };
