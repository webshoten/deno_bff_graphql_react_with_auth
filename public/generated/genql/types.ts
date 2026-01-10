// Generated at: 2026-01-10T08:22:34.660Z
export default {
    "scalars": [
        1,
        2,
        3,
        5,
        7
    ],
    "types": {
        "DebugResult": {
            "count": [
                1
            ],
            "message": [
                2
            ],
            "success": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "Int": {},
        "String": {},
        "Boolean": {},
        "LearningHistory": {
            "id": [
                5
            ],
            "learningType": [
                2
            ],
            "userId": [
                5
            ],
            "wordId": [
                5
            ],
            "__typename": [
                2
            ]
        },
        "ID": {},
        "LearningHistoryDetail": {
            "id": [
                5
            ],
            "learningType": [
                2
            ],
            "userId": [
                5
            ],
            "wordEnglish": [
                2
            ],
            "wordId": [
                5
            ],
            "wordJapanese": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "LearningType": {},
        "Mutation": {
            "createLearningHistory": [
                4,
                {
                    "learningType": [
                        7,
                        "LearningType!"
                    ],
                    "userId": [
                        5,
                        "ID!"
                    ],
                    "wordId": [
                        5,
                        "ID!"
                    ]
                }
            ],
            "createUser": [
                11,
                {
                    "name": [
                        2,
                        "String!"
                    ]
                }
            ],
            "deleteUser": [
                11,
                {
                    "id": [
                        5,
                        "ID!"
                    ]
                }
            ],
            "resetLearningHistory": [
                0,
                {
                    "userId": [
                        5
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
                5
            ],
            "title": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Query": {
            "learningHistoryCount": [
                1,
                {
                    "userId": [
                        5
                    ]
                }
            ],
            "learningHistoryList": [
                6,
                {
                    "limit": [
                        1
                    ],
                    "userId": [
                        5
                    ]
                }
            ],
            "me": [
                2
            ],
            "post": [
                9,
                {
                    "id": [
                        5,
                        "ID!"
                    ]
                }
            ],
            "postCount": [
                1
            ],
            "posts": [
                9
            ],
            "test10": [
                2
            ],
            "user": [
                11,
                {
                    "id": [
                        5,
                        "ID!"
                    ]
                }
            ],
            "users": [
                11
            ],
            "words": [
                12
            ],
            "wordsByDifficulty": [
                12,
                {
                    "difficulty": [
                        1,
                        "Int!"
                    ]
                }
            ],
            "wordsForStudy": [
                12,
                {
                    "limit": [
                        1
                    ],
                    "userId": [
                        5,
                        "ID!"
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "User": {
            "id": [
                5
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
                1
            ],
            "english": [
                2
            ],
            "frequency": [
                1
            ],
            "id": [
                5
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
        }
    }
}