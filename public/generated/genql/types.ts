export default {
    "scalars": [
        1,
        2,
        4,
        8
    ],
    "types": {
        "AuthResult": {
            "message": [
                1
            ],
            "success": [
                2
            ],
            "user": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "String": {},
        "Boolean": {},
        "AuthUser": {
            "createdAt": [
                1
            ],
            "email": [
                1
            ],
            "emailVerified": [
                2
            ],
            "id": [
                4
            ],
            "name": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ID": {},
        "Mutation": {
            "createUser": [
                9,
                {
                    "name": [
                        1,
                        "String!"
                    ]
                }
            ],
            "deleteAuthUser": [
                3,
                {
                    "id": [
                        4,
                        "ID!"
                    ]
                }
            ],
            "deleteUser": [
                9,
                {
                    "id": [
                        4,
                        "ID!"
                    ]
                }
            ],
            "login": [
                0,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "password": [
                        1,
                        "String!"
                    ]
                }
            ],
            "signup": [
                0,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "name": [
                        1,
                        "String!"
                    ],
                    "password": [
                        1,
                        "String!"
                    ]
                }
            ],
            "verifyEmail": [
                10,
                {
                    "token": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "Post": {
            "content": [
                1
            ],
            "id": [
                4
            ],
            "title": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Query": {
            "authUsers": [
                3
            ],
            "me": [
                3
            ],
            "post": [
                6,
                {
                    "id": [
                        4,
                        "ID!"
                    ]
                }
            ],
            "postCount": [
                8
            ],
            "posts": [
                6
            ],
            "user": [
                9,
                {
                    "id": [
                        4,
                        "ID!"
                    ]
                }
            ],
            "users": [
                9
            ],
            "__typename": [
                1
            ]
        },
        "Int": {},
        "User": {
            "id": [
                4
            ],
            "name": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "VerifyEmailResult": {
            "message": [
                1
            ],
            "success": [
                2
            ],
            "__typename": [
                1
            ]
        }
    }
}