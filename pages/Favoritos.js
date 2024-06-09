import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'university.db', location: 'default' }, () => {}, error => {
  console.log(error);
});

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);

  const carregarFavoritos = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM universidades', [], (tx, results) => {
        const rows = results.rows.raw();
        setFavoritos(rows);
      });
    });
  };

  const removerDosFavoritos = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM universidades WHERE id = ?', [id], () => {
        Alert.alert('Removido', 'A universidade foi removida dos favoritos.');
        carregarFavoritos();
      });
    });
  };

  useEffect(() => {
    carregarFavoritos();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => removerDosFavoritos(item.id)}>
            <View style={styles.universityItem}>
              <Text>{item.nome}</Text>
              <Text>{item.website}</Text>
            </View>
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
  universityItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
});
