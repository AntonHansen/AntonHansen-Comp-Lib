import { useState, useRef, useEffect } from 'react';
import './Slider.scss';

type DivMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

function Slider({
	min,
	max,
	step,
	baseValue,
	getValue,
}: {
	min: number;
	max: number;
	step: number;
	baseValue: number;
	getValue: (v: number) => void;
}) {
	const [value, setValue] = useState(baseValue);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const dragStartRef = useRef<number | null>(null);
	const dotsContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			if (isDragging && dragStartRef.current !== null) {
				const newValue = calculateValue(event.clientX);
				handleChange(newValue);
			}
		};

		const handleMouseUp = () => {
			if (isDragging) {
				setIsDragging(false);
				dragStartRef.current = null;
			}
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging]);

	const handleChange = (newValue: number) => {
		setValue(newValue);
		getValue(newValue);
	};

	const calculateValue = (clientX: number): number => {
		const rect = (
			document.getElementById('slider') as HTMLElement
		).getBoundingClientRect();
		const percent = (clientX - rect.left) / rect.width;
		let newValue = min + Math.round((percent * (max - min)) / step) * step;
		newValue = Math.max(min, Math.min(max, newValue));
		return newValue;
	};

	const handleMouseDown = (event: DivMouseEvent) => {
		setIsDragging(true);
		dragStartRef.current = event.clientX;
		const newValue = calculateValue(event.clientX);
		handleChange(newValue);
	};

	const amountOfSteps = (max - min) / step;

	const percentage = ((value - min) / (max - min)) * 100;
	const position = `${percentage}%`;

	return (
		<div id="slider-container">
			<div id="slider" style={{ width: '80%', height: '2rem', backgroundColor: '#ddd', position: 'relative' }} onMouseDown={handleMouseDown}>
				<div id="slider-value" style={{ position: 'absolute', width: position, height: '100%', backgroundColor: '#007bff' }} />
				{amountOfSteps <= 20 && (
					<div ref={dotsContainerRef} style={{ position: 'relative', width: '100%', height: '100%' }} className='dots-container'>
						{[...Array(amountOfSteps)].map((_, index) => (
							<div key={index} className="dots" style={{ position: 'absolute', left: `${(100 / amountOfSteps) * index}%`, width: '0.1rem', height: '90%', top: '5%', backgroundColor: '#000' }} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default Slider;
