# Imports for local server comm.
import zerorpc
import gevent
import signal

# Imports for business logic.
import csv
import time
from selenium import webdriver

# Business logic
class LoginApi:
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
    @param      url                     Classlink website url.
    @param      webdriverPath           Chrome webdriver path.
    """
    def loginUsers(users, url, webdriverPath):
        browser = webdriver.Chrome(webdriverPath)
        for user in users.items():
            browser.get(url)
            browser.find_element_by_class_name('btn').click()
            browser.find_element_by_name('UserName').send_keys(user[0])
            browser.find_element_by_name('Password').send_keys(user[1])
            browser.find_element_by_id('submitButton').click()
            time.sleep(3)
            browser.delete_all_cookies()
        browser.close()

    """
    @function   main                    Executes all functions in LoginApi in proper sequence.
    """
    def main(filePath, userColumn, passwordColumn, url, webdriverPath):
        users = fileReader(filePath, userColumn, passwordColumn)
        loginUsers(users, url, webdriverPath)

# Server logic. Ref: https://medium.com/@abulka/electron-python-4e8c807bfa5e
port = 4242
addr = 'tcp://127.0.0.1:' + str(port)
s = zerorpc.Server(LoginApi())
s.bind(addr)

gevent.signal(signal.SIGTERM, s.stop)
gevent.signal(signal.SIGINT, s.stop)  # ^C

s.run()
