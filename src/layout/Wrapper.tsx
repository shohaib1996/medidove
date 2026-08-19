"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { animationCreate } from "@/utils/utils";
import ScrollTop from "@/components/common/ScrollTop";

type WrapperProps = {
	children: ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => {
	useEffect(() => {
		// animation
		const timer = setTimeout(() => {
			animationCreate();
		}, 100);

		return () => clearTimeout(timer);
	}, []);
	return (
		<>
			{children}
			<ScrollTop />
		</>
	);
};

export default Wrapper;
