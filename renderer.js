'use strict';
// let loginAutomator = require('loginAutomator.js');

var submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', () => {
    console.log('HI');
});

let start = function (fileNames) {
    dialog.showOpenDialog((fileNames) => {
        // fileNames is an array that contains all the selected
        if (fileNames === undefined) {
            console.log("No file selected");
            return;
        }

        fs.readFile(filepath, 'utf-8', (err, data) => {
            if (err) {
                alert("An error ocurred reading the file :" + err.message);
                return;
            }

            // Change how to handle the file content
            console.log("The file content is : " + data);
        });
    });
};