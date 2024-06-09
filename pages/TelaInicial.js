import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';

// Importação condicional
let db;
if (Platform.OS !== 'web') {
  const SQLite = require('react-native-sqlite-storage');
  db = SQLite.openDatabase({ name: 'university.db', location: 'default' }, () => {}, error => {
    console.log(error);
  });

  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS universidades (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, pais TEXT, website TEXT)'
    );
  });
}

export default function TelaInicial({ navigation }) {
  const [pais, setPais] = useState('');
  const [nome, setNome] = useState('');
  const [universidades, setUniversidades] = useState([]);

  const buscarUniversidades = async () => {
    let url = 'http://universities.hipolabs.com/search?';
    if (pais) url += `country=${pais}&`;
    if (nome) url += `name=${nome}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length === 0) {
        Alert.alert('Nenhuma universidade encontrada', 'Tente com outras palavras-chave.');
      } else {
        setUniversidades(data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar as universidades.');
    }
  };

  const salvarNosFavoritos = (universidade) => {
    if (Platform.OS === 'web') {
      // Armazenamento no localStorage para web
      let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      favoritos.push(universidade);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      Alert.alert('Salvo', 'A universidade foi salva nos favoritos.');
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO universidades (nome, pais, website) VALUES (?, ?, ?)',
          [universidade.name, universidade.country, universidade.web_pages[0]],
          () => {
            Alert.alert('Salvo', 'A universidade foi salva nos favoritos.');
          },
          error => {
            console.error(error);
          }
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome do País"
        value={pais}
        onChangeText={setPais}
        style={styles.input}
      />
      <TextInput
        placeholder="Nome da Universidade"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="PESQUISAR" onPress={buscarUniversidades} color="#2196F3" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="FAVORITOS" onPress={() => navigation.navigate('Favoritos')} color="#2196F3" />
        </View>
      </View>
      <FlatList
        data={universidades}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => salvarNosFavoritos(item)}>
            <Text style={styles.universityItem}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    margin: 5,
  },
  universityItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
});
