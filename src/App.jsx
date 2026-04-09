import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";

import './App.css';

function App() {
	// Define state variables.
	const [items, setItems] = useState([]);

	// Load and process the JSON data.
	useEffect(() => {
		fetch('boxoffice.json')
			.then((response) => response.json())
			.then((jsonData) => {
				// Print data into console for debugging.
				console.log(jsonData);

				// Filter data to only include top 500 movies.
				const filteredData = jsonData.filter(item => item.rank <= 500);
				console.log(filteredData);

				// Save filtered data items to state.
				setItems(filteredData);
			})
			.catch((error) => {
				console.error('Error loading JSON file:', error);
			});
	}, []);

	// Define constant variables.
	const width = 600;
	const height = 500;
	const marginTop = 20;
	const marginBottom = 60;
	const marginLeft = 80;
	const marginRight = 20;

	// Set scales.
	const x = d3.scaleLinear()
		.domain([0, d3.max(items.map(item => item.screens_total))])
		.range([marginLeft, width - marginRight]);
	const y = d3.scaleLinear()
		.domain([0, d3.max(items.map(item => item.audience_total))])
		.range([height - marginBottom, marginTop]);

	// Set axes.
	const gx = useRef();
	const gy = useRef();
	useEffect(() => void d3.select(gx.current).call(
		d3.axisBottom(x)), [gx, x]);
	useEffect(() => void d3.select(gy.current).call(
		d3.axisLeft(y)), [gx, y]);


	const [selectedMovie, setSelectedMovie] = useState(null); // default: null
	const handleClickPoint = (item) => {
		console.log(item);

		if (selectedMovie && selectedMovie.title === item.title) {
			setSelectedMovie(null);
		}
		else {
			setSelectedMovie(item);
		}
	}

	const [hoveredMovie, setHoveredMovie] = useState(null);


	// Render the chart.
	return (
		<>
			<div id="header">
				<h1>In-Class Activity on Interaction</h1>
			</div>

			<div id="main">
				<div id="visualization">
					<svg width={width} height={height}>
						<g ref={gx} className="axis"
							transform={`translate(0, ${height - marginBottom})`} />
						<g ref={gy} className="axis"
							transform={`translate(${marginLeft}, 0)`} />

						<g className="chart-data-area">
							{items.map((item) => {						
								return (
									<g key={item.rank}
										className="datapoint"
										transform={`translate(${
												x(item.screens_total)}, ${
												y(item.audience_total)})`}>
										<circle cx="0" cy="0" r="3"
											onClick={() => handleClickPoint(item)}
											style={{fill:
												selectedMovie == item ? 'red' : 'blue',
												opacity:
												selectedMovie != null && selectedMovie != item ? 0.1 : 1.0
											}}
											onMouseEnter={() => setHoveredMovie(item)}
											onMouseLeave={() => setHoveredMovie(null)}
										/>
										{hoveredMovie ? <text>hoveredMovie.title</text> : ""}
									</g>
								);
							})}
						</g>
					</svg>
				</div>

				<div id="selected-item-information">
					<div className="panel-title">Selected Item:</div>
					<div>
						{selectedMovie != null ? selectedMovie.title : ""}
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
