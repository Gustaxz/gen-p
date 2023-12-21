export function translatePrismaToTypescript(propterty: any, options: string[]): string {
	if (options.includes("type")) {
		if (propterty["type"] instanceof Array) {
			const pipeType = propterty["type"].map((type: string) => {
				return translatePrismaToTypescript({ type }, ["type"])
			})

			return pipeType.join(" | ")
		}

		switch (propterty["type"]) {
			case "string":
				if (options.includes("format")) {
					switch (propterty["format"]) {
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
					const arrayType = propterty["items"]["type"]
					return `${translatePrismaToTypescript({ type: arrayType }, ["type"])}[]`
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
