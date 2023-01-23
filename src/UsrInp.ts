import inquirer from "inquirer";

function toTitleCase(str: string): string {
    return str.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
}

// Get new user Name & Number
async function getNameNumber(
    mthod: string,
    msg: string,
    reg: RegExp
): Promise<string> {
    const rslt = await inquirer.prompt([
        {
            type: mthod,
            message: msg,
            name: "UsrRegDtl",
            validate: function (input) {
                const nameRegex = reg;
                if (!nameRegex.test(input)) {
                    if (mthod === "input") {
                        return "Enter a valid full name\n(3-30) characters, Only letters & spaces allowed";
                    } else if (mthod === "number") {
                        return "Enter valid phone number\nMust be 11 digits. Press 'UP' arrow to edit";
                    }
                } else {
                    return true;
                }
            },
        },
    ]);
    let rslt_1: string = rslt.UsrRegDtl;
    return toTitleCase(rslt_1);
}

// Get PIN from user
async function getPin(msg: string, mthod: "password" | "number" | "amount") {
    if (mthod === "password") {
        var pinRegex = /^\d{4}$/;
        var mthod_type = "password";
    } else if (mthod === "number") {
        var pinRegex = /^\d{4}$/;
        var mthod_type = "number";
    } else {
        var pinRegex = /^\d+(\.\d{1,2})?$/;
        var mthod_type = "number";
    }
    const rslt = await inquirer.prompt([
        {
            type: mthod_type,
            message: msg,
            name: "UsrRegPin",
            mask: "*",
            validate: function (input) {
                if (!pinRegex.test(input)) {
                    return "Only enter 4 digits";
                } else {
                    return true;
                }
            },
        },
    ]);
    return Number(rslt.UsrRegPin);
}

// Generate new user ID
async function genrateNewID() {
    let id: Array<number> = [];
    while (id.length <= 3) {
        let tem_id = Math.floor(Math.random() * 10);
        id.push(tem_id);
    }
    let id_display = id.toString().replace(/[,]/g, " ");
    let id_number = Number(id.toString().replace(/[,]/g, ""));
    let id_array: [string, number] = [id_display, id_number];
    return id_array;
}

async function atm_options(user_name:string): Promise<number> {
    const rslt = await inquirer.prompt([
        {
            type: "rawlist",
            message: `${user_name}!  Select desired option: `,
            name: "Usr_choise",
            choices: [
                { name: "Show balance", value: 1 },
                { name: "Withdraw", value: 2 },
                { name: "Transfer", value: 3 },
                { name: "LogOut", value: 0 },
            ],
            show: false,
        },
    ]);
    return rslt.Usr_choise;
}

export { genrateNewID, getPin, getNameNumber, atm_options };
