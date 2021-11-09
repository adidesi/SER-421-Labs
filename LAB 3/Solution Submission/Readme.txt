The Folder structure for the solution is according to the tasks
1. Task 1
Contains the files with task1 solution. No javascript is used on frontend and no ejs mechanism is implemented
The html is build by the server dynamically. All the functions are implemented and a near replica of the application is constructed.
Error handling is also implemented for 4xx and 5xx codes.

The entry point for testing is by loading the app on loading page ie with route '/' or '/index.jsp'.
Do open the loading page once for testing as questions are loaded during the first loading of loading page

2. Task 2
Task is built on task1 where the task1 html files are now rendered using ejs templating engines. 
The html files which are dynamic are replaced by ejs files and are rendered by the engines and are placed in views folder.
The html which are static are maintained under html folder

The json file is kept under json folder structure under both the folders. - json/survey.json
Kindly run npm install to install node_modules before running the projects
