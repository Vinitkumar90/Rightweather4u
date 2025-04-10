import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View,Image,Keyboard, FlatList } from 'react-native';
import axios from 'axios';

const API_KEY = 'api chor do bhaii '

export default function App() {
  const[city, setCity] = useState('');
  const[weather, setweather] = useState(null);
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState('');
  const[forecast, setForecast] = useState([])

  const fetchWeather  = () => {
    if(!city.trim()){
      setError("please enter a valid city name")
      return;
    } 
    Keyboard.dismiss()
    setLoading(true)
    setError('');
    setweather(null);
    setForecast([]);

    axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
    .then((res)=>{
      setweather(res.data);


      return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    })
    .then((res)=>{
      const dailyData = {};
      res.data.list.forEach((item)=>{
          const date = item.dt_txt.split(' ')[0];
          if(!dailyData[date] && item.dt_txt.includes("12:00:00")){
            dailyData[date] = item;
          }
      });

      setForecast(Object.values(dailyData))
    })
    .catch((err)=>{
      setError('City not found');
    })
    .finally(()=>{
      setLoading(false)
      setCity('')
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
     <View style={{height:150}}>
      <FlatList
        horizontal
        data={forecast}
        keyExtractor={(item,index)=> index.toString()}
        renderItem={({item}) => (
          <View style={styles.forecastItem}>
            <Text style={styles.date}>{item.dt_txt.split(" ")[0]}</Text>
            <Image
              source={{uri : `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}}
              style={{width:50, height:50}}
            />
           <Text>{item.main.temp}°C</Text>
           <Text>{item.weather[0].description}</Text>
          </View>
        )}
      />
      </View>
     
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
    marginVertical:18,
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
  },
  forecastItem:{
    marginHorizontal:10,
    borderWidth:1,
    alignItems:'center',
    backgroundColor:'#e3e3e3',
    padding:10,
    borderRadius:10
  },
  date:{
    fontSize:14,
    fontWeight:'bold',
    marginBottom: 5,
  }
});
