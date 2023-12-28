export function translatePrismaToTypescript(property: any): string {
	const options = Object.keys(property)

	if (options.includes("type")) {
		if (property["type"] instanceof Array) {
			const pipeType = property["type"].map((type: string) => {
				return translatePrismaToTypescript({ type })
			})

			return pipeType.join(" | ")
		}

		switch (property["type"]) {
			case "string":
				if (options.includes("format")) {
					switch (property["format"]) {
						case "date-time":
							return "Date"
						default:
							return "string"
					}
				}
				return "string"
			case "integer":
				return "number"
			case "boolean":
				return "boolean"
			case "array":
				if (options.includes("items")) {
					const arrayType = property["items"]["type"]
					const res = translatePrismaToTypescript({
						type: arrayType,
						format: property["format"],
					})
					return `${res}[]`
				}

				return "any[]"
			case "null":
				return "null"
			default:
				return "any"
		}
	}
	return "any"
}
