import {
	Button,
	Card,
	makeStyles,
	TextField,
	Typography,
	Container,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import Check from "@material-ui/icons/Check";

const fs = window.require("fs");
const dataurl = window.require("dataurl");
const pathModule = window.require("path");

const formatSize = (size) => {
	var i = Math.floor(Math.log(size) / Math.log(1024));
	return (
		(size / Math.pow(1024, i)).toFixed(2) * 1 +
		" " +
		["B", "kB", "MB", "GB", "TB"][i]
	);
};

const useStyles = makeStyles({
	container: {
		display: "flex",
		flexDirection: "column",
		alightItems: "center",
		justifyContent: "center",
		padding: 5,
	},
	card: {
		display: "flex",
		flexDirection: "column",
		alightItems: "center",
		justifyContent: "center",
		margin: "20px auto",
		padding: 5,
		backgroundColor: "#F2F2F2",
	},
	header: {
		display: "flex",
		flexDirection: "column",
		alightItems: "center",
		justifyContent: "center",
		padding: 5,
	},
});

function App() {
	const [path, setPath] = useState("/Users");
	const styles = useStyles();
	const [files, setFiles] = useState([]);
	async function filesStructure(path) {
		let tempFiles = await fs
			.readdirSync(path)
			.map((file) => {
				const stats = fs.statSync(pathModule.join(path, file));
				return {
					name: file,
					size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
					directory: stats.isDirectory(),
				};
			})
			.sort((a, b) => {
				if (a.directory === b.directory) {
					return a.name.localeCompare(b.name);
				}
				return a.directory ? -1 : 1;
			});
		console.log(tempFiles);
		await setFiles(tempFiles);
		await setFilteredFiles(tempFiles);
	}
	const convertSong = (filePath) => {
		const songPromise = new Promise((resolve, reject) => {
			fs.readFile(filePath, (err, data) => {
				if (err) {
					reject(err);
				}
				resolve(dataurl.convert({ data, mimetype: "audio/mp3" }));
			});
		});
		console.log(songPromise);
		return songPromise;
	};
	let player = new Audio();

	const play = async (string) => {
		player.pause();
		let audio = await convertSong(`${path}/${string}`);
		player = new Audio(audio);
		player.currentTime = 0;
		player.play();
	};

	const [filteredFiles, setFilteredFiles] = useState([]);
	const [fileName, setFileName] = useState([]);
	const searchFilterFunction = async (text) => {
		if (text) {
			const newData = files.filter(function (item) {
				const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
				const textData = text.toUpperCase();
				return itemData.indexOf(textData) > -1;
			});
			setFilteredFiles(newData);
			setFileName(text);
		} else if (text === "") {
			setFileName("");
			setFilteredFiles(files);
		}
	};
	const [changingPath, setChangingPath] = useState(false);
	const [tempPath, setTempPath] = useState("");

	async function getStorage() {
		let storedPath = await localStorage.getItem("path");
		setPath(storedPath);
		filesStructure(storedPath);
	}

	async function setStorage() {
		await localStorage.setItem("path", tempPath);
		await setPath(tempPath);
		filesStructure(tempPath);
		setChangingPath(false);
	}

	useEffect(() => {
		getStorage();
	}, []);

	return (
		<Container>
			<Typography variant='h6'>Path: {path}</Typography>

			<Card className={styles.header}>
				<Button
					onClick={() => {
						setChangingPath(!changingPath);
					}}
					variant='contained'
					color='primary'
				>
					Change Path
				</Button>

				{changingPath && (
					<TextField
						label={"Set Path"}
						color={"primary"}
						variant={"filled"}
						onChange={(e) => {
							setTempPath(e.target.value);
						}}
						value={tempPath}
						InputProps={{
							className: "input",
							endAdornment: (
								<Button
									color='primary'
									variant='contained'
									onClick={() => {
										setStorage();

										setChangingPath(false);
									}}
								>
									<Check />
								</Button>
							),
						}}
					/>
				)}
				{filteredFiles.length > 0 && (
					<TextField
						label={"Search files..."}
						color={"primary"}
						variant={"filled"}
						onChange={(e) => {
							searchFilterFunction(e.target.value);
						}}
						value={fileName}
					/>
				)}
			</Card>

			{filteredFiles.map(function (item, index) {
				return (
					<>
						{item.name.slice(item.name.length - 4, item.name.length) ===
							".mp3" && (
							<Card className={styles.card}>
								<Typography>{item.name}</Typography>
								<Button
									onClick={() => {
										play(item.name);
									}}
								>
									Play Bite
								</Button>
							</Card>
						)}
					</>
				);
			})}
		</Container>
	);
}

export default App;
