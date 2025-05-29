import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString(); 
};

const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(':');
  return `${hour}:${minute}`;
};


const MyReservationsScreen = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await axios.get('http://10.20.32.121:5000/api/user/reservations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReservations(res.data);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = (reservationId) => {
  Alert.alert(
    'Delete',
    'Are you sure you want to cancel this reservation?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          handleDeleteConfirm(reservationId); // 👈 Κάλεσμα εκτός async context
        },
      },
    ]
  );
};

const handleDeleteConfirm = async (reservationId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('📡 Sending DELETE request to:', `http://10.20.32.121:5000/api/reservations/${reservationId}`);

    await axios.delete(`http://10.20.32.121:5000/api/reservations/${reservationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Alert.alert('Deleted!', 'Your reservation was cancelled.');
    fetchReservations();
  } catch (err) {
    console.error('❌ Axios error:', err.response?.data || err.message);
    Alert.alert('Error', 'Could not delete reservation');
  }
};






  const renderItem = ({ item }) => (
    
    <View style={styles.card}>
      <Text style={styles.title}>{item.restaurant_name}</Text>
      <Text style={styles.detail}>📆 {formatDate(item.date)} ⏰ {formatTime(item.time)}</Text>
      <Text style={styles.detail}>👥 {item.people_count} people</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditReservation', { reservation: item })}
          style={styles.actionBtn}
        >
          <Ionicons name="create-outline" size={22} color="#ffbb33" />
        </TouchableOpacity>
        
        <TouchableOpacity
  onPress={() => {
    console.log('🔥 DELETE pressed:', item.reservation_id);
    handleDeleteConfirm(item.reservation_id);  // 👈 Κάλεσέ το κατευθείαν για δοκιμή
  }}
  style={{ marginLeft: 15 }}
>
  <Ionicons name="trash-outline" size={22} color="red" />
</TouchableOpacity>




      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff4444" />
      ) : reservations.length > 0 ? (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No reservations yet, Boss.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MyReservationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
  },
  title: {
    color: '#ff4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    marginLeft: 15,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
});
