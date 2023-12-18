function info(message: string) {
	console.log(message)
}

function error(message: string) {
	console.error(message)
}

function warn(message: string) {
	console.warn(message)
}

function debug(message: string) {
	console.debug(message)
}

function log(message: string) {
	console.log(message)
}

export const logger = {
	info,
	error,
	warn,
	debug,
	log,
}
