#! /usr/bin/env node
import gradient from "gradient-string";
import inquirer from "inquirer";
import chalk from "chalk";
import { writeDetail, readDetail, sleep } from "./read_write.js";
import { genrateNewID, getPin, getNameNumber, atm_options } from "./UsrInp.js";
import { figletMSG, accountCreatedMSG, loginSucesFailMSG } from "./message.js";
import { showBalance } from "./message.js";
import { get_validate_ID, get_validate_PIN, transfer_amount, } from "./validation.js";
import { withdraw_cash } from "./validation.js";
//Regular Expression for Valid Name & Number
let nameRegx = /^(?=.{3,40})([A-Za-z]+(?:[ -][A-Za-z]+)*)$/;
// let numberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
// Check if already a user
async function ifAlreadyUser() {
    return inquirer
        .prompt([
        {
            type: "checkbox",
            name: "ifUser",
            message: gradient("rgb(83,144,217)", "rgb(82,182,154)").multiline("Already a user :)"),
            choices: [
                { name: "Yes", value: true },
                { name: "No", value: false },
            ],
            validate: function (ans) {
                if (ans.length === 1) {
                    return true;
                }
                else if (ans.length === 0) {
                    return "Please select the option";
                }
                else if (ans.length === 2) {
                    return "Only chose 1 option";
                }
            },
        },
    ])
        .then((ans) => {
        return ans.ifUser[0];
    });
}
async function main() {
    try {
        // Welcome MSG
        let wlcmMSG = await figletMSG("Node ATM");
        console.log(wlcmMSG);
        await sleep("----------------------");
        await sleep(undefined, 500);
        var mainLoop = true;
        while (mainLoop) {
            // Already user
            let ifUser = await ifAlreadyUser();
            await sleep("----------------------");
            // YES
            if (ifUser === true) {
                // validate ID
                let id_rslt = await get_validate_ID();
                let id_found = id_rslt[0]; // boolen for next loop(validate PIN)
                let UsrID_detail = id_rslt[1]; //Detail of ID Array<string,number>
                let UserID = id_rslt[2];
                if (id_found === false) {
                    console.log("continue");
                    continue;
                }
                // validate PIN
                let pin_found = await get_validate_PIN(id_found, UsrID_detail);
                if (pin_found) {
                    await sleep("----------------------");
                    await sleep(undefined, 500);
                    let msg_ = await loginSucesFailMSG(true);
                    console.log(msg_);
                    // Use ATM
                    // reading user details
                    while (true) {
                        await sleep(undefined, 500);
                        var rslt_temp_1 = await readDetail(UserID, false);
                        if (typeof rslt_temp_1 != "string" &&
                            typeof rslt_temp_1 != "boolean") {
                            var name_1 = rslt_temp_1[0];
                            var pin_1 = rslt_temp_1[1];
                            var amount_1 = rslt_temp_1[2];
                            // Get user choise
                            let usr_process_opt = await atm_options(name_1);
                            await sleep("----------------------");
                            // Show Balance
                            if (usr_process_opt === 1) {
                                let amountMSG = await showBalance(amount_1);
                                console.log(amountMSG);
                            }
                            // Withdraw Cash
                            else if (usr_process_opt === 2) {
                                await withdraw_cash(UserID, name_1, pin_1, amount_1);
                            }
                            //  Transfer
                            else if (usr_process_opt === 3) {
                                await transfer_amount(UserID, name_1, pin_1, amount_1);
                                await sleep("----------------------");
                            }
                            // LogOut
                            else if (usr_process_opt === 0) {
                                mainLoop = false;
                                let msg_1 = await loginSucesFailMSG(false);
                                console.log(msg_1);
                                break;
                            }
                        }
                    }
                }
            }
            // NO
            else {
                // get new user name
                let newUsrName = await getNameNumber("input", "Enter full name:", nameRegx);
                await sleep("----------------------");
                // await sleep(undefined, 500);
                // generate new user ID
                let newUsrId = await genrateNewID(); //Array [displayID,numberID]
                // get new user PIN
                while (true) {
                    var newUsrPin = await getPin("Enter 4 digit PIN", "password");
                    await sleep("----------------------");
                    await sleep(undefined, 500);
                    var newUsrPin_1 = await getPin("Re-Enter 4 digit PIN", "password");
                    await sleep("----------------------");
                    // verify PIN
                    if (newUsrPin === newUsrPin_1) {
                        break;
                    }
                    else {
                        console.log(chalk.yellow(`PIN doesn't match!!!`));
                        await sleep("----------------------");
                        // await sleep(undefined, 500);
                    }
                }
                var newUsrDepositAmount = await getPin("Enter deposit amount:", "amount");
                await sleep("----------------------");
                // await sleep(undefined, 500);
                // display credentials
                await sleep(chalk.bold.underline("Remember the following credentials"));
                // await sleep("----------------------")
                await sleep();
                let acc_sucess_msg = await accountCreatedMSG(newUsrName, newUsrId[1], newUsrPin, newUsrDepositAmount);
                console.log(acc_sucess_msg);
                writeDetail(newUsrName, newUsrId[1], newUsrPin, newUsrDepositAmount);
            }
        }
        // console.log(gradient('rgb(83,144,217)','rgb(72,191,227)').multiline('Hi, my name is karar'))
    }
    catch (error) {
        console.log(error);
    }
}
main();
