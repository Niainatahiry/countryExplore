import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

interface Country {
  cca3: string;
  name: {
    common: string;
  };
  latlng: [lat: number, lng: number];
  flags: {
    png: string;
    svg: string;
  };
}

export default function TabTwoScreen() {

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }
  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20,
          longitude: 0,
          latitudeDelta: 100,
          longitudeDelta: 100,
        }}
      >
        {countries.map((country, index) => {
          if (!country.latlng) return null;
          const [lat, lng] = country.latlng;
          return (
            <Marker
              key={index}
              coordinate={{ latitude: lat, longitude: lng }}
              title={country.name.common}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1, // Utilise tout l’espace dispo dans le container
  },
});
