"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../../constants/Colors"
import Dropdown from "../../components/Dropdown"

/**
 * @component ExamsScreen
 * @description Pantalla que muestra los exámenes del estudiante
 * @returns {JSX.Element} Componente de pantalla de exámenes
 */
export default function ExamsScreen() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("All periods")

  // Datos de ejemplo para los exámenes
  const examsData = [
    { date: "02/03/2025", title: "Third midterm", score: "9/10" },
    { date: "25/02/2025", title: "Second midterm", score: "-" },
    { date: "01/02/2025", title: "First midterm", score: "-" },
    { date: "15/01/2025", title: "Diagnostic test", score: "8.5/10" },
  ]

  // Opciones para el selector de períodos
  const periodOptions = ["All periods", "First period", "Second period", "Third period"]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.title}>Exams</Text>
      </View>

      <Dropdown value={selectedPeriod} options={periodOptions} onSelect={setSelectedPeriod} />

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

        {examsData.map((item, index) => (
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
