import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View,Image,Keyboard } from 'react-native';
import axios from 'axios';

const API_KEY = '6c80ed50512457062d58f2804bea228b'

export default function App() {
  const[city, setCity] = useState('');
  const[weather, setweather] = useState(null);
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState('')

  const fetchWeather  = () => {
    if(!city) return;
    Keyboard.dismiss()
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
     <Text style={styles.heading}>RightWeather4U</Text>

     <TextInput
     style={styles.input}
     placeholder='Enter city'
      value={city}
      onChangeText={(text)=>setCity(text)}
     />

     <Button title='Get weather' onPress={fetchWeather} />

     {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

     {error ? <Text>{error}</Text> : null}

     {weather && (
      <View style={styles.weatherbox}>
        <Text style={styles.city}>{weather.name}</Text>
        <Text style={styles.temp}>{weather.main.temp}°C</Text>
        <Text style={styles.desc}>{weather.weather[0].description}</Text>
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
   flex:1,
   alignItems:'center',
   justifyContent:"center",
    padding:20,
    marginTop: 50,
  },
  heading:{
    textAlign:"center",
    fontSize:24,
    backgroundColor:"pink",
    fontWeight:'bold',
    marginBottom:16,
    paddingHorizontal:32,
    paddingVertical:16,
    borderRadius:12
  },
  input: {
    borderColor: '#999',
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    width:'80%'
  },
  weatherbox:{
    alignItems:'center',
    marginVertical:12,
    borderWidth:2,
    padding:24,
  },
  city:{
    fontSize:24,
  },
  temp:{
    fontSize:26,
  },
  desc:{
    fontSize:28,
  }
});
