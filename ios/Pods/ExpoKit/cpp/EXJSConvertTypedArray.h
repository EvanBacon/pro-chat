// Adapted from phoboslab/Ejecta on GitHub
// https://github.com/phoboslab/Ejecta/tree/8917cfbc17b3298f99ca7d719cfc57fcb8e43519/Source/Ejecta
// with Android compatibility changes and changes to allow coexisting with
// iOS >=10 built-in TypedArray API

#include <stddef.h>

#include <JavaScriptCore/JSBase.h>


#include "EXJSUtils.h"


#ifdef __cplusplus
extern "C" {
#endif


/*!
@enum JSType
@abstract     A constant identifying the Typed Array type of a JSValue.
@constant     kJSTypedArrayTypeNone                 Not a Typed Array.
@constant     kJSTypedArrayTypeInt8Array            Int8Array
@constant     kJSTypedArrayTypeInt16Array           Int16Array
@constant     kJSTypedArrayTypeInt32Array           Int32Array
@constant     kJSTypedArrayTypeUint8Array           Int8Array
@constant     kJSTypedArrayTypeUint8ClampedArray    Int8ClampedArray
@constant     kJSTypedArrayTypeUint16Array          Uint16Array
@constant     kJSTypedArrayTypeUint32Array          Uint32Array
@constant     kJSTypedArrayTypeFloat32Array         Float32Array
@constant     kJSTypedArrayTypeFloat64Array         Float64Array
@constant     kJSTypedArrayTypeArrayBuffer          ArrayBuffer
*/
// We're now using the constants from JavaScriptCore/JSTypedArray.h so comment this out
/*
typedef enum {
	kJSTypedArrayTypeNone = 0,
	kJSTypedArrayTypeInt8Array = 1,
	kJSTypedArrayTypeInt16Array = 2,
	kJSTypedArrayTypeInt32Array = 3,
	kJSTypedArrayTypeUint8Array = 4,
	kJSTypedArrayTypeUint8ClampedArray = 5,
	kJSTypedArrayTypeUint16Array = 6,
	kJSTypedArrayTypeUint32Array = 7,
	kJSTypedArrayTypeFloat32Array = 8,
	kJSTypedArrayTypeFloat64Array = 9,
	kJSTypedArrayTypeArrayBuffer = 10
} JSTypedArrayType;
*/

/*!
@function
@abstract           Setup the JSContext for use of the Typed Array functions.
@param ctx          The execution context to use
*/
void JSContextPrepareTypedArrayAPI(JSContextRef ctx);

/*!
@function
@abstract           Returns a JavaScript value's Typed Array type
@param ctx          The execution context to use.
@param object        The JSObject whose Typed Array type you want to obtain.
@result             A value of type JSTypedArrayType that identifies value's Typed Array type
*/
JSTypedArrayType JSObjectGetTypedArrayType(JSContextRef ctx, JSObjectRef object);

/*!
@function
@abstract           Creates an empty JavaScript Typed Array with the given number of elements
@param ctx          The execution context to use.
@param arrayType    A value of type JSTypedArrayType identifying the type of array you want to create
@param numElements  The number of elements for the array.
@result             A JSObjectRef that is a Typed Array or NULL if there was an error
*/
JSObjectRef JSObjectMakeTypedArrayWithHack(JSContextRef ctx, JSTypedArrayType arrayType, size_t numElements);

/*!
@function
@abstract           Creates an empty JavaScript Typed Array with the given data
@param ctx          The execution context to use.
@param arrayType    A value of type JSTypedArrayType identifying the type of array you want to create
@param data         Pointer to start of data to copy
@param length       Length of data to copy in bytes
@result             A JSObjectRef that is a Typed Array or NULL if there was an error
*/
JSObjectRef JSObjectMakeTypedArrayWithData(JSContextRef ctx, JSTypedArrayType arrayType, void *data, size_t length);

/*!
@function
@abstract           Returns a copy of the Typed Array's data
@param ctx          The execution context to use.
@param object       The JSObject whose Typed Array data you want to obtain.
@param plength      Place to put length of data, ignored if NULL
@result             Pointer to start of a copy of the Typed Array's data or NULL if the JSObject is not a Typed Array.
                    The buffer must be free()'d later.
*/
void *JSObjectGetTypedArrayDataMalloc(JSContextRef ctx, JSObjectRef object, size_t *plength);

/*!
@function
@abstract           Replaces a Typed Array's data
@param ctx          The execution context to use.
@param object       The JSObject whose Typed Array data you want to replace
@param data         Pointer to start of data to read from
@param length       Length of data to read
*/
void JSObjectSetTypedArrayData(JSContextRef ctx, JSObjectRef object, void *data, size_t length);


#ifdef __cplusplus
}
#endif

