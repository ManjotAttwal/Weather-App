import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Button, useColorScheme } from "react-native";
import { useWeatherViewModel } from "../../viewmodels/useWeatherViewModel";
import { RouteProp, useRoute } from "@react-navigation/native";

type ParamList = {
    Details: {
        city: string;
    };
};

export default function DetailsScreen() {
    const route = useRoute<RouteProp<ParamList, "Details">>();
    const vm = useWeatherViewModel();
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const dark = colorScheme === "dark";
    const cityFromParams = route.params?.city;

    // If we have params, fetch that city once
    React.useEffect(() => {
        if (cityFromParams) vm.fetchWeather(cityFromParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cityFromParams]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await vm.refresh();
        setRefreshing(false);
    }, [vm]);

    const w = vm.weather;

    return (
        <SafeAreaView style={[styles.container, dark ? styles.darkBg : styles.lightBg]}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <Text style={[styles.title, dark ? styles.darkText : styles.lightText]}>Weather Details</Text>

                {!w && <Text style={styles.note}>No data yet. Try searching a city on the previous screen.</Text>}

                {w && (
                    <View style={[styles.card, dark ? styles.darkCard : styles.lightCard]}>
                        <Text style={[styles.city, dark ? styles.darkText : styles.lightText]}>{w.city}</Text>
                        <Text style={styles.cond}>{w.conditions}</Text>

                        <View style={styles.row}>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Temp</Text>
                                <Text style={styles.statValue}>{Math.round(w.tempC)}°C</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Humidity</Text>
                                <Text style={styles.statValue}>{w.humidity}%</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Wind</Text>
                                <Text style={styles.statValue}>{w.windSpeed} m/s</Text>
                            </View>
                        </View>

                        <Text style={styles.fetched}>Fetched: {new Date(w.fetchedAt).toLocaleString()}</Text>
                        {vm.isOfflineData && <Text style={styles.note}>This data is cached (offline)</Text>}

                        <View style={{ marginTop: 12 }}>
                            <Button title="Refresh" onPress={() => vm.fetchWeather(w.city)} />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
    card: { padding: 12, borderRadius: 10 },
    city: { fontSize: 22, fontWeight: "800" },
    cond: { marginTop: 4, fontSize: 16 },
    row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    stat: { flex: 1, alignItems: "center" },
    statLabel: { fontSize: 12, color: "#666" },
    statValue: { fontSize: 18, fontWeight: "700" },
    fetched: { marginTop: 10, fontSize: 12, color: "#666" },
    note: { fontSize: 13, marginTop: 8, color: "#999" },
    lightBg: { backgroundColor: "#f7f7f7" },
    darkBg: { backgroundColor: "#0b0d10" },
    lightCard: { backgroundColor: "#fff" },
    darkCard: { backgroundColor: "#13161b" },
    darkText: { color: "#eee" },
    lightText: { color: "#111" },
});
