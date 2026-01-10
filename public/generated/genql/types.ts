// Generated at: 2026-01-10T07:55:44.611Z
export default {
    "scalars": [
        1,
        2,
        3,
        7,
        10
    ],
    "types": {
        "LearningHistory": {
            "id": [
                1
            ],
            "learningType": [
                2
            ],
            "userId": [
                1
            ],
            "wordId": [
                1
            ],
            "__typename": [
                2
            ]
        },
        "ID": {},
        "String": {},
        "LearningType": {},
        "Mutation": {
            "createLearningHistory": [
                0,
                {
                    "learningType": [
                        3,
                        "LearningType!"
                    ],
                    "userId": [
                        1,
                        "ID!"
                    ],
                    "wordId": [
                        1,
                        "ID!"
                    ]
                }
            ],
            "createUser": [
                8,
                {
                    "name": [
                        2,
                        "String!"
                    ]
                }
            ],
            "deleteUser": [
                8,
                {
                    "id": [
                        1,
                        "ID!"
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "Post": {
            "content": [
                2
            ],
            "id": [
                1
            ],
            "title": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Query": {
            "me": [
                2
            ],
            "post": [
                5,
                {
                    "id": [
                        1,
                        "ID!"
                    ]
                }
            ],
            "postCount": [
                7
            ],
            "posts": [
                5
            ],
            "test10": [
                2
            ],
            "user": [
                8,
                {
                    "id": [
                        1,
                        "ID!"
                    ]
                }
            ],
            "users": [
                8
            ],
            "words": [
                9
            ],
            "wordsByDifficulty": [
                9,
                {
                    "difficulty": [
                        7,
                        "Int!"
                    ]
                }
            ],
            "wordsForStudy": [
                9,
                {
                    "limit": [
                        7
                    ],
                    "userId": [
                        1,
                        "ID!"
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "Int": {},
        "User": {
            "id": [
                1
            ],
            "name": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Word": {
            "difficulty": [
                7
            ],
            "english": [
                2
            ],
            "frequency": [
                7
            ],
            "id": [
                1
            ],
            "japanese": [
                2
            ],
            "situation": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Boolean": {}
    }
}