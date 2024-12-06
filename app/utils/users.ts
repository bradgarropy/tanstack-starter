import fs from "node:fs/promises"

type User = {
    firstName: string
    lastName: string
    email: string
}

const USERS_PATH = "users.txt"

const createUser = async (user: User) => {
    const users = await getUsers()
    const newUsers = [...users, user]
    await fs.writeFile(USERS_PATH, JSON.stringify(newUsers))
    return
}

const updateUser = async (email: User["email"], userUpdates: Partial<User>) => {
    const users = await getUsers()
    const index = users.findIndex(user => user.email === email)
    const user = users[index]
    const updatedUser = {...user, ...userUpdates}
    users[index] = updatedUser
    await fs.writeFile(USERS_PATH, JSON.stringify(users))
}

const deleteUser = async (email: User["email"]) => {
    const users = await getUsers()
    const newUsers = users.filter(user => user.email !== email)
    await fs.writeFile(USERS_PATH, JSON.stringify(newUsers))
}

const getUser = async (email: string) => {
    const users = await getUsers()
    const user = users.find(user => user.email === email) ?? null
    return user
}

const getUsers = async () => {
    const contents = await fs.readFile(USERS_PATH, "utf-8")
    const users = JSON.parse(contents) as User[]
    return users
}

export {createUser, deleteUser, getUser, getUsers, updateUser}
export type {User}
