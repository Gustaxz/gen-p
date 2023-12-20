export function translatePrismaToTypescript(prismaType: string, formatType?: string): string {
	switch (prismaType) {
		case "integer":
			return "number"
		case "string":
			if (formatType === "date-time") return "Date"
			return "string"
		case "boolean":
			return "boolean"
		case "null":
			return "null"
		default:
			return "any"
	}
}
