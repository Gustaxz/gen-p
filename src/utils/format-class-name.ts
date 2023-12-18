export function formatClassName(className: string) {
	if (className.includes(" ")) {
		return className
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join("")
	}

	return className.charAt(0).toUpperCase() + className.slice(1)
}
