"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../../constants/Colors"
import Dropdown from "../../components/Dropdown"

/**
 * @component HomeworkScreen
 * @description Pantalla que muestra las tareas del estudiante
 * @returns {JSX.Element} Componente de pantalla de tareas
 */
export default function HomeworkScreen() {
  const router = useRouter()
  const [selectedWeek, setSelectedWeek] = useState("week")

  // Datos de ejemplo para las tareas
  const homeworkData = [
    { date: "08/03/2025", title: "Addition exercises", score: "9/10" },
    { date: "01/03/2025", title: "Subtraction exercises", score: "9.8/10" },
    { date: "01/03/2025", title: "Multiplication exercises", score: "10/10" },
    { date: "25/02/2025", title: "Division exercises", score: "8/10" },
  ]

  // Opciones para el selector de semanas
  const weekOptions = ["week", "Week 1", "Week 2", "Week 3", "Week 4"]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Homework</Text>
        <TouchableOpacity onPress={() => router.push("/homework")} style={styles.navButton}>
          <Ionicons name="arrow-forward" size={24} color="white" />
          <Text style={styles.navButtonText}>Go to Board</Text>
        </TouchableOpacity>
      </View>

      <Dropdown value={selectedWeek} options={weekOptions} onSelect={setSelectedWeek} />

      <ScrollView style={styles.content}>
        <View style={styles.tableHeader}>
          <View style={[styles.headerCell, styles.dateColumn]}>
            <Text style={styles.headerText}>Due date</Text>
          </View>
          <View style={[styles.headerCell, styles.titleColumn]}>
            <Text style={styles.headerText}>Title</Text>
          </View>
          <View style={[styles.headerCell, styles.scoreColumn]}>
            <Text style={styles.headerText}>Scores</Text>
          </View>
        </View>

        {homeworkData.map((item, index) => (
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
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.babyBlue,
    padding: 10,
    marginStart: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  navButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },

})
