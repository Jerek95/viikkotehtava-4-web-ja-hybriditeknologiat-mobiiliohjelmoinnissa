import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Row from './components/Row';
import { Task } from './types/Task';
import * as SQLite from 'expo-sqlite';



export default function App() {
  const [inputText, setInputText] = useState<string>('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
      const initDB = async () => {
        const database = await SQLite.openDatabaseAsync('tasks.db');
        setDb(database);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            done INTEGER DEFAULT 0
          );
        `);

        loadTasks(database);
      };

      initDB();
    }, []);

  const loadTasks = async (db: SQLite.SQLiteDatabase) => {
    const result = await db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY id DESC');
      setTasks(result);
  }

  const addTask = async () => {
    if (!inputText.trim() || !db) return;

      await db.runAsync('INSERT INTO tasks (text) VALUES (?)', inputText);
      setInputText('');
      loadTasks(db);
  }

  const toggleTask = async (id: number, done: number) => {
    if (!db) return;
    await db.runAsync('UPDATE tasks SET done = ? WHERE id = ?', done ? 0 : 1, id);
    loadTasks(db);
  }

  const deleteTask = async (id: number) => {
    if (!db) return;
    await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
    loadTasks(db);
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
