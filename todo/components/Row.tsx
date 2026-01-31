import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Task } from '../types/Task'

interface TaskItemProps {
  item: Task;
  toggleTask: (id: number, done: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export default function Row({ item, toggleTask, deleteTask } : TaskItemProps) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => toggleTask(item.id, item.done)}
      >
        <Text>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
      >
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  )
}