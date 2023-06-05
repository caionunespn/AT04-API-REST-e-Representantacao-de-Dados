import { useEffect, useState } from "react";
import {
    View,
    Image, 
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    FlatList,
} from "react-native";

import * as actions from "./services";

function LoginForm({ setUser }) {
  const [loginPayload, setLoginPayload] = useState({
    email: "",
    password: "",
  });

  const handleChangeLogin = (name, value) => {
    setLoginPayload({ ...loginPayload, [name]: value });
  };

  const login = async () => {
    if (!loginPayload.email || !loginPayload.password)
      return Alert.alert("Preencha todos os campos");
    try {
      const user = await actions.login(loginPayload);

      if (user.error) return Alert.alert(user.error);
      // localStorage.setItem("saveameme@user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      return Alert.alert("Erro ao fazer login: " + err.message);
    }
  };

  return (
    <>
      <TextInput
        name="email"
        placeholder="E-mail"
        style={styles.input}
        value={loginPayload.email}
        onChangeText={(value) => handleChangeLogin("email", value)}
      />
      <TextInput
        name="password"
        placeholder="Senha"
        secureTextEntry={true}
        style={styles.input}
        value={loginPayload.password}
        onChangeText={(value) => handleChangeLogin("password", value)}
      />
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
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

      if (memes.error) return Alert.alert(memes.error);

      const favorites = await actions.getUserFavorites(user.id, user.token);

      if (favorites.error) return Alert.alert(favorites.error);

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
      return Alert.alert("Erro ao buscar memes: " + err.message);
    }
  };

  const favoriteMeme = async (externalId) => {
    try {
      setLoading(true);
      console.log(user);
      const favorite = await actions.createFavorite(
        { memeExternalId: externalId, userId: user.id },
        user.token
      );
      if (favorite.error) return Alert.alert(favorite.error);
      await getData();
    } catch (err) {
      setLoading(false);
      return Alert.alert("Erro ao favoritar meme: " + err.message);
    }
  };

  const unfavoriteMeme = async (externalId) => {
    try {
      setLoading(true);
      const favorite = userFavorites.find(
        (favorite) => favorite.memeId === externalId
      );
      const unfavorite = await actions.deleteFavorite(favorite.id, user.token);
      if (unfavorite.error) return Alert.alert(unfavorite.error);
      await getData();
    } catch (err) {
      setLoading(false);
      return Alert.alert("Erro ao desfavoritar meme: " + err.message);
    }
  };

  const logout = () => {
    // localStorage.removeItem("saveameme@user");
    setUser(null);
  };

  const handleChangeTab = () => {
    if (tab === 0) setTab(1);
    else setTab(0);
  };

  if (loading) return <Text style={styles.text}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.dashboardHeader}>
        <Text style={styles.textHeader}>Bem vindo, {user.username}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.dashboardHeaderButton} onPress={handleChangeTab}>
            <Text style={styles.buttonText}>{tab === 0 ? "Favoritos" : "Memes"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dashboardHeaderButton} onPress={logout}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
          data={tab === 0 ? memes : favorites}
          contentContainerStyle={styles.memes}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View
              key={item.id}
              style={
                index === (tab === 0 ? memes : favorites).length - 1
                  ? [styles.meme, styles.lastMeme]
                  : styles.meme
              }
            >
              <Image
                style={styles.image}
                source={{
                  uri: item.url,
                }}
                alt={item.name}
              />
              <Text style={styles.text}>{item.name}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  tab === 0
                    ? favoriteMeme(item.externalId)
                    : unfavoriteMeme(item.externalId)
                }
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {tab === 0 ? "Favoritar" : "Desfavoritar"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
    </View>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const user = localStorage.getItem("saveameme@user");
    // if (user) {
    //   setUser(JSON.parse(user));
    // }
    
    setLoading(false);
  }, []);

  if (loading) return <Text style={styles.text}>Loading...</Text>;

  return (
    <View style={styles.main}>
      <Text style={styles.header}>{user ? "Save a Meme" : "Login"}</Text>
      {user ? (
        <Dashboard user={user} setUser={setUser} />
      ) : (
        <LoginForm setUser={setUser} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#282c34",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 64,
    marginBottom: 16,
    color: "white",
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "purple",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#282c34",
    padding: 16,
  },
  dashboardHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
    padding: 16,
  },
  memes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  meme: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  lastMeme: {
    marginBottom: 64,
  },
  text: {
    color: "white",
    marginBottom: 16,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
  },
  image2: {
    width: 300,
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
  },
  textHeader: {
    color: "white",
    marginBottom: 4,
    fontSize: 20,
    fontWeight: "bold",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  dashboardHeaderButton: {
    width: "48%",
    height: 40,
    backgroundColor: "purple",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});