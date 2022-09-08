import React, { useRef } from 'react';

// interface PaginationProps {
// 	targetElement: React.RefObject<HTMLElement>;
// 	callback: () => void;
// 	options: OptionProps;
// }

interface OptionProps {
	root: HTMLElement | null;
	rootMargin: string;
	threshold: number;
}

const DEFAULT_OPTIONS = {
	root: null,
	rootMargin: '0px',
	threshold: 1.0,
};

const usePagination = (
	targetElement: React.RefObject<HTMLElement>,
	callback: () => void,
	options: OptionProps = DEFAULT_OPTIONS
) => {
	const prevY = useRef(0); // storing the last intersection y position

	const handleObserver = (entities: any, observer: any) => {
		const y = entities[0].boundingClientRect.y;

		if (prevY.current > y) {
			callback();
		}

		prevY.current = y;
	};

	const observer = React.useRef(new IntersectionObserver(handleObserver, options));

	React.useEffect(() => {
		if (targetElement.current) {
			observer.current.observe(targetElement.current);
		}
	}, [targetElement]);

	const removeObserver = () => {
		observer.current.disconnect();
	};

	return removeObserver;
};

export default usePagination;
