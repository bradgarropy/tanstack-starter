// app/routes/index.tsx
import {createFileRoute, useRouter} from "@tanstack/react-router"
import {createServerFn} from "@tanstack/start"

import type {User} from "../utils/users"
import {
    createUser,
    deleteUser,
    getUsers,
    updateUser,
} from "../utils/users"

const loadUsersFn = createServerFn({
    method: "GET",
}).handler(() => {
    const users = getUsers()
    return users
})

const deleteUserFn = createServerFn({method: "POST"})
    .validator((email: User["email"]) => {
        return {email}
    })
    .handler(async ctx => {
        await new Promise(resolve => setTimeout(resolve, 3000))
        return deleteUser(ctx.data.email)
    })

const createUserFn = createServerFn({method: "POST"})
    .validator((user: User) => {
        return {user}
    })
    .handler(async ctx => {
        return createUser(ctx.data.user)
    })

const updateUserFn = createServerFn({method: "POST"})
    .validator(
        ({email, updates}: {email: User["email"]; updates: Partial<User>}) => {
            return {
                email,
                updates,
            }
        },
    )
    .handler(async ctx => {
        updateUser(ctx.data.email, ctx.data.updates)
    })

export const Route = createFileRoute("/")({
    component: Home,
    loader: async () => {
        const users = await loadUsersFn()
        return {users}
    },
    pendingComponent: () => <p>loading</p>,
})

function Home() {
    const router = useRouter()
    const {users} = Route.useLoaderData()
    console.log(router)

    return (
        <>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, auto)",
                    gap: "0.5rem",
                }}
            >
                <button
                    type="button"
                    onClick={async () => {
                        await createUserFn({
                            data: {
                                email: "bradgarropy@gmail.com",
                                firstName: "Brad",
                                lastName: "Garropy",
                            },
                        })

                        router.invalidate()
                    }}
                >
                    Add Brad
                </button>

                <button
                    type="button"
                    onClick={async () => {
                        await updateUserFn({
                            data: {
                                email: "bradgarropy@gmail.com",
                                updates: {
                                    firstName: "Bradley",
                                },
                            },
                        })

                        router.invalidate()
                    }}
                >
                    Update Bradley
                </button>

                <button
                    type="button"
                    onClick={async () => {
                        await deleteUserFn({data: "bradgarropy@gmail.com"})
                        router.invalidate()
                    }}
                >
                    Delete Brad
                </button>

                <button
                    type="button"
                    onClick={async () => {
                        await createUserFn({
                            data: {
                                email: "gabygarropy@gmail.com",
                                firstName: "Gaby",
                                lastName: "Garropy",
                            },
                        })

                        router.invalidate()
                    }}
                >
                    Add Gaby
                </button>

                <button
                    type="button"
                    onClick={async () => {
                        await updateUserFn({
                            data: {
                                email: "gabygarropy@gmail.com",
                                updates: {
                                    firstName: "Gabriela",
                                },
                            },
                        })

                        router.invalidate()
                    }}
                >
                    Update Gabriela
                </button>

                <button
                    type="button"
                    onClick={async () => {
                        await deleteUserFn({data: "gabygarropy@gmail.com"})
                        router.invalidate()
                    }}
                >
                    Delete Gaby
                </button>
            </div>

            <pre>{JSON.stringify(users, null, 2)}</pre>
        </>
    )
}
