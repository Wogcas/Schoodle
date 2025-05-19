import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Colors } from "../constants/Colors"
import { Ionicons } from "@expo/vector-icons"

/**
 * @component ProgressTable
 * @description Componente reutilizable para mostrar tablas de progreso académico
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la sección
 * @param {Array} props.headers - Encabezados de la tabla
 * @param {Array} props.data - Datos para mostrar en la tabla
 * @param {boolean} props.showViewMore - Si se debe mostrar el botón para ver más
 * @param {Function} props.onViewMore - Función a ejecutar al presionar ver más
 * @param {number} props.limit - Número máximo de elementos a mostrar
 * @returns {JSX.Element} Componente de tabla de progreso
 */
const ProgressTable = ({ title, headers, data, showViewMore = false, onViewMore, limit = 3 }) => {
  // Limitar los datos a mostrar según el límite
  const limitedData = data.slice(0, limit)

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showViewMore && (
          <TouchableOpacity style={styles.viewMoreButton} onPress={onViewMore}>
            <Ionicons name="chevron-forward" size={20} color={Colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tableHeader}>
        {headers.map((header, index) => (
          <View
            key={index}
            style={[
              styles.headerCell,
              index === 0 ? styles.firstColumn : null,
              index === headers.length - 1 ? styles.lastColumn : null,
            ]}
          >
            <Text style={styles.headerText}>{header}</Text>
          </View>
        ))}
      </View>

      {limitedData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {Object.values(row).map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={[
                styles.cell,
                cellIndex === 0 ? styles.firstColumn : null,
                cellIndex === Object.values(row).length - 1 ? styles.lastColumn : null,
              ]}
            >
              <Text style={styles.cellText}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  viewMoreButton: {
    padding: 5,
  },
  tableHeader: {
    flexDirection: "row",
    marginBottom: 5,
  },
  headerCell: {
    flex: 1,
    backgroundColor: Colors.yellowButton,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 2,
    alignItems: "center",
  },
  firstColumn: {
    flex: 0.8,
  },
  lastColumn: {
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
    flex: 1,
    backgroundColor: Colors.babyBlue,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    color: Colors.text,
    textAlign: "center",
  },
})

export default ProgressTable
