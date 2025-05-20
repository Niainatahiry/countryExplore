import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { TextInput } from 'react-native';

// --- Interface pour un pays ---
interface Country {
  cca3: string;
  name: {
    common: string;
  };
  flags: {
    png: string;
    svg: string;
  };
}

export default function HomeScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);


  useEffect(() => {
    axios.get<Country[]>('https://restcountries.com/v3.1/all')
      .then(response => {
        const sorted = response.data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des pays:', error);
        setLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  useEffect(() => {
    const results = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCountries(results);
  }, [search, countries]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des pays...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un pays..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredCountries.slice(0, visibleCount)}
        keyExtractor={(item) => item.cca3}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/country/[code]', params: { code: item.cca3 } })}>
            <View style={styles.countryItem}>
              <Image source={{ uri: item.flags.png }} style={styles.flag} />
              <Text style={styles.name}>{item.name.common}</Text>
            </View>
          </Pressable>
        )}
        
      />
      {visibleCount < countries.length && (
        <View style={styles.loadMore}>
          <Button title="Afficher plus" onPress={handleLoadMore} />
        </View>
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  flag: {
    width: 40,
    height: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
  },
  loadMore: {
    padding: 10,
    alignItems: 'center',
  },
  searchInput: {
    height: 40,                 // Hauteur fixe
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,         // Pour éviter l’effet "rapetissé"
    margin: 10,
    fontSize: 16,
    textAlignVertical: 'center' // Pour Android
  },
});
