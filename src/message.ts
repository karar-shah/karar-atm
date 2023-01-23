import figlet from "figlet";
import gradient from "gradient-string";
import chalk from "chalk";

/// WELCOME MSG FUNCTION
function figletMSG(displayTxt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        figlet.text(
            displayTxt, //text to display
            {
                font: "Big Money-ne", //font config
            },
            (error, displayRslt) => {
                //callback for error and data
                if (error) {
                    reject("Error in figletMSG funcitno");
                } else {
                    let displayRslt_1 = gradient.mind(displayRslt);
                    resolve(displayRslt_1);
                }
            }
        );
    });
}

// Account created MSG
async function accountCreatedMSG(
    name: string,
    id: number,
    pin: number,
    amount: number
) {
    const acc_created_msg = chalk.cyan(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            ${chalk.bold("Account Created!")}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        A/C Holder Name: ${chalk.bold(name)}
        ----------------------
        A/C ID number: ${chalk.bold(id)}
        ----------------------
        Secret PIN: ${chalk.bold(pin)}
        ----------------------
        Current Balance: ${chalk.bold(amount)}
        ----------------------
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
    return acc_created_msg;
}

async function loginSucesFailMSG(status: boolean) {
    if (status) {
        var logingSucess = chalk.cyan(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            ${chalk.bold("LogIn Successfull!")}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
    } else {
        var logingSucess = chalk.cyan(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            ${chalk.bold("LogOut Successfull!")}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
    }
    return logingSucess;
}

async function showBalance(value_: number) {
    var msg_bal_val = chalk.cyan(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ${chalk.bold("Current Balance: ")} ${value_}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);

    return msg_bal_val;
}

async function transferMSG(
    from_acc: number,
    to_acc: number,
    amount_snt: number,
) {
    var transfer_txt = chalk.cyan(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            ${chalk.bold("Transfer receipt!")}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ${chalk.bold("From: ")} ${from_acc}
        ${chalk.bold("To: ")} ${to_acc}
        ${chalk.bold("Transfer Amount: ")} ${amount_snt}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);

    return transfer_txt;
}

export {
    figletMSG,
    accountCreatedMSG,
    loginSucesFailMSG,
    showBalance,
    transferMSG,
};
