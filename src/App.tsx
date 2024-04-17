import { useState } from 'react';
import Slider from './components/Slider/Slider';
import './App.css';

function App() {
	const [value, setValue] = useState(5);
	return (
		<>
			<p>Slider Value: {value}</p>
			<Slider
				min={0}
				max={20}
				step={1}
				baseValue={value}
				getValue={(v) => setValue(v)}
			/>
		</>
	);
}

export default App;
