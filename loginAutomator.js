'use strict';

var csvReader = require("csv-parse");
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');

/**
 * @function    showOpenDialog
 * @param       fileName
 */
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