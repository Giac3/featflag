export const makeGetRequest = async (url: string) => {
    try {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        return data
    } catch (error) {
        return null
    }
}