The Folder structure for the solution is according to the tasks
1. Task 1
Contains the index.html file required to make during Task 1 of the assignment. The same file is kept under Task 2 folder for its implementation. 
The file under Task 3 is again the same file but with changes required for Task 3

2. Task 2
A. index.html
It is the same file as the Task 1
B. task2server.js
It is the solution file for the Task 2. For running the file, it can be run using command - node task2server.js  

3. Task 3
A. index.html
The file in task 2 / task 1 is modified to accommodate favorites only check box required for my_groceries Task3#2
B. task3server.js
It is the solution file for Task 3. Cookie logic is added to the server and necessary changes are made, it can be run using command - node task3server.js

4. Task 4 - Extra Credit
A. Task 4-EC1-EC2
EC1 
EC 1 is attempted using fs package and data is written under taskECfile.dat file. File Management logic is added to the server and necessary changes are made, it can be run using command - node taskECserver.js
Sample taskECfile.dat is also supplied in the folder to initiate the grocery list on startup. The code is robust enough, if the file is deleted or the server is initiated without the dat file, a new dat file is made and used.

EC2
The code is written for a scale for multi user environment. The file mgmt is done using writeFileSync and readFile mechanism. The code will work efficiently on overlapping read/write requests. Since using sync functions, writing the file will be blocked IO function and code will behave synchronously. However, the code will fail to recognize if the file is accessed by applications outside the system (current nodes server) and will disregard and overwrite the changes made by the external system

B. Task 4-EC3
Task4-EC1-EC2 code is modified to accommodate events that will be scheduled at given times. The scheduler will jobs at given times to emit and run the mechanisms.
