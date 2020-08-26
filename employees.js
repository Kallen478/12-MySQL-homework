const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const util = require("util");
const AddEntriesFromIterable = require("es-abstract/2019/AddEntriesFromIterable");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employees_DB"
  });

const conectionQuery = util.promisify(connection.query.bind(connection));

function mainMenu() {
    inquirer.prompt ({
        name: "action",
        type: "list",
        message: "Main Menu",
        choices: [
            "Add department",
            "Add role",
            "Add employeee",
            "View employees by department",
            "View employees by role",
            "View all employees",
            "Update employee role"
        ]
    })
    .then ((answer) => {
        switch (answer.action) {
            case "Add department":
                addDept();
            
            case "Add role":
                addRole();

            case "Add employee":
                addEmployee();

            case "View employees by department":
                viewEmpByDept();

            case "View employees by role":
                viewEmpByRole();

            case "View all employees":
                viewAllEmp();

            case "Update employee role":
                updateEmpRole();
        }
    })

}

 

connection.connect((err) => {
    if (err) throw err;
    console.log("Employee Tracker Main Menu");
    mainMenu();
});