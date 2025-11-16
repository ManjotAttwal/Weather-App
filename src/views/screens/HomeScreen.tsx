import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet, Button, SafeAreaView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useWeatherViewModel } from "../../viewmodels/useWeatherViewModel";
import { debounce } from "../../utils/debounce";
import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "react-native";

export default function HomeScreen() {
    const vm = useWeatherViewModel();
    const navigation = useNavigation<any>();
    const colorScheme = useColorScheme();
    const dark = colorScheme === "dark";

    // debounced setCity -> we keep immediate input but delay fetch
    const onSearchDebounced = useMemo(
        () => debounce((q: string) => vm.fetchWeather(q), 600),
        [vm]
    );

    return (
        <SafeAreaView style={[styles.container, dark ? styles.darkBg : styles.lightBg]}>
            <Text style={[styles.title, dark ? styles.darkText : styles.lightText]}>Weather — Search City</Text>

            <TextInput
                placeholder="Enter city (e.g., New Delhi)"
                placeholderTextColor={dark ? "#aaa" : "#666"}
                value={vm.city}
                onChangeText={(t) => {
                    vm.setCity(t);
                    onSearchDebounced(t);
                }}
                style={[styles.input, dark ? styles.darkInput : styles.lightInput]}
                returnKeyType="search"
                onSubmitEditing={() => vm.fetchWeather()}
            />

            <View style={styles.row}>
                <Button title="Search Now" onPress={() => vm.fetchWeather()} />
                <View style={{ width: 10 }} />
                <Button title="Use Last" onPress={() => {
                    if (vm.weather) navigation.navigate("Details", { city: vm.weather.city });
                    else vm.loadCached();
                }} />
            </View>

            {vm.loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}

            {vm.error && <Text style={[styles.error]}>{vm.error}</Text>}

            {vm.weather && (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Details", { city: vm.weather?.city })}
                    style={[styles.previewCard, dark ? styles.darkCard : styles.lightCard]}
                >
                    <Text style={[styles.city, dark ? styles.darkText : styles.lightText]}>{vm.weather.city}</Text>
                    <Text style={[styles.cond]}>{vm.weather.conditions}</Text>
                    <Text style={[styles.temp]}>{Math.round(vm.weather.tempC)}°C</Text>
                    {vm.isOfflineData && <Text style={styles.note}>Showing cached data · {new Date(vm.weather.fetchedAt).toLocaleString()}</Text>}
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, marginBottom: 12, fontWeight: "700" },
    input: { padding: 12, borderRadius: 8, fontSize: 16 },
    row: { flexDirection: "row", marginTop: 12 },
    previewCard: { marginTop: 20, padding: 12, borderRadius: 10 },
    city: { fontSize: 18, fontWeight: "700" },
    cond: { fontSize: 14, marginTop: 2 },
    temp: { fontSize: 28, fontWeight: "800", marginTop: 6 },
    note: { marginTop: 8, fontStyle: "italic", fontSize: 12 },
    error: { color: "red", marginTop: 12 },
    lightBg: { backgroundColor: "#f7f7f7" },
    darkBg: { backgroundColor: "#0e1116" },
    lightText: { color: "#111" },
    darkText: { color: "#eee" },
    lightInput: { backgroundColor: "#fff", borderColor: "#ddd", borderWidth: 1, marginBottom: 8 },
    darkInput: { backgroundColor: "#121318", borderColor: "#222", borderWidth: 1, color: "#fff", marginBottom: 8 },
    lightCard: { backgroundColor: "#fff", shadowColor: "#000", elevation: 2 },
    darkCard: { backgroundColor: "#1b1f26", shadowColor: "#000", elevation: 3 },
});
