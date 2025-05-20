"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../../constants/Colors"
import Dropdown from "../../components/Dropdown"

/**
 * @component ExercisesScreen
 * @description Pantalla que muestra los ejercicios de clase del estudiante
 * @returns {JSX.Element} Componente de pantalla de ejercicios
 */
export default function ExercisesScreen() {
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState("All months")

  // Datos de ejemplo para los ejercicios
  const exercisesData = [
    { date: "02/03/2025", title: "Exercise 10", score: "10/10" },
    { date: "25/02/2025", title: "Exercise 9", score: "10/10" },
    { date: "01/02/2025", title: "Exercise 8", score: "9.5/10" },
    { date: "25/01/2025", title: "Exercise 7", score: "9/10" },
    { date: "20/01/2025", title: "Exercise 6", score: "8.5/10" },
  ]

  // Opciones para el selector de meses
  const monthOptions = ["All months", "January", "February", "March", "April"]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.title}>Class exercises</Text>
      </View>

      <Dropdown value={selectedMonth} options={monthOptions} onSelect={setSelectedMonth} />

      <ScrollView style={styles.content}>
        <View style={styles.tableHeader}>
          <View style={[styles.headerCell, styles.dateColumn]}>
            <Text style={styles.headerText}>Date</Text>
          </View>
          <View style={[styles.headerCell, styles.titleColumn]}>
            <Text style={styles.headerText}>Title</Text>
          </View>
          <View style={[styles.headerCell, styles.scoreColumn]}>
            <Text style={styles.headerText}>Scores</Text>
          </View>
        </View>

        {exercisesData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, styles.dateColumn]}>
              <Text style={styles.cellText}>{item.date}</Text>
            </View>
            <View style={[styles.cell, styles.titleColumn]}>
              <Text style={styles.cellText}>{item.title}</Text>
            </View>
            <View style={[styles.cell, styles.scoreColumn]}>
              <Text style={styles.cellText}>{item.score}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    marginBottom: 5,
  },
  headerCell: {
    backgroundColor: Colors.yellowButton,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 2,
    alignItems: "center",
  },
  dateColumn: {
    flex: 0.8,
  },
  titleColumn: {
    flex: 1.2,
  },
  scoreColumn: {
    flex: 0.5,
  },
  headerText: {
    fontWeight: "bold",
    color: Colors.text,
  },
  tableRow: {
    flexDirection: "row",
    marginVertical: 3,
  },
  cell: {
    backgroundColor: Colors.babyBlue,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 2,
    alignItems: "center",
  },
  cellText: {
    color: Colors.text,
  },
})
