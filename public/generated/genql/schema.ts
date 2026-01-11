// Generated at: 2026-01-11T01:18:09.895Z
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Int: number,
    String: string,
    Boolean: boolean,
    ID: string,
}

export interface DebugResult {
    count: (Scalars['Int'] | null)
    message: (Scalars['String'] | null)
    success: (Scalars['Boolean'] | null)
    __typename: 'DebugResult'
}

export interface LearningHistory {
    id: (Scalars['ID'] | null)
    learningType: (Scalars['String'] | null)
    userId: (Scalars['ID'] | null)
    wordId: (Scalars['ID'] | null)
    __typename: 'LearningHistory'
}

export interface LearningHistoryDetail {
    id: (Scalars['ID'] | null)
    learningType: (Scalars['String'] | null)
    userId: (Scalars['ID'] | null)
    wordEnglish: (Scalars['String'][] | null)
    wordId: (Scalars['ID'] | null)
    wordJapanese: (Scalars['String'] | null)
    __typename: 'LearningHistoryDetail'
}

export type LearningType = 'choiceTest' | 'passiveLearning' | 'writingTest'

export interface Mutation {
    createLearningHistory: (LearningHistory[] | null)
    createUser: (User | null)
    deleteUser: (User | null)
    resetLearningHistory: (DebugResult | null)
    __typename: 'Mutation'
}

export interface Post {
    content: (Scalars['String'] | null)
    id: (Scalars['ID'] | null)
    title: (Scalars['String'] | null)
    __typename: 'Post'
}

export interface Query {
    learningHistoryCount: (Scalars['Int'] | null)
    learningHistoryList: (LearningHistoryDetail[] | null)
    me: (Scalars['String'] | null)
    post: (Post | null)
    postCount: (Scalars['Int'] | null)
    posts: (Post[] | null)
    test10: (Scalars['String'] | null)
    user: (User | null)
    users: (User[] | null)
    words: (Word[] | null)
    wordsByDifficulty: (Word[] | null)
    wordsForStudy: (Word[] | null)
    __typename: 'Query'
}

export interface User {
    id: (Scalars['ID'] | null)
    name: (Scalars['String'] | null)
    __typename: 'User'
}

export interface Word {
    difficulty: (Scalars['Int'] | null)
    english: (Scalars['String'][] | null)
    frequency: (Scalars['Int'] | null)
    id: (Scalars['ID'] | null)
    japanese: (Scalars['String'] | null)
    situation: (Scalars['String'] | null)
    __typename: 'Word'
}

export interface DebugResultGenqlSelection{
    count?: boolean | number
    message?: boolean | number
    success?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface LearningHistoryGenqlSelection{
    id?: boolean | number
    learningType?: boolean | number
    userId?: boolean | number
    wordId?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface LearningHistoryDetailGenqlSelection{
    id?: boolean | number
    learningType?: boolean | number
    userId?: boolean | number
    wordEnglish?: boolean | number
    wordId?: boolean | number
    wordJapanese?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationGenqlSelection{
    createLearningHistory?: (LearningHistoryGenqlSelection & { __args: {learningType: LearningType, userId: Scalars['ID'], wordId: Scalars['ID']} })
    createUser?: (UserGenqlSelection & { __args: {name: Scalars['String']} })
    deleteUser?: (UserGenqlSelection & { __args: {id: Scalars['ID']} })
    resetLearningHistory?: (DebugResultGenqlSelection & { __args?: {userId?: (Scalars['ID'] | null)} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostGenqlSelection{
    content?: boolean | number
    id?: boolean | number
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryGenqlSelection{
    learningHistoryCount?: { __args: {userId?: (Scalars['ID'] | null)} } | boolean | number
    learningHistoryList?: (LearningHistoryDetailGenqlSelection & { __args?: {limit?: (Scalars['Int'] | null), userId?: (Scalars['ID'] | null)} })
    me?: boolean | number
    post?: (PostGenqlSelection & { __args: {id: Scalars['ID']} })
    postCount?: boolean | number
    posts?: PostGenqlSelection
    test10?: boolean | number
    user?: (UserGenqlSelection & { __args: {id: Scalars['ID']} })
    users?: UserGenqlSelection
    words?: WordGenqlSelection
    wordsByDifficulty?: (WordGenqlSelection & { __args: {difficulty: Scalars['Int']} })
    wordsForStudy?: (WordGenqlSelection & { __args: {limit?: (Scalars['Int'] | null), userId: Scalars['ID']} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserGenqlSelection{
    id?: boolean | number
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface WordGenqlSelection{
    difficulty?: boolean | number
    english?: boolean | number
    frequency?: boolean | number
    id?: boolean | number
    japanese?: boolean | number
    situation?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const DebugResult_possibleTypes: string[] = ['DebugResult']
    export const isDebugResult = (obj?: { __typename?: any } | null): obj is DebugResult => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDebugResult"')
      return DebugResult_possibleTypes.includes(obj.__typename)
    }
    


    const LearningHistory_possibleTypes: string[] = ['LearningHistory']
    export const isLearningHistory = (obj?: { __typename?: any } | null): obj is LearningHistory => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isLearningHistory"')
      return LearningHistory_possibleTypes.includes(obj.__typename)
    }
    


    const LearningHistoryDetail_possibleTypes: string[] = ['LearningHistoryDetail']
    export const isLearningHistoryDetail = (obj?: { __typename?: any } | null): obj is LearningHistoryDetail => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isLearningHistoryDetail"')
      return LearningHistoryDetail_possibleTypes.includes(obj.__typename)
    }
    


    const Mutation_possibleTypes: string[] = ['Mutation']
    export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
      return Mutation_possibleTypes.includes(obj.__typename)
    }
    


    const Post_possibleTypes: string[] = ['Post']
    export const isPost = (obj?: { __typename?: any } | null): obj is Post => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPost"')
      return Post_possibleTypes.includes(obj.__typename)
    }
    


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    


    const User_possibleTypes: string[] = ['User']
    export const isUser = (obj?: { __typename?: any } | null): obj is User => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUser"')
      return User_possibleTypes.includes(obj.__typename)
    }
    


    const Word_possibleTypes: string[] = ['Word']
    export const isWord = (obj?: { __typename?: any } | null): obj is Word => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWord"')
      return Word_possibleTypes.includes(obj.__typename)
    }
    

export const enumLearningType = {
   choiceTest: 'choiceTest' as const,
   passiveLearning: 'passiveLearning' as const,
   writingTest: 'writingTest' as const
}
