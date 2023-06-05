const BASE_URL = "http://10.0.0.5:3001/api"

export async function createUser(userData) {
    try {
        const response = await fetch(`${BASE_URL}/user`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const user = await response.json();
        return user;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function login(userData) {
    try {
        const response = await fetch(`${BASE_URL}/user/login/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const user = await response.json();
        return user;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function getMemes(token) {
    try {
        const response = await fetch(`${BASE_URL}/meme`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
        });

        const memes = await response.json();
        return memes;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function createFavorite(favoriteData, token) {
    try {
        const response = await fetch(`${BASE_URL}/favorite/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(favoriteData),
        });

        const favorite = await response.json();
        return favorite;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function getUserFavorites(userId, token) {
    try {
        const response = await fetch(`${BASE_URL}/favorite/?userId=${userId}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
        });

        const favorites = await response.json();
        return favorites;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function deleteFavorite(favoriteId, token) {
    try {
        const response = await fetch(`${BASE_URL}/favorite/${favoriteId}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
        });

        const favorite = await response.json();
        return favorite;
    } catch (err) {
        console.log(err);
        return err;
    }
}