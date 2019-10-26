# Import statements.
import os
import csv
import time
from selenium import webdriver

"""
@function   validateFilePath        Verifies if user provided file path exists.
@return                             Valid input(filePath) or exit script(NULL).
"""
def validateFilePath():
    while True:
        filePath = input()
        if os.path.isfile(filePath):
            return filePath
        elif filePath.lower() == "exit":
            return None
        else:
            print(
                "Invalid path provided. Please provide the full file path or type \"exit\" to end script.")


"""
@function   fileReader             Reads .csv file data and returns in dictionary.
@param      csvFullFilePath        Full path of file.
@param      userColumn             Based 0 column index of username value.
@param      passwordColumn         Based 0 column index of password value.
@return     studentDictionary      Dictionary containing usernames as key and passwords as value.
"""
def fileReader(filePath, userColumn, passwordColumn):
    with open(filePath) as studentsCsvFile:
        studentCsvReader = csv.reader(studentsCsvFile, delimiter=',')
        studentDictionary = {}
        for row in studentCsvReader:
            studentDictionary[row[userColumn]] = row[passwordColumn]
        return studentDictionary


"""
@function   loginUsers              Launches automate login process.
@param      users                   Dictionary of users to login.
"""
def loginUsers(users):
    browser = webdriver.Chrome(
        '/Users/Alex/Documents/Projects/classlink-login-tool/python_server/chromedriver')
    for user in users.items():
        browser.get('https://launchpad.classlink.com/gevsd')
        browser.find_element_by_class_name('btn').click()
        browser.find_element_by_name('UserName').send_keys(user[0])
        browser.find_element_by_name('Password').send_keys(user[1])
        browser.find_element_by_id('submitButton').click()
        time.sleep(3)
        browser.delete_all_cookies()
    browser.close()


"""
@function   cli                     Launches command-line interface of login app.
@return                             N/A
"""
def cli():
    # Initial display logic.
    print("Hello! Welcome to the GEVSD Schoology Login Tool!\n")
    print("Please enter the path to the .csv file containing student username and password information:")

    # Validate provided file path before continuing.
    validatedFilePath = validateFilePath()

    if validatedFilePath != None:
        # Prompt username column value.
        print("Please enter the column number of the username value (Index starting at 1):")
        usernameColumn = int(input()) - 1

        # Prompt password column value.
        print("Please enter the column number of the password value (Index starting at 1):")
        passwordColumn = int(input()) - 1

        # Get dictionary populated by student username and password values.
        studentDictionary = fileReader(
            validatedFilePath, usernameColumn, passwordColumn)
        loginUsers(studentDictionary)

    print("Exiting script...")

cli()
