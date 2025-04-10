import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View,Image } from 'react-native';
import axios from 'axios';

const API_KEY = 'Your Dummy key'

export default function App() {
  const[city, setCity] = useState('');
  const[weather, setweather] = useState(null);
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState('')

  const fetchWeather  = () => {
    if(!city) return;
    setLoading(true)
    setError('');
    axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
    .then((res)=>{
      setweather(res.data);
      setLoading(false);
    })
    .catch((err)=>{
      setError('City not found');
      setweather(null);
      setLoading(false);
    })
  }


  return (
    <View  style={styles.container}>
     <Text>RightWeather4U</Text>

     <TextInput
     placeholder='Enter city'
      value={city}
      onChangeText={(text)=>setCity(text)}
     />

     <Button title='Get weather' onPress={fetchWeather} />

     {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

     {error ? <Text>{error}</Text> : null}

     {weather && (
      <View>
        <Text>{weather.name}</Text>
        <Text>{weather.main.temp}°C</Text>
        <Text>{weather.weather[0].description}</Text>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
          }}

          style={{width:100, height:100}}
        />

      </View>
     )}
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    padding:24,
    marginTop: 40,
  },
});
