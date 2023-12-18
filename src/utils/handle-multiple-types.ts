export function handleMultipleTypes(type: string | string[]) {
	if (type instanceof Array) {
		return type.reduce((acc, curr) => {
			return `${acc} | ${curr}`
		})
	}

	return type
}
