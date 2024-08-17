import type { Class } from '@prtcl/prtcl/types'

function getGlobalCtx(): typeof globalThis {
	if (typeof globalThis !== 'undefined') return globalThis
	// @ts-ignore: global not define in deno
	if (typeof global !== 'undefined') return global
	if (typeof self !== 'undefined') return self
	if (typeof window !== 'undefined') return window
	throw new Error()
}

const globalCtx = getGlobalCtx() as typeof globalThis & { [x: string]: Class }

export const EXPECT_SUPPORT_TYPES = [
	'AudioData',
	'Blob',
	'CropTarget',
	'CryptoKey',
	'DOMException',
	'DOMMatrix',
	'DOMMatrixReadOnly',
	'DOMPoint',
	'DOMPointReadOnly',
	'DOMQuad',
	'DOMRect',
	'DOMRectReadOnly',
	'File',
	'FileList',
	'FileSystemDirectoryHandle',
	'FileSymtemFileHandle',
	'FileSymtemHandle',
	'GPUCompilationInfo',
	'GPUCompilationMessage',
	'ImageBitmap',
	'ImageData',
	'RTCCertificate',
	'VideoFrame',
]

function getIsSuportedByStructuredClone(): (value: object) => boolean {
	if (!('structuredClone' in globalCtx)) return () => false

	const SUPPORTED_TYPES: Class[] = [Date, RegExp, Error, String, Number, Boolean]
	for (const name of EXPECT_SUPPORT_TYPES) if (name in globalCtx) SUPPORTED_TYPES.push(globalCtx[name])

	return (value) => SUPPORTED_TYPES.some((Type) => value instanceof Type)
}

export const isSuportedByStructuredClone = getIsSuportedByStructuredClone()
