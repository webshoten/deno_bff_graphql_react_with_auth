/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    String: string,
    ID: string,
    Int: number,
    Boolean: boolean,
}

export interface Mutation {
    createUser: (User | null)
    deleteUser: (User | null)
    __typename: 'Mutation'
}

export interface Post {
    content: (Scalars['String'] | null)
    id: (Scalars['ID'] | null)
    title: (Scalars['String'] | null)
    __typename: 'Post'
}

export interface Query {
    me: (Scalars['String'] | null)
    post: (Post | null)
    postCount: (Scalars['Int'] | null)
    posts: (Post[] | null)
    test: (Scalars['String'] | null)
    user: (User | null)
    users: (User[] | null)
    words: (Word[] | null)
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

export interface MutationGenqlSelection{
    createUser?: (UserGenqlSelection & { __args: {name: Scalars['String']} })
    deleteUser?: (UserGenqlSelection & { __args: {id: Scalars['ID']} })
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
    me?: boolean | number
    post?: (PostGenqlSelection & { __args: {id: Scalars['ID']} })
    postCount?: boolean | number
    posts?: PostGenqlSelection
    test?: boolean | number
    user?: (UserGenqlSelection & { __args: {id: Scalars['ID']} })
    users?: UserGenqlSelection
    words?: WordGenqlSelection
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
    