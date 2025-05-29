import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RestaurantListScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://10.20.32.121:5000/api/restaurants');
        setRestaurants(res.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const fakeImages = [
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092', // μαύρη ατμόσφαιρα
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', // sushi
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836', // wine table
  'https://images.unsplash.com/photo-1600891965053-d5454e229d65', // steak
  'https://images.unsplash.com/photo-1559847844-5315695dada5', // candlelight
];

const renderItem = ({ item, index }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Reservation', { restaurant: item })}
  >
    <View style={styles.card}>
      <Image
        source={{
          uri: fakeImages[index % fakeImages.length], // εναλλάσσει 3 εικόνες
        }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff4444" />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.restaurant_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </SafeAreaView>
  );
};

export default RestaurantListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 5,
  },
  location: {
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  description: {
    color: '#ddd',
  },
});
