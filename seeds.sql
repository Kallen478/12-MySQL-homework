INSERT INTO department (name) VALUES 
    ("Production"),
    ("Sales"),
    ("Accounting");

INSERT into role (title, salary, department_id) VALUES 
    ("Production Manager", 90000, 1),
    ("Designer", 70000, 1),
    ("Sales Manager", 85000, 2),
    ("Sales Rep", 60000, 2),
    ("Accounting Manager", 88000, 3),
    ("Accountant", 65000, 3);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES 
    ("Montgomery", "Burns", 1, null),
    ("Homer", "Simpson", 2, 1),
    ("Bender", "Rodriguez", 3, null),
    ("Phillip", "Fry", 4, 3),
    ("Herbert", "Garrison", 5, null),
    ("Eric", "Cartman", 6, 5);
