# json2ajson
Json to another json converter

## Usage

### API
<code>transform(source, spec[, options]): [object|array]</code>

### Example
```javascript

var spec = {
    type: 'object',
    attributes: {
        firstName: 'fname' 
    }
};

var source = {
    "fname": "John"
};

var options = {
    allowNulls: false,
    defaultRequired: true,
    enforceTypes: true
};

var transformedData = transform(source, spec, options);
```

### options object
| Property | Default | Description |
|-----------|---------| ------------|
| allowNulls | true | If true, it will let null values coming from the source object. It is overriden by the local property <code>nullable</code> |
| defaultRequired | true | If local property <code>required</code> is missing, it will take this value. |
| enforceTypes | true | It will verify the type of native attributes and native array items when local property is present |

Allowed native types are:
- integer | int
- float | number
- bool | boolean
- string

## Spec Definition
The specification object drive the transformer through the transformation process. The spec attempts to follow
the Json schema structure.


### Defining a simple object with just one property

```javascript
var spec = {
    type: 'object',
    attributes: {
        firstName: 'fname' 
    }
};
```

with the above having the objects
source
```json
{
    "fname": "John"
}
```

The output will be
```json
{
    "firstName": "John"
}
```

### Defining a simple object with just a <code>complex</code> property
```javascript
var spec = {
    type: 'object',
    attributes: {
        firstName: {
            source: 'fname',
            type: 'string',
            required: true,
            nullable: true
        } 
    }
};
```

With the previous spec we will get the same output as with the previous one, the
difference is that it will verify that the property in source is there even if it
 is null, otherwise it whill throw an error.

### Defining an array of strings

Given the spec
```javascript
var spec = {
    type: "array",
    items: {
        type: "string"
    }
}
```

Having source be
```json
[
    "one", "two", "three"
]
```

Ouput will be
```json
[
    "one", "two", "three"
]
```

Not really useful until you use other features such as  [hooks](#hooks), but lets use itemName. Now given the spec
```javascript
var spec = {
    type: "array",
    itemName: 'number',
    items: {
        type: "string"
    }
}
```

With same source now we will get an array of objects:
```json
[
    {
        "number": "one"
    },
    {
        "number": "two"
    },
    {
        "number": "three"
    }
]
```

## Hooks

Depending on of the level at which the hook is defined it will allows to modify some or all of object they receive as parameters.

### Root hooks

Root hooks allow to modify the final object once it has been transformed. They can be used
either with <code>array</code>s and <code>object</code>s.

#### before hook

Before hooks allow to manipulate the current objects. This might be useful for example when you
need to modify the source so that it can be easier to be transformed.

##### API
<code>before(source, spec, target) : undefined</code>

##### Parameter values
| Parameter | Description |
|-----------|-------------|
| source      | Current element of the source being processed. This is the root object. |
| spec        | Current element of the specification. This is the root specification |
| target      | Current node to which the value is to be assigned, this object is empty at this moment. |

##### example
```javascript
var spec = {
    type: 'object',
    attributes: {
        someAttribute: {
            source: 'sourceAttribute',
            before: (source, spec, target) => {
                    console.log(target); // empty object 
            }
        }
    }
};
```

#### after hook

After hook executes right after the whole object has been transformed, it can help to give the
transfomed object a final adjustment by either modifying the contents of result object or by
returning a new transformed object.

##### API

<code>after(node, spec, result) : [undefined || value to replace]</code>

##### Parameter values
| Parameter | Description |
|-----------|-------------|
| node      | Current element of the source being processed. This is the root object. |
| spec      | Current element of the specification. This is the root specification |
| result    | The transformed object. This is the root transformed object |

##### Return values
| Returns | Description |
|-----------|-------------|
| undefined | Does nothing after invoking the hook |
| value     | Overrides the transformed object. |

##### Example
```javascript
var spec = {
    type: 'object',
    attributes: {
        someAttribute: {
            source: 'sourceAttribute',
        }
    },
    after: (source, spec, result) => {
        console.log(result); 
    }
};

```


### Inner hooks

#### before hook
This hook in invoked before assigning the source property value to the target object, no validation
has been perfomed at this point. Allow to modify any of the parameters. It can be used with types
<code>array</code> and </object>

##### API
<code>before(source, spec, target, attribute): undefined</code>

##### Parameter values
| Parameter | Description |
|-----------|-------------|
| source      | Current element of the source being processed. This is the root object. |
| spec        | Current element of the specification. This is the root specification |
| target      | Current node to which the value is to be assigned, this object is empty at this moment. |
| attribute   | Name of the property to be created |


##### example
```javascript
var spec = {
    type: 'object',
    attributes: {
        someAttribute: {
            source: 'sourceAttribute',
            before: (source, spec, target, attribute) => {
                console.log(target); 
                console.log(attribute);
                console.log(target[attribute]); // undefined. not yet assigned.
            }
        }
    }
};
```

#### after hook
After hook executes right after the property defining the hook has been transformed assinged, it allows
to modify any of the parameters. It can be used with types <code>array</code>, <code>object</code> and
<code>complex</code> attributes.
                                                                                              <code>array</code> and </object>.
##### API

<code>after(node, spec, target, attribute) : [undefined || value to replace]</code>

##### Parameter values
| Parameter | Description |
|-----------|-------------|
| node      | Current element of the source being processed. This is the root object. |
| spec      | Current element of the specification. This is the root specification |
| target    | Current node to which the property has been assigned |
| attribute | Name of the created property |

##### Return values
| Returns | Description |
|-----------|-------------|
| undefined | Does nothing after invoking the hook |
| value     | Overrides the property value to be assigend. |

##### Example
```javascript
var spec = {
    type: 'object',
    attributes: {
        someAttribute: {
            source: 'sourceAttribute',
            after: (source, spec, target, attribute) => {
                target[attribute] = target[attribute] + ' modified'; 
            }
        }
    },
    
};
```


#### itemCallback hook
Item callback executes after arrays items are assigned to the target array, they can be used at any level root or inner.

##### API
<code>itemCallback(source, spec, target, itemValue, index): [undefined | value to assign as item]</code>

##### Parameter values
| Parameter | Description |
|-----------|-------------|
| source    | Current element holding the original array items. |
| spec      | Current element of the specification. |
| target    | Current array to which the item has been assigned |
| itemValue | To value assigned to the array |
| index     | Index of the assign item in the target array |

##### Return values
| Returns | Description |
|-----------|-------------|
| undefined | Does nothing after invoking the hook |
| value     | Overrides the item value . |

 
##### Example
```javascript
var spec = {
    type: "array",
    items: {
            type: "string"
    },
    itemCallback: (source, spec, target, itemValue, i) => {
        target[i] = {
            namedItem: itemValue
        };
    }
}
```