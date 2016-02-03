'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 900,
        frame: false,
        minHeight: 600,
        minWidth: 800,
        devTools: true
    });
    // mainWindow.openDevTools();
    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});

app.on('window-all-closed', function() {
  app.quit();
});
