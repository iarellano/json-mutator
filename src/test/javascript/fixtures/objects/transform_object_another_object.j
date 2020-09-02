{
  "feature": "feature: modify object",
  "tests": {
    "some test to perform 1": {
      "source": {
        "firstName": "John",
        "lastName": "Wick"
      },
      "map": {
        "properties": {
          "givenName": "firstName",
          "surname": {
            "source": "lastName"
          }
        }
      },
      "expected": {
        "givenName": "John",
        "surname": "Wick"
      }
    },
    "some test to perform 2": {
      "source": {
        "firstName": "John",
        "lastName": "Wick"
      },
      "map": {
        "properties": {
          "givenName": "firstName",
          "surname": {
            "source": "lastName"
          }
        }
      },
      "expected": {
        "givenName": "John",
        "surname": "Wick"
      }
    }
  }
}