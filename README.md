# Web Technologies 2 (Back End). Assignment 1
**Project Name:** Creating a Registration and Login System with Node.js and PostgreSQL  
**Group:** SE-2210  
**Group members:** Ramin Sagandykov, Mukhammed Kaskyrbayev, Bekzat Kanay
## Table of Contents
- [Objective](#objective)
- [Requirements](#requirements)
- [Main Body](#main-body)
    - [Dependencies](#dependencies)
    - [PostgreSql](#postgresql)
    - [NodeJS](#nodejs)


## Objective
The goal of this assignment is to design and implement a back-end system for user registration and login using Node.js as the server-side framework and PostgreSQL as the database.

## Requirements
-Setup and Installation;
<br>-Registration Form;
<br>-Login Form;
<br>-Database Interaction.

## Main Body
### Dependencies
Dependencies that were installed before the creating the project <br>
`express` - To serve our application<br>
`bcrypt` - To hash user password to make them secure<br>
`express-session` - To store session details in a session cookie object<br>
`express-flash` - To display flash messages to the user<br>
`passport` - To authenticate users<br>
`passport-local` - To implement a local authentication strategy for our application
<br>
![Example Image](dependencies.jpeg)
### PostgreSql
Creating the database:<br>
![Example Image](database.jpeg)
Creating the table with users's data:<br>
![Example Image](table.jpeg)
Connect with database:<br>
![Example Image](connection.jpeg)
### NodeJS
Creating asyncronous method "post" to handle register, validation form
![Example Image](post.jpeg)
Creating the method "query" to work with database by using SELECT and INSERT INTO methods<br>
![Example Image](query(1).jpeg)
<br>
![Example Image](query(2).jpeg)







