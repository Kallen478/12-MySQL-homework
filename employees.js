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
            };
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
function addRole() {
    connectionQuery("SELECT * from department")
        .then(res => {
            inquirer.prompt([
                {
                    name: "role",
                    type: "input",
                    message: "Enter new role name",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "Enter salary amount",
                },
                {
                    name: "department",
                    type: "list",
                    message: "Select the department the new role will be in",
                    choices: () => {
                        deptList = [];
                        res.forEach(res => {
                            deptList.push(res.name);
                        });
                        return deptList;
                    }
                }
            ])
                .then((answer) => {
                    let deptChoice = res.filter((res) => res.name == answer.department);
                    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.role, answer.salary, deptChoice[0].id],
                        (err) => {
                            if (err) throw err;
                            console.log("Role sucessfully added.");
                        });
                    mainMenu();
                })
        })
}

// Add employee
function addEmployee() {
    connectionQuery("SELECT * from role")
        .then(res => {
            inquirer.prompt([{
                name: "firstName",
                type: "input",
                message: "Enter first name",
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter last name",
            },
            {
                name: "roleName",
                type: "list",
                message: "Select role for the new employee",
                choices: () => {
                    rolesList = [];
                    res.forEach(res => {
                        rolesList.push(res.title);
                    });
                    return rolesList;
                }
            }
            ])
                .then((answer) => {
                    connection.query('SELECT * FROM role', (err, res) => {
                        if (err)
                            throw (err);
                        let roleChoice = res.filter((res) => res.title == answer.roleName);

                        connection.query("SELECT * FROM employee", (res) => {
                            inquirer.prompt([
                                {
                                    name: "manager",
                                    type: "list",
                                    message: "Select manager for the new employee",
                                    choices: () => {
                                        managersList = [];
                                        res.forEach(res => {
                                            managersList.push(res.last_name);
                                        });
                                        managersList.push("No manager");
                                        return managersList;
                                    }
                                }
                            ])
                                .then((managerAnswer) => {
                                    connection.query("SELECT * FROM employee", (err, res) => {
                                        if (err) throw (err);
                                        let managerChoice = res.filter((res) => res.last_name == managerAnswer.manager);

                                        if (managerAnswer.manager === "No manager") {
                                            managerChoiceID = null;
                                        }
                                        else {
                                            managerChoiceID = managerChoice[0].id;
                                        }

                                        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.firstName, answer.lastName, roleChoice[0].id, managerChoiceID],
                                            (err) => {
                                                if (err) throw err;
                                                console.log("Employee sucessfully added.");
                                            });
                                        mainMenu();
                                    });
                                });
                        });
                    });
                })
        })
}

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
},

// Update employee role
function updateEmpRole() {
    connection.query("SELECT * FROM employee", (res) => {
            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Select employee to update role",
                    choices: () => {
                        employeeList = [];
                        res.forEach(res => {
                            employeeList.push(res.last_name);
                        });
                        return employeeList;
                    }
                }
            ])
                .then((answer) => {
                        let employeeChoice = res.filter((res) => res.last_name == answer.employee);
                        connection.query("SELECT * FROM role", (res) => {
                                inquirer.prompt([
                                    {
                                        name: "roleName",
                                        type: "list",
                                        message: "Select new role",
                                        choices: () => {
                                            rolesList = [];
                                            res.forEach(res => {
                                                rolesList.push(res.title);
                                            });
                                            return rolesList;
                                        }
                                    }
                                ]).then((roleAnswer) => {
                                        let roleChoice = res.filter((res) => res.title == roleAnswer.roleName);
                                        connection.query("SELECT * FROM employee", (res) => {
                                                inquirer.prompt([
                                                    {
                                                        name: "manager",
                                                        type: "list",
                                                        message: "Select new manager",
                                                        choices: () => {
                                                            managersList = [];
                                                            res.forEach(res => {
                                                                managersList.push(res.last_name);
                                                            });
                                                            managersList.push("No manager");
                                                            return managersList;
                                                        }
                                                    }
                                                ]).then((managerAnswer) => {
                                                    connection.query("SELECT * FROM employee", (err, res) => {
                                                        if (err)
                                                            throw (err);
                                                        let managerChoice = res.filter((res) => res.last_name == managerAnswer.manager);

                                                        if (managerAnswer.manager === "No manager") {
                                                            managerChoiceID = null;
                                                        }
                                                        else {
                                                            managerChoiceID = managerChoice[0].id;
                                                        }

                                                        connection.query("UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?", [roleChoice[0].id, managerChoiceID, employeeChoice[0].id], 
                                                        (err) => {
                                                                if (err) throw err;
                                                                console.log("Employee role sucessfully updated");
                                                            });
                                                        mainMenu();
                                                    });
                                                });
                                            });
                                    });
                            });
                    });
        })
})

connection.connect((err) => {
    if (err) throw err;
    console.log("Employee Tracker Main Menu");
    mainMenu();
})
}