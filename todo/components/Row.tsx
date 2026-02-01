import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Task } from '../types/Task'

interface TaskItemProps {
  item: Task;
  toggleTask: (id: number, done: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export default function Row({ item, toggleTask, deleteTask } : TaskItemProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => toggleTask(item.id, item.done)}
      >
        <Text style={[item.done ? styles.itemDone : null]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        style={styles.deleteButton}
      >
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#ffffff37',
    justifyContent: 'space-between',
  },
  itemDone:{
    textDecorationLine: 'line-through'
  },
  deleteButton:{
    backgroundColor: 'red',
    padding: 4
  }
});