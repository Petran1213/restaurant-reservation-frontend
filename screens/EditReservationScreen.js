import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditReservationScreen = ({ route, navigation }) => {
  const { reservation } = route.params;
  const [date, setDate] = useState(reservation.date.split('T')[0]);
  const [time, setTime] = useState(reservation.time.slice(0, 5));
  const [peopleCount, setPeopleCount] = useState(String(reservation.people_count));

  const handleUpdate = async () => {
  console.log('📥 handleUpdate started');

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!dateRegex.test(date)) {
    console.log('❌ Invalid date format:', date);
    return Alert.alert('Invalid Date', 'Use format YYYY-MM-DD');
  }
  if (!timeRegex.test(time)) {
    console.log('❌ Invalid time format:', time);
    return Alert.alert('Invalid Time', 'Use 24-hour format HH:MM');
  }
  if (!peopleCount || isNaN(peopleCount) || Number(peopleCount) < 1) {
    console.log('❌ Invalid people count:', peopleCount);
    return Alert.alert('Invalid People Count', 'Enter a number greater than 0');
  }

  try {
    const token = await AsyncStorage.getItem('token');
    console.log('📡 Sending PUT request to:', `http://10.20.32.121:5000/api/reservations/${reservation.reservation_id}`);
    console.log('📤 Data:', { date, time, people_count: peopleCount });

    await axios.put(
      `http://10.20.32.121:5000/api/reservations/${reservation.reservation_id}`,
      {
        date,
        time,
        people_count: peopleCount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('✅ Update success');
    Alert.alert('Success', 'Reservation updated!');
    navigation.goBack();
  } catch (err) {
    console.error('❌ Update error:', err.response?.data || err.message);
    Alert.alert('Error', err.response?.data?.message || 'Update failed');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Edit Reservation</Text>
        <Text style={styles.restaurantName}>{reservation.restaurant_name}</Text>

        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="#aaa"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />

        <TextInput
          placeholder="Time (HH:MM)"
          placeholderTextColor="#aaa"
          value={time}
          onChangeText={setTime}
          style={styles.input}
        />

        <TextInput
          placeholder="People"
          placeholderTextColor="#aaa"
          value={peopleCount}
          onChangeText={setPeopleCount}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity
  style={styles.button}
  onPress={() => {
    console.log('🔘 UPDATE button was pressed');
    handleUpdate();
  }}
>
  <Text style={styles.buttonText}>UPDATE RESERVATION</Text>
</TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default EditReservationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  inner: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ff4444',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
  },
  button: {
    backgroundColor: '#ffaa00',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.2,
  },
});
