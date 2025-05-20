import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

interface Country {
  name: {
    common: string;
  };
  capital?: string[];
  population: number;
  flags: {
    png: string;
  };
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
}

export default function CountryScreen() {
  const { code } = useLocalSearchParams();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/alpha/${code}`)
      .then(response => {
        setCountry(response.data[0]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement du pays', error);
        setLoading(false);
      });
  }, [code]);

  if (loading || !country) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: country.flags.png }} style={styles.flag} />
      <Text style={styles.title}>{country.name.common}</Text>
      <Text>Capitale : {country.capital?.[0] ?? 'N/A'}</Text>
      <Text>Population : {country.population.toLocaleString()}</Text>
      <Text>Langue(s) : {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</Text>
      <Text>Monnaie(s) : {country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  flag: {
    width: 200,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
