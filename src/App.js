import "./App.css";
import { useState } from "react";
import {
	Card,
	Container,
	FormControl,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";

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
});

function App() {
	const styles = useStyles();
	async function fileToDataURL(file) {
		var reader = new FileReader();
		return {
			file: await new Promise(function (resolve, reject) {
				reader.onload = function (event) {
					resolve(event.target.result);
				};
				reader.readAsDataURL(file);
			}),
			name: file.name,
		};
	}

	function getDataURLs(target) {
		return Promise.all([...target.files].map(fileToDataURL));
	}
	const upload = async (e) => {
		let newFiles = await getDataURLs(e.target);
		setFilteredFiles(newFiles);
		setFiles(newFiles);
	};
	const [files, setFiles] = useState([]);
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
		} else if (text == "") {
			setFileName("");
			setFilteredFiles(files);
		}
	};
	return (
		<Container maxWidth='md' className={styles.container}>
			<Typography variant='h1'>SoundBites</Typography>
			<FormControl>
				<input
					type='file'
					multiple
					onChange={(e) => {
						upload(e);
					}}
				/>
				{files.length > 1 && (
					<TextField
						label={"Day title..."}
						color={"primary"}
						variant={"filled"}
						onChange={(e) => {
							searchFilterFunction(e.target.value);
						}}
						value={fileName}
					/>
				)}
			</FormControl>

			{filteredFiles.map(function (item, index) {
				return (
					<Card className={styles.card}>
						<Typography>{item.name}</Typography>
						<audio controls>
							<source src={item.file} type='audio/mpeg' />
							Your browser does not support the audio tag.
						</audio>
					</Card>
				);
			})}
		</Container>
	);
}

export default App;
