"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

import * as actions from "../services";

function LoginForm({ setUser }) {
  const [loginPayload, setLoginPayload] = useState({
    email: "",
    password: "",
  });

  const handleChangeLogin = (event) => {
    const { name, value } = event.target;
    setLoginPayload({ ...loginPayload, [name]: value });
  };

  const login = async () => {
    if (!loginPayload.email || !loginPayload.password)
      return alert("Preencha todos os campos");
    try {
      const user = await actions.login(loginPayload);

      if (user.error) return alert(user.error);

      localStorage.setItem("saveameme@user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      return alert("Erro ao fazer login: " + err.message);
    }
  };

  return (
    <>
      <input
        name="email"
        placeholder="E-mail"
        type="text"
        className={styles.input}
        value={loginPayload.email}
        onChange={handleChangeLogin}
      />
      <br />
      <input
        name="password"
        placeholder="Senha"
        type="text"
        className={styles.input}
        value={loginPayload.password}
        onChange={handleChangeLogin}
      />
      <br />
      <button className={styles.button} onClick={login}>
        Login
      </button>
    </>
  );
}

function Dashboard({ user, setUser }) {
  const [memes, setMemes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const memes = await actions.getMemes(user.token);

      if (memes.error) return alert(memes.error);

      const favorites = await actions.getUserFavorites(user.id, user.token);

      if (favorites.error) return alert(favorites.error);

      setUserFavorites(favorites);
      const externalIds = favorites.map((favorite) => favorite.memeId);
      const filteredMemes = memes.filter(
        (meme) => !externalIds.includes(meme.externalId)
      );
      const favoriteMemes = memes.filter((meme) =>
        externalIds.includes(meme.externalId)
      );

      setMemes(filteredMemes);
      setFavorites(favoriteMemes);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return alert("Erro ao buscar memes: " + err.message);
    }
  };

  const favoriteMeme = async (externalId) => {
    try {
      setLoading(true);
      const favorite = await actions.createFavorite(
        { memeExternalId: externalId, userId: user.id },
        user.token
      );
      if (favorite.error) return alert(favorite.error);
      await getData();
    } catch (err) {
      setLoading(false);
      return alert("Erro ao favoritar meme: " + err.message);
    }
  };

  const unfavoriteMeme = async (externalId) => {
    try {
      setLoading(true);
      const favorite = userFavorites.find(
        (favorite) => favorite.memeId === externalId
      );
      const unfavorite = await actions.deleteFavorite(favorite.id, user.token);
      if (unfavorite.error) return alert(unfavorite.error);
      await getData();
    } catch (err) {
      setLoading(false);
      return alert("Erro ao desfavoritar meme: " + err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("saveameme@user");
    setUser(null);
  };

  const handleChangeTab = () => {
    if (tab === 0) setTab(1);
    else setTab(0);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <header className={styles.dashboardHeader}>
        <p className={styles.text}>Bem vindo, {user.username}</p>
        <div>
          <button className={styles.button} onClick={handleChangeTab}>
            {tab === 0 ? "Favoritos" : "Memes"}
          </button>
          <button className={styles.button} onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <div className={styles.memes}>
        {tab === 0
          ? memes.map((meme) => (
              <div key={meme.id} className={styles.meme}>
                <img src={meme.url} alt={meme.name} />
                <p className={styles.text}>{meme.name}</p>
                <button
                  className={styles.button}
                  onClick={() => favoriteMeme(meme.externalId)}
                  disabled={loading}
                >
                  Favoritar
                </button>
              </div>
            ))
          : favorites.map((meme) => (
              <div key={meme.id} className={styles.meme}>
                <img src={meme.url} alt={meme.name} />
                <p className={styles.text}>{meme.name}</p>
                <button
                  className={styles.button}
                  onClick={() => unfavoriteMeme(meme.externalId)}
                  disabled={loading}
                >
                  Desfavoritar
                </button>
              </div>
            ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("saveameme@user");
    if (user) {
      setUser(JSON.parse(user));
    }
    
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className={styles.main}>
      <p className={styles.header}>{user ? "Save a Meme" : "Login"}</p>
      {user ? (
        <Dashboard user={user} setUser={setUser} />
      ) : (
        <LoginForm setUser={setUser} />
      )}
    </main>
  );
}
