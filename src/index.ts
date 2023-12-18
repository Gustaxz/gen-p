import { Project, StructureKind, SourceFileStructure } from "ts-morph"
import { Entity } from "./file-types/entity"
import path from "path"

const project = new Project()
const dirPath = path.join(__dirname, "../gen")

const entityA = new Entity(project, dirPath, "EntityA", [
	{
		name: "name",
		type: "string",
	},
	{
		name: "age",
		type: "number",
	},
])

const entityB = new Entity(project, dirPath, "Entity b", [
	{
		name: "name",
		type: "string",
	},
	{
		name: "age",
		type: "number",
	},
])

entityA.generateContent()
entityB.generateContent()

project.saveSync()
