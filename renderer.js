'use strict';

// Required modules.
var fs = require('fs');
var papaParse = require('papaparse');
// var selenium = require('selenium');

// Index.html elements.
var fileInputValue = document.getElementById('studentInputFile');
var userNameColumnInput = document.getElementById('userNameColumnInput');
var passwordColumnInput = document.getElementById('passwordColumnInput');
var submitBtn = document.getElementById('submitBtn');

// Event listeners.
submitBtn.addEventListener('click', () => {
    var rawData;
    var modifiedFilePath = filePathModifier();
    fs.readFile(modifiedFilePath, "utf-8", (err, data) => {
        rawData = data;
    });
    var result = papaParse.parse(rawData);
    var users = createLoginDataObject(result);

});

// Functions.
var filePathModifier = function () {
    var modifiedFilePath;
    if (!!fileInputValue.value) {
        var startingIndex = fileInputValue.value.lastIndexOf("\\") + 1;
        modifiedFilePath = fileInputValue.value.slice(startingIndex);
    }

    return modifiedFilePath;
}

var createLoginDataObject = function (userData) {
    var loginData = [];
    if (!!userData.data) {
        userData.data.forEach(user => {
            loginData.push({
                username: user[parseInt(userNameColumnInput.value) - 1],
                password: user[parseInt(passwordColumnInput.value) - 1]
            });
        });
    }
    return loginData;
}