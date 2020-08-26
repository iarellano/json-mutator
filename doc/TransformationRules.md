If source is string and type is missing then value is assigned as is. Pointer remains
If source is string and type is literal value thens transform and assign the value. Pointer remains
If source is array - pointer moves forward
If source is missing, either properties or items must be present
If source is missing, pointer remains where it is
If source is .. pointer moves backwards - cannot go further than root object
If source is missing, 
At anytime at least one of source, properties or items must be present
If type is array, then items must be present
If type is array, then properties must not be present
If type is object, then properties must be present
If type is object, then items must be present
If type is Literal then items and properties must not be present
At least one property of type Property must exist in properties
If items is present the it must have either a Source or Property definition
If type is array and source is not array, an array of one item will be created as per either Source or Property definition. 



Literal: string | integer | number | boolean

Name: '..' | string

Source: Name | Name[]

Replace:
	search
	replacer

Object:
	source: Source
  type: Literal | object | array
  required: true | false
  default: [object, array, literal]
  override: [object, array, literal]
	replace: Replace | Replace[]
	callback: callback_function()
	itemCallback: item_callback_function()
	properties:
		name1: Property [, name2: Property [, name3: Property...]]
	items: 
    item: Source | Property

Property:
    type: string | integer | number | boolean
    required: true | false
    default: [object, array, literal]
    override: [object, array, literal]
	source: Source
	replace: Replace | Replace[]
	callback: callback_function()

----------------- Object --------------------------
type: object
required: true | false
default: [object, array, literal]
override: [object, array, literal]
source: Source
callback: callback_function()
properties:
	name1: Property [, name2: Property [, name3: Property...]]


------------------ Array --------------------------
type: array
required: true | false
default: [object, array, literal]
override: [object, array, literal]
source: Source
replace: Replace | Replace[]
callback: callback_function()
itemCallback: item_callback_function()
items:
	Source | Property

