'use strict';

// Required modules.
var fs = require('fs');
var papaParse = require('papaparse');

// Web automation variables.
var selenium = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var chromeDriver = require('chromedriver')

chrome.setDefaultService(new chrome.ServiceBuilder(chromeDriver.path).build());

// Index.html elements.
var fileInputValue = document.getElementById('studentInputFile');
var userNameColumnInput = document.getElementById('userNameColumnInput');
var passwordColumnInput = document.getElementById('passwordColumnInput');
var submitBtn = document.getElementById('submitBtn');

// Event listeners.
submitBtn.addEventListener('click', () => {
    fs.readFile(fileInputValue.files[0].path, "utf-8", (err, data) => {
        var users = createLoginDataObject(papaParse.parse(data));
        users.length ? loginUsers(users) : console.log('Failed to execute.');
    });
});

var createLoginDataObject = function (userData) {
    var loginData = [];
    if (userData && userData.data.length) {
        userData.data.forEach(user => {
            loginData.push({
                username: user[parseInt(userNameColumnInput.value) - 1],
                password: user[parseInt(passwordColumnInput.value) - 1]
            });
        });
    }

    return loginData;
}

var asyncForEach = async function (users, driver) {
    for (let index = 0; index < users.length; index++) {
      await driverOperations(users[index], driver);
    }
}

var driverOperations = async function(user, driver) {
    await driver.get('https://launchpad.classlink.com/gevsd');
    await driver.findElement(selenium.By.className('btn')).click();
    await driver.findElement(selenium.By.name('UserName')).sendKeys(user.username);
    await driver.findElement(selenium.By.name('Password')).sendKeys(user.password);
    await driver.findElement(selenium.By.id('submitButton')).click();
    await driver.sleep(2000);
    await driver.manage().deleteAllCookies();
}

var loginUsers = async function (users) {
    var driver = await new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();
    try {
        await asyncForEach(users, driver);
    } finally {
        await driver.quit();
    }
}
