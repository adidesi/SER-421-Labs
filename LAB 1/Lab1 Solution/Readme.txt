The solution is kept according to tasks.
The task 1 (regarding postman) is kept inside Task1 folder.
The folder Task1 has 
	1. word document with the screenshots and response html.
	2. SER 421 - LAB 1.postman_collection.json is the exported json file
	3. Response htmls folder with all html
The folder Task2 has
	1. golf.js - all variable initiaion file which is supplied with the assignment
	2. task2EC.js - Solution javascript file
	3. task2testEC.js - Tests for the functions for Solution javascript file
	4. Extra Credit folder which has golf.js, task2EC.js and task2testEC.js file solving the assignment with extra credit question.
-------------------------------------------
task2EC.js
This is the solution file with 2 classes - Tournament and Player and relevant functions.
The functions are written with defensive coding principles and necessary errors thrown.
The errors thrown have relevant messages in the errors.
While testing, if negative cases are to be tested please surrond them with try-catch block with printing of caught error.

task2testEC.js
This is the file with corresponding test functions for the functions in task2EC.js
The test works on a test tournament json selected from the provided json list. Relevant changes are made to check negative cases of functions
--------------------------------------------. 
Extra Credit task2EC.js
The necessary functions are modified to be used with bind function and emitter-message passing mechanism is added.

Extra Credit task2testEC.js
Additional test function is added to check the emitter functionality and the other functions are modified for the extra credit functionality as well.