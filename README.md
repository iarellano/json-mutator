#### Create array from items
Given the source
```javascript
var source = {
    "firstName": "John",
    "familyName": {
        "lastName": "Wick",
        "arrayName": [
            "W",
            "i",
            "c",
            "k"
        ],
        "moviNames": {
            "name1": "John Wick",
            "name2": "John Wick - Chapter 2",
            "name3": "John Wick - Chapter 3 - Parabellum"
        }
    },
    "names": [
        {
            "firstName": "John",
            "lastName": "Wick"
        }
    ]
}
```
and the spec
```javascript
var source = {
    "properties": {
        "newArray": {
            "items": {
                "source": "familyName",
                "properties": {
                    "spelledName": "arrayName",
                    "surname": "lastName"
                }
            }
        }
    }
}
```
Then the resulting object is
```json
{
    "newArray": [
        {
            "spelledName": [
                "W",
                "i",
                "c",
                "k"
            ],
            "surname": "Wick"
        }
    ]
}
```
    ✓ Create array from items
#### Extract array property
Given the source
```javascript
var source = {
    "firstName": "John",
    "familyName": {
        "lastName": "Wick",
        "arrayName": [
            "W",
            "i",
            "c",
            "k"
        ],
        "moviNames": {
            "name1": "John Wick",
            "name2": "John Wick - Chapter 2",
            "name3": "John Wick - Chapter 3 - Parabellum"
        }
    },
    "names": [
        {
            "firstName": "John",
            "lastName": "Wick"
        }
    ]
}
```
and the spec
```javascript
var source = {
    "properties": {
        "newArray": {
            "items": {
                "source": [
                    "familyName",
                    "arrayName"
                ]
            }
        }
    }
}
```
Then the resulting object is
```json
{
    "newArray": [
        "W",
        "i",
        "c",
        "k"
    ]
}
```
    ✓ Extract array property
#### Create array from property
Given the source
```javascript
var source = {
    "firstName": "John",
    "familyName": {
        "lastName": "Wick",
        "arrayName": [
            "W",
            "i",
            "c",
            "k"
        ],
        "moviNames": {
            "name1": "John Wick",
            "name2": "John Wick - Chapter 2",
            "name3": "John Wick - Chapter 3 - Parabellum"
        }
    },
    "names": [
        {
            "firstName": "John",
            "lastName": "Wick"
        }
    ]
}
```
and the spec
```javascript
var source = {
    "properties": {
        "newArray": {
            "type": "array",
            "items": {
                "properties": {
                    "familyName": {
                        "source": "familyName"
                    }
                }
            }
        }
    }
}
```
Then the resulting object is
```json
{
    "newArray": [
        {
            "familyName": {
                "lastName": "Wick",
                "arrayName": [
                    "W",
                    "i",
                    "c",
                    "k"
                ],
                "moviNames": {
                    "name1": "John Wick",
                    "name2": "John Wick - Chapter 2",
                    "name3": "John Wick - Chapter 3 - Parabellum"
                }
            }
        }
    ]
}
```
    ✓ Create array from property
#### Create array from property
Given the source
```javascript
var source = {
    "firstName": "John",
    "familyName": {
        "lastName": "Wick",
        "arrayName": [
            "W",
            "i",
            "c",
            "k"
        ],
        "moviNames": {
            "name1": "John Wick",
            "name2": "John Wick - Chapter 2",
            "name3": "John Wick - Chapter 3 - Parabellum"
        }
    },
    "names": [
        {
            "firstName": "John",
            "lastName": "Wick"
        }
    ]
}
```
and the spec
```javascript
var source = {
    "items": {
        "properties": {
            "familyName": {
                "source": "familyName"
            }
        }
    }
}
```
Then the resulting object is
```json
[
    {
        "familyName": {
            "lastName": "Wick",
            "arrayName": [
                "W",
                "i",
                "c",
                "k"
            ],
            "moviNames": {
                "name1": "John Wick",
                "name2": "John Wick - Chapter 2",
                "name3": "John Wick - Chapter 3 - Parabellum"
            }
        }
    }
]
```
    ✓ Create array from property
#### Problematic array
Given the source
```javascript
var source = {
    "firstName": "John",
    "familyName": {
        "lastName": "Wick",
        "arrayName": [
            "W",
            "i",
            "c",
            "k"
        ],
        "moviNames": {
            "name1": "John Wick",
            "name2": "John Wick - Chapter 2",
            "name3": "John Wick - Chapter 3 - Parabellum"
        }
    },
    "names": [
        {
            "firstName": "John",
            "lastName": "Wick"
        }
    ]
}
```
and the spec
```javascript
var source = {
    "source": "names",
    "properties": {
        "firstName": {
            "type": "array",
            "source": "firstName"
        },
        "lastName": {
            "type": "array",
            "source": "lastName"
        }
    }
}
```
Then the resulting object is
```json
{
    "firstName": [
        "John"
    ],
    "lastName": [
        "Wick"
    ]
}
```
    ✓ Problematic array

  feature: object to object transformation
#### Property to property transformation, no nested properties
Given the source
```javascript
var source = {
    "firstName": "John",
    "lastName": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    },
    "filmografy": {
        "recurrentCast": [
            "Keanu Reeves",
            "Ian McShane",
            "Lance Reddick"
        ],
        "movies": [
            {
                "John Wick": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 2": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 3 - Parabellum": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            }
        ],
        "upcomingMovies": [
            "John Wick: Chapter 4",
            "John Wick: Chapter 5"
        ]
    }
}
```
and the spec
```javascript
var source = {
    "properties": {
        "givenName": "firstName",
        "surname": "lastName"
    }
}
```
Then the resulting object is
```json
{
    "givenName": "John",
    "surname": "Wick"
}
```
    ✓ Property to property transformation, no nested properties
#### Property to property transformation, with nested properties 1
Given the source
```javascript
var source = {
    "firstName": "John",
    "lastName": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    },
    "filmografy": {
        "recurrentCast": [
            "Keanu Reeves",
            "Ian McShane",
            "Lance Reddick"
        ],
        "movies": [
            {
                "John Wick": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 2": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 3 - Parabellum": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            }
        ],
        "upcomingMovies": [
            "John Wick: Chapter 4",
            "John Wick: Chapter 5"
        ]
    }
}
```
and the spec
```javascript
var source = {
    "properties": {
        "givenName": "firstName",
        "surname": "lastName",
        "features": "features"
    }
}
```
Then the resulting object is
```json
{
    "givenName": "John",
    "surname": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    }
}
```
    ✓ Property to property transformation, with nested properties 1
#### Property to property transformation, with nested properties 2
Given the source
```javascript
var source = {
    "firstName": "John",
    "lastName": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    },
    "filmografy": {
        "recurrentCast": [
            "Keanu Reeves",
            "Ian McShane",
            "Lance Reddick"
        ],
        "movies": [
            {
                "John Wick": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 2": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 3 - Parabellum": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            }
        ],
        "upcomingMovies": [
            "John Wick: Chapter 4",
            "John Wick: Chapter 5"
        ]
    }
}
```
and the spec
```javascript
var source = {
    "properties": {
        "givenName": "firstName",
        "surname": "lastName",
        "features": {
            "source": "features",
            "properties": {
                "angry": "angry",
                "hitman": "hitman"
            }
        }
    }
}
```
Then the resulting object is
```json
{
    "givenName": "John",
    "surname": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    }
}
```
    ✓ Property to property transformation, with nested properties 2
#### Property to property transformation, with nested properties 3
Given the source
```javascript
var source = {
    "firstName": "John",
    "lastName": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    },
    "filmografy": {
        "recurrentCast": [
            "Keanu Reeves",
            "Ian McShane",
            "Lance Reddick"
        ],
        "movies": [
            {
                "John Wick": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 2": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 3 - Parabellum": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            }
        ],
        "upcomingMovies": [
            "John Wick: Chapter 4",
            "John Wick: Chapter 5"
        ]
    }
}
```
and the spec
```javascript
var source = {
    "properties": {
        "givenName": "firstName",
        "surname": "lastName",
        "features": {
            "properties": {
                "angry": {
                    "source": [
                        "features",
                        "angry"
                    ]
                },
                "hitman": {
                    "source": [
                        "features",
                        "hitman"
                    ]
                }
            }
        }
    }
}
```
Then the resulting object is
```json
{
    "givenName": "John",
    "surname": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    }
}
```
    ✓ Property to property transformation, with nested properties 3
#### Introduce property in between object and child elements
Given the source
```javascript
var source = {
    "firstName": "John",
    "lastName": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    },
    "filmografy": {
        "recurrentCast": [
            "Keanu Reeves",
            "Ian McShane",
            "Lance Reddick"
        ],
        "movies": [
            {
                "John Wick": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 2": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 3 - Parabellum": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            }
        ],
        "upcomingMovies": [
            "John Wick: Chapter 4",
            "John Wick: Chapter 5"
        ]
    }
}
```
and the spec
```javascript
var source = {
    "properties": {
        "filmografy": {
            "properties": {
                "John Wick - 2014": {
                    "properties": {
                        "cast": {
                            "source": [
                                "filmografy",
                                "recurrentCast"
                            ]
                        }
                    }
                }
            }
        }
    }
}
```
Then the resulting object is
```json
{
    "filmografy": {
        "John Wick - 2014": {
            "cast": [
                "Keanu Reeves",
                "Ian McShane",
                "Lance Reddick"
            ]
        }
    }
}
```
    ✓ Introduce property in between object and child elements
#### Remove property in between object and child elements
Given the source
```javascript
var source = {
    "firstName": "John",
    "lastName": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    },
    "filmografy": {
        "recurrentCast": [
            "Keanu Reeves",
            "Ian McShane",
            "Lance Reddick"
        ],
        "movies": [
            {
                "John Wick": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 2": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 3 - Parabellum": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            }
        ],
        "upcomingMovies": [
            "John Wick: Chapter 4",
            "John Wick: Chapter 5"
        ]
    }
}
```
and the spec
```javascript
var source = {
    "properties": {
        "filmografy": {
            "type": "array",
            "items": {
                "source": [
                    "filmografy",
                    "recurrentCast"
                ]
            }
        }
    }
}
```
Then the resulting object is
```json
{
    "filmografy": [
        "Keanu Reeves",
        "Ian McShane",
        "Lance Reddick"
    ]
}
```
    ✓ Remove property in between object and child elements
#### Extract nested property to root object with source as an array
Given the source
```javascript
var source = {
    "firstName": "John",
    "lastName": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    },
    "filmografy": {
        "recurrentCast": [
            "Keanu Reeves",
            "Ian McShane",
            "Lance Reddick"
        ],
        "movies": [
            {
                "John Wick": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 2": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 3 - Parabellum": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            }
        ],
        "upcomingMovies": [
            "John Wick: Chapter 4",
            "John Wick: Chapter 5"
        ]
    }
}
```
and the spec
```javascript
var source = {
    "properties": {
        "recurrentCast": {
            "type": "array",
            "source": [
                "filmografy",
                "recurrentCast"
            ]
        }
    }
}
```
Then the resulting object is
```json
{
    "recurrentCast": [
        "Keanu Reeves",
        "Ian McShane",
        "Lance Reddick"
    ]
}
```
    ✓ Extract nested property to root object with source as an array
#### Extract nested property to root object with source as an array and source in child object
Given the source
```javascript
var source = {
    "firstName": "John",
    "lastName": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    },
    "filmografy": {
        "recurrentCast": [
            "Keanu Reeves",
            "Ian McShane",
            "Lance Reddick"
        ],
        "movies": [
            {
                "John Wick": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 2": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 3 - Parabellum": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            }
        ],
        "upcomingMovies": [
            "John Wick: Chapter 4",
            "John Wick: Chapter 5"
        ]
    }
}
```
and the spec
```javascript
var source = {
    "properties": {
        "recurrentCast": {
            "type": "array",
            "items": {
                "source": [
                    "filmografy",
                    "recurrentCast"
                ]
            }
        }
    }
}
```
Then the resulting object is
```json
{
    "recurrentCast": [
        "Keanu Reeves",
        "Ian McShane",
        "Lance Reddick"
    ]
}
```
    ✓ Extract nested property to root object with source as an array and source in child object
#### Extract nested property to root object with source as an array and source in child object
Given the source
```javascript
var source = {
    "firstName": "John",
    "lastName": "Wick",
    "features": {
        "angry": "very",
        "hitman": "yes"
    },
    "filmografy": {
        "recurrentCast": [
            "Keanu Reeves",
            "Ian McShane",
            "Lance Reddick"
        ],
        "movies": [
            {
                "John Wick": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 2": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            },
            {
                "John Wick: Chapter 3 - Parabellum": {
                    "characters": [
                        "John Wick",
                        "Winston",
                        "Charon"
                    ]
                }
            }
        ],
        "upcomingMovies": [
            "John Wick: Chapter 4",
            "John Wick: Chapter 5"
        ]
    }
}
```
and the spec
```javascript
var source = {
    "properties": {
        "recurrentCast": {
            "type": "array",
            "source": "filmografy",
            "items": {
                "source": "recurrentCast"
            }
        }
    }
}
```
Then the resulting object is
```json
{
    "recurrentCast": [
        "Keanu Reeves",
        "Ian McShane",
        "Lance Reddick"
    ]
}
```
