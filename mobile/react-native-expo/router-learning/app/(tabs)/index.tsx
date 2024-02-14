import { FlatList, StyleSheet } from "react-native";

import { Text, View } from "../../components/Themed";
import { useState } from "react";

type Article = { title: string };
async function getArticles(): Promise<Article[]> {
  const todo = await fetch("https://jsonplaceholder.typicode.com/posts");
  return todo.json();
}

function Article({ title }: { title: string }) {
  return (
    <View
      style={[
        {
          backgroundColor: "white",
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
          borderColor: "#F8FAFC",
          borderStyle: "solid",
          borderWidth: 1,
        },
        styles.shadowProp,
      ]}
    >
      <Text style={{ color: "#475569", fontWeight: "600" }}>{title}</Text>
    </View>
  );
}

export default function NewsScreen() {
  const [news, setNews] = useState<Article[]>([]);
  getArticles().then((news) => setNews(news));

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        renderItem={({ item }) => <Article title={item.title} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F8FAFC",
    paddingTop: 20,
  },
  shadowProp: {
    shadowColor: "#64748B",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 4,

    elevation: 3,
  },
});
