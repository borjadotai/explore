import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, Tabs } from "expo-router";
import { Image, StyleSheet, View, useColorScheme, Text } from "react-native";

import Colors from "../../constants/Colors";
import { useTheme } from "@react-navigation/native";
import dayjs from "dayjs";

const genGreeting = () => {
  const hrs = dayjs().get("hours");
  if (hrs < 12) return "Morning";
  else if (hrs >= 12 && hrs <= 17) return "Afternoon";
  else if (hrs >= 17 && hrs <= 24) return "Evening";
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) {
  return <Feather size={28} style={{ marginBottom: -3 }} {...props} />;
}

function ProfileIcon() {
  return (
    <Image
      style={styles.picture}
      source={{
        uri: "https://ga-core.s3.amazonaws.com/production/uploads/instructor/image/26397/Borja_Leiva_-_Profile.jpg",
      }}
    />
  );
}

function Header() {
  const { colors } = useTheme();
  const date = dayjs().format("dddd, MMMM DD");
  const greeting = genGreeting();

  return (
    <View
      style={{
        paddingTop: 70,
        paddingHorizontal: 20,
        backgroundColor: colors.background,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text style={{ fontWeight: "500", fontSize: 24, color: "#25262A" }}>
          {greeting}, Jason
        </Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 16,
            color: "#64748B",
            marginTop: 6,
          }}
        >
          {date}
        </Text>
      </View>
      <View
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Text style={{ color: "#64748B", fontSize: 16, fontWeight: "500" }}>
          Today
        </Text>
        <Entypo
          size={24}
          style={{ marginBottom: -3, color: "#64748B" }}
          name="chevron-small-down"
        />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: "white",
          height: 82,
          paddingTop: 10,
          borderColor: "#F1F5F9",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "News",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="book-open" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
          tabBarIcon: ({ color }) => <ProfileIcon />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  picture: {
    width: 24,
    height: 24,
    borderRadius: 50,
  },
});
