type Decorators = string[]

export function validateTypes(type: string | string[]): Decorators {
	const decorators: string[] = []

	if (!(type instanceof Array)) {
		switch (type) {
			case "string":
				decorators.push("IsString()")
				break
			case "number":
				decorators.push("IsNumber()")
				break
			case "boolean":
				decorators.push("IsBoolean()")
				break
			case "Date":
				decorators.push("IsDate()")
				break
		}

		return decorators
	}

	if (type.includes("string")) {
		decorators.push("IsString()")
	}

	if (type.includes("number")) {
		decorators.push("IsNumber()")
	}

	if (type.includes("boolean")) {
		decorators.push("IsBoolean()")
	}

	if (type.includes("Date")) {
		decorators.push("IsDate()")
	}

	if (type.includes("null")) {
		decorators.push("IsOptional()")
	}

	return decorators
}
