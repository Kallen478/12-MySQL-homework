const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const util = require("util");
const { exit } = require("process");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employees_db"
});

const conectionQuery = util.promisify(connection.query.bind(connection));
// Main menu
function mainMenu() {
    inquirer.prompt({
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
        .then((answer) => {
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

// Add department 
function addDept() {
    inquirer.prompt({
        type: "input",
        message: "New department name:",
        name: "dept"
    })
        .then((answer) => {
            connection.query("INSERT INTO department name VALUES ?", answer.dept,
                (err) => {
                    if (err) throw err;
                    console.log("Department successfully added.");
                });
            mainMenu();
        })
};

// Add role


// Add employee


// View employees by department
function viewEmpByDept() {
    let deptList = [];
    connectionQuery("SELECT name FROM department")
        .then(value => {
            for (let i = 0; i < value.length; i++) {
                deptList.push(value[i].name)
            };
        })

        .then(() => {
            inquirer.prompt({
                name: "department",
                type: "list",
                message: "Select a department to view",
                choices: deptList
            })

                .then((answer) => {
                    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.name = "${answer.department}"`;
                    connectionQuery(query).then(res => {
                        console.log("\n");
                        console.table(res);
                        mainMenu();
                    })
                })
        })
}

// View employees by role
function viewEmpByRole() {
    let roleList = [];
    promisemysql.createConnection(connectionProperties)
        .then((connection) => {
            return connecton.query("SELECT title FROM role");
        })
        .then((roles) => {
            for (i = 0; i < roles.length; i++) {
                roleList.push(roles[i].title);
            }
        })
        .then(() => {
            inquirer.prompt({
                name: "role",
                type: "list",
                message: "Select a role to search",
                choices: roleList
            })
                .then((answer) => {
                    const query = connectionQuery(query)
                        .then(res => {
                            console.log("\n");
                            console.table(res);
                            mainMenu();
                        })
                })
        },

// View all employees
function viewAllEmp() {
    const query = "SELECT * FROM employee";
    connectionQuery(query)
        .then(res => {
            console.log("\n");
            console.table(res);
            mainMenu();
        })
});

// Update employee role


connection.connect(function (err) {
        if (err) throw err;
        console.log("Employee Tracker Main Menu");
        mainMenu();
})}