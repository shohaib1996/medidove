"use client"

import React, { useEffect } from "react";
import { animationCreate } from "@/utils/utils";
import ScrollTop from "@/components/common/ScrollTop";

if (typeof window !== "undefined") {
	require("bootstrap/dist/js/bootstrap");
}

const Wrapper = ({ children }: any) => {
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