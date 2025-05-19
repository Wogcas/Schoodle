
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { Colors } from "../constants/Colors"
import Dropdown from "../components/Dropdown"
import ProgressTable from "../components/ProgressTable"

/**
 * @component ProgressScreen
 * @description Pantalla que muestra el progreso académico del estudiante
 * @returns {JSX.Element} Componente de pantalla de progreso
 */
export default function ProgressScreen() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState("Math")

  // Datos de ejemplo para las tareas
  const homeworkData = [
    { date: "08/03/2025", title: "Addition exercises", score: "9/10" },
    { date: "01/03/2025", title: "Subtraction exercises", score: "9.8/10" },
    { date: "01/03/2025", title: "Multiplication exercises", score: "9.8/10" },
    { date: "25/02/2025", title: "Division exercises", score: "8/10" },
    { date: "20/02/2025", title: "Fractions exercises", score: "9.5/10" },
  ]

  // Datos de ejemplo para los exámenes
  const examsData = [
    { date: "02/03/2025", title: "Third midterm", score: "9/10" },
    { date: "25/02/2025", title: "Second midterm", score: "-" },
    { date: "01/02/2025", title: "First midterm", score: "-" },
    { date: "15/01/2025", title: "Diagnostic test", score: "8.5/10" },
  ]

  // Datos de ejemplo para los ejercicios de clase
  const classExercisesData = [
    { date: "02/03/2025", title: "Exercise 10", score: "10/10" },
    { date: "25/02/2025", title: "Exercise 9", score: "10/10" },
    { date: "01/02/2025", title: "Exercise 8", score: "9.5/10" },
    { date: "25/01/2025", title: "Exercise 7", score: "9/10" },
    { date: "20/01/2025", title: "Exercise 6", score: "8.5/10" },
  ]

  // Opciones para el selector de materias
  const subjectOptions = ["Math", "English", "Science", "History", "Art"]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>

      <Dropdown value={selectedSubject} options={subjectOptions} onSelect={setSelectedSubject} />

      <ScrollView style={styles.content}>
        <ProgressTable
          title="Homeworks"
          headers={["Due date", "Title", "Scores"]}
          data={homeworkData}
          showViewMore={true}
          onViewMore={() => router.push("/progress/homework")}
          limit={3}
        />

        <ProgressTable
          title="Exams"
          headers={["Date", "Title", "Scores"]}
          data={examsData}
          showViewMore={true}
          onViewMore={() => router.push("/progress/exams")}
          limit={3}
        />

        <ProgressTable
          title="Class exercises"
          headers={["Date", "Title", "Scores"]}
          data={classExercisesData}
          showViewMore={true}
          onViewMore={() => router.push("/progress/exercises")}
          limit={3}
        />
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
})
