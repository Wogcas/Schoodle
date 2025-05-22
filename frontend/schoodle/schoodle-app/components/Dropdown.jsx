"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/Colors"

/**
 * @component Dropdown
 * @description Componente reutilizable para selectores desplegables
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.value - Valor seleccionado actualmente
 * @param {Array} props.options - Opciones disponibles para seleccionar
 * @param {Function} props.onSelect - Función a ejecutar al seleccionar una opción
 * @param {string} props.placeholder - Texto a mostrar cuando no hay selección
 * @returns {JSX.Element} Componente de selector desplegable
 */
const Dropdown = ({ value, options, onSelect, placeholder = "Select an option" }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const handleSelect = (option) => {
    onSelect(option)
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={Colors.text} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={() => handleSelect(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  dropdownButton: {
    backgroundColor: Colors.babyBlue,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    color: Colors.text,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 15,
    maxHeight: "50%",
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
})

export default Dropdown
