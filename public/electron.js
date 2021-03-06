const path = require("path");

const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const iconPath = path.join(__dirname, "build", "icon.png");

function createWindow() {
	const win = new BrowserWindow({
		icon: iconPath,
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	});

	win.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	if (isDev) {
		win.webContents.openDevTools({ mode: "detach" });
	}
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
