type Decorators = string[]

export function validateTypes(type: string): Decorators {
	const decorators: string[] = []

	if (type.includes("|")) {
		const types = type.split("|")
		const unionTypes = types.map((type) => validateTypes(type.trim()))
		decorators.push(...unionTypes.flat())
	}

	if (type.includes("[]")) {
		const stringArrayType = type.replace("[]", "")
		const arrayType = validateTypes(stringArrayType)
		decorators.push(`IsArray()`)
		decorators.push(...arrayType)
	}

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
		case "null":
			decorators.push("IsOptional()")
			break
	}

	return decorators
}
