const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require('fs');
require("electron-reload")(path.join(__dirname, ".."));

let mainWindow = null;

function createMainWindow()
{
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

app.on("ready", () =>
{
    createMainWindow();
    //mainWindow.webContents.openDevTools();
});

ipcMain.on('saveData', (event, data) =>
{
    fs.writeFile(path.join(__dirname, './renderer/data.json'), JSON.stringify(data), 'utf8', (err) => 
    {
        if (err) throw err;
        console.log('succesfully saved data');
        event.sender.send('datasaved', data);
    });
});