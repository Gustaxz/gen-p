export function translatePrismaToTypescript(prismaType: string): string {
	switch (prismaType) {
		case "integer":
			return "number"
		case "string":
			return "string"
		case "boolean":
			return "boolean"
		default:
			return "any"
	}
}
