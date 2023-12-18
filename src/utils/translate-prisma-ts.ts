export function translatePrismaToTypescript(prismaType: string): string {
	switch (prismaType) {
		case "integer":
			return "number"
		case "string":
			return "string"
		case "boolean":
			return "boolean"
		case "null":
			return "null"
		default:
			return "any"
	}
}
