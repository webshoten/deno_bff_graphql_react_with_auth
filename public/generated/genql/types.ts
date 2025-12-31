export default {
    "scalars": [
        1,
        2,
        5,
        7
    ],
    "types": {
        "Mutation": {
            "createUser": [
                6,
                {
                    "name": [
                        1,
                        "String!"
                    ]
                }
            ],
            "deleteUser": [
                6,
                {
                    "id": [
                        2,
                        "ID!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "String": {},
        "ID": {},
        "Post": {
            "content": [
                1
            ],
            "id": [
                2
            ],
            "title": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Query": {
            "me": [
                1
            ],
            "post": [
                3,
                {
                    "id": [
                        2,
                        "ID!"
                    ]
                }
            ],
            "postCount": [
                5
            ],
            "posts": [
                3
            ],
            "test": [
                1
            ],
            "user": [
                6,
                {
                    "id": [
                        2,
                        "ID!"
                    ]
                }
            ],
            "users": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "Int": {},
        "User": {
            "id": [
                2
            ],
            "name": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Boolean": {}
    }
}