'use strict';

// Required modules.
var fs = require('fs');
var papaParse = require('papaparse');
var selenium = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var chromeDriver = require('chromedriver')

// Web automation setup.
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

/**
 * @function        createLoginDataObject           Creates JSON users from parsed .csv data.
 * @param           userData                        .csv parsed user data.
 * @returns         loginData                       Formatted array of user objects, containing name and password.
 */
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

/**
 * @function        asyncForEach                    Asynchronous forEach function.
 * @param           users                           Array of JSON users.
 * @param           driver                          Built selenium browser.
 */
var asyncForEach = async function (users, driver) {
    for (let index = 0; index < users.length; index++) {
      await driverOperations(users[index], driver);
    }
}

/**
 * @function        driverOperations                Performs all automation actions in provided browser.
 * @param           user                            User object to use in automation.
 * @param           driver                          Selenium browser instance.
 */
var driverOperations = async function(user, driver) {
    await driver.get('https://launchpad.classlink.com/gevsd');
    await driver.findElement(selenium.By.className('btn')).click();
    await driver.findElement(selenium.By.name('UserName')).sendKeys(user.username);
    await driver.findElement(selenium.By.name('Password')).sendKeys(user.password);
    await driver.findElement(selenium.By.id('submitButton')).click();
    await driver.sleep(2000);
    await driver.manage().deleteAllCookies();
}

/**
 * @function        loginUsers                      Starts login process for provided array of users.
 * @param           users                           Array of user objects to log in. 
 */
var loginUsers = async function (users) {
    var driver = await new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();
    try {
        await asyncForEach(users, driver);
    } finally {
        await driver.quit();
    }
}
