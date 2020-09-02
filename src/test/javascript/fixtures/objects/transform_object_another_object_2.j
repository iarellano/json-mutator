{
    "feature": "feature: Array extractions",
    "source": {
        "firstName": "John",
        "lastName": "Wick",
        "filmografy": {
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
    },
    "tests": {
        "some test to perform 1": {
            "map": {
                "type": "object",
                "properties": {
                    "emptyProp": {
                        "properties": {
                            "innerProp": {
                                "source": [
                                    "firstName"
                                ]
                            }
                        }
                    }
                }
            },
            "expected": {
                "emptyProp": {
                    "innerProp": "Isaias"
                }
            }
        },
        "Extract array with object as items": {
            "map": {
                "properties": {
                    "array1": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "source": [
                                "familyName"
                            ],
                            "properties": {
                                "joinedName": "arrayName",
                                "surname": "lastName"
                            }
                        }
                    }
                }
            },
            "expected": {
                "array1": [
                    {
                        "joinedName": [
                            "i",
                            "s",
                            "a",
                            "i",
                            "a",
                            "s"
                        ],
                        "surname": "Arellano"
                    }
                ]
            }
        }
    }
}