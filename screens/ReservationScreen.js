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

const ReservationScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [peopleCount, setPeopleCount] = useState('');

  // State για error μηνύματα
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [peopleError, setPeopleError] = useState('');

  const handleReservation = async () => {
    setDateError('');
    setTimeError('');
    setPeopleError('');

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!dateRegex.test(date)) {
      setDateError('Use format YYYY-MM-DD');
      return;
    }

    if (!timeRegex.test(time)) {
      setTimeError('Use 24-hour format (e.g. 18:30)');
      return;
    }

    if (!peopleCount || isNaN(peopleCount) || Number(peopleCount) < 1) {
      setPeopleError('Enter a number greater than 0');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      const res = await axios.post(
        'http://10.20.32.121:5000/api/reservations', // άλλαξε IP αν χρειάζεται
        {
          restaurant_id: restaurant.restaurant_id,
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

      Alert.alert('Success', 'Reservation confirmed!');
      navigation.navigate('Main', { screen: 'Restaurants' });
    } catch (err) {
      console.error('Reservation error:', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Reservation failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Make a Reservation at</Text>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>

        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="#aaa"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />
        {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

        <TextInput
          placeholder="Time (HH:MM)"
          placeholderTextColor="#aaa"
          value={time}
          onChangeText={setTime}
          style={styles.input}
        />
        {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}

        <TextInput
          placeholder="People"
          placeholderTextColor="#aaa"
          value={peopleCount}
          onChangeText={setPeopleCount}
          keyboardType="numeric"
          style={styles.input}
        />
        {peopleError ? <Text style={styles.errorText}>{peopleError}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleReservation}>
          <Text style={styles.buttonText}>CONFIRM THE DEAL</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReservationScreen;

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
    marginBottom: 10,
    backgroundColor: '#1a1a1a',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#ff4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.2,
  },
});
