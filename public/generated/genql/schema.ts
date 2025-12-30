/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    String: string,
    Boolean: boolean,
    ID: string,
    Int: number,
}

export interface AuthResult {
    message: (Scalars['String'] | null)
    success: (Scalars['Boolean'] | null)
    user: (AuthUser | null)
    __typename: 'AuthResult'
}

export interface AuthUser {
    createdAt: (Scalars['String'] | null)
    email: (Scalars['String'] | null)
    emailVerified: (Scalars['Boolean'] | null)
    id: (Scalars['ID'] | null)
    name: (Scalars['String'] | null)
    __typename: 'AuthUser'
}

export interface Mutation {
    createUser: (User | null)
    deleteAuthUser: (AuthUser | null)
    deleteUser: (User | null)
    login: (AuthResult | null)
    signup: (AuthResult | null)
    verifyEmail: (VerifyEmailResult | null)
    __typename: 'Mutation'
}

export interface Post {
    content: (Scalars['String'] | null)
    id: (Scalars['ID'] | null)
    title: (Scalars['String'] | null)
    __typename: 'Post'
}

export interface Query {
    authUsers: (AuthUser[] | null)
    me: (AuthUser | null)
    post: (Post | null)
    postCount: (Scalars['Int'] | null)
    posts: (Post[] | null)
    user: (User | null)
    users: (User[] | null)
    __typename: 'Query'
}

export interface User {
    id: (Scalars['ID'] | null)
    name: (Scalars['String'] | null)
    __typename: 'User'
}

export interface VerifyEmailResult {
    message: (Scalars['String'] | null)
    success: (Scalars['Boolean'] | null)
    __typename: 'VerifyEmailResult'
}

export interface AuthResultGenqlSelection{
    message?: boolean | number
    success?: boolean | number
    user?: AuthUserGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AuthUserGenqlSelection{
    createdAt?: boolean | number
    email?: boolean | number
    emailVerified?: boolean | number
    id?: boolean | number
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationGenqlSelection{
    createUser?: (UserGenqlSelection & { __args: {name: Scalars['String']} })
    deleteAuthUser?: (AuthUserGenqlSelection & { __args: {id: Scalars['ID']} })
    deleteUser?: (UserGenqlSelection & { __args: {id: Scalars['ID']} })
    login?: (AuthResultGenqlSelection & { __args: {email: Scalars['String'], password: Scalars['String']} })
    signup?: (AuthResultGenqlSelection & { __args: {email: Scalars['String'], name: Scalars['String'], password: Scalars['String']} })
    verifyEmail?: (VerifyEmailResultGenqlSelection & { __args: {token: Scalars['String']} })
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
    authUsers?: AuthUserGenqlSelection
    me?: AuthUserGenqlSelection
    post?: (PostGenqlSelection & { __args: {id: Scalars['ID']} })
    postCount?: boolean | number
    posts?: PostGenqlSelection
    user?: (UserGenqlSelection & { __args: {id: Scalars['ID']} })
    users?: UserGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserGenqlSelection{
    id?: boolean | number
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface VerifyEmailResultGenqlSelection{
    message?: boolean | number
    success?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const AuthResult_possibleTypes: string[] = ['AuthResult']
    export const isAuthResult = (obj?: { __typename?: any } | null): obj is AuthResult => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAuthResult"')
      return AuthResult_possibleTypes.includes(obj.__typename)
    }
    


    const AuthUser_possibleTypes: string[] = ['AuthUser']
    export const isAuthUser = (obj?: { __typename?: any } | null): obj is AuthUser => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAuthUser"')
      return AuthUser_possibleTypes.includes(obj.__typename)
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
    


    const VerifyEmailResult_possibleTypes: string[] = ['VerifyEmailResult']
    export const isVerifyEmailResult = (obj?: { __typename?: any } | null): obj is VerifyEmailResult => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isVerifyEmailResult"')
      return VerifyEmailResult_possibleTypes.includes(obj.__typename)
    }
    