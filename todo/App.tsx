import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Row from './components/Row';
import { Task } from './types/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'YEK-EGAROTS'

export default function App() {
  const [inputText, setInputText] = useState<string>('')
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setTasks(JSON.parse(json));
      } catch (e) {
        console.log("Error")
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async () => {
    setTasks([...tasks, { id: tasks.length + 1, text: inputText, done: 0}])
    setInputText('')
  }

  const toggleTask = async (id: number, done: number) => {
    const newTasks: Task[] = tasks.map(i => {
      if (i.id == id){
        return { id: i.id, text: i.text, done: (i.done == 0 ? 1 : 0)}
      }
      else{
        return i
      }
    })
    setTasks(newTasks)
  }

  const deleteTask = async (id: number) => {
    setTasks(tasks.filter(i => (i.id !== id)))
  }
  
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <View style={styles.input}>
        <TextInput
          placeholder="Enter task..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
      
        <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Row item={item} toggleTask={() => toggleTask(item.id, item.done)} deleteTask={() => deleteTask(item.id)} />
        )}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff49',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    margin: 16,
    textAlign: 'center'
  },
  input:{
    alignItems: 'center'
  },
  addButton: {
    backgroundColor: '#17bb11a5',
    padding: 8
  }
});
