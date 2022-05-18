import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
  StatusBar,
  Animated,
  TouchableOpacity,
  Image
} from 'react-native';

import weatherService from '../../api/weatherApi';
import * as Location from 'expo-location';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useEffect, useRef, useState } from 'react';
import getTimeByLocal from '../helpers/convertTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_FAVOURITE_KEY } from '../../api/const';

const blue = require('../../assets/Sky_Blue.png');

export default function Home({ route, navigation }) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const { city, latitude, longitude } = route?.params;

  const [cityName, setCityName] = useState(city);
  const [currentLatitude, setLatitude] = useState(latitude);
  const [currentLongitude, setLongitude] = useState(longitude);

  const [currentWeather, setCurrentWeather] = useState({});
  const [hourWeather, setHourWeather] = useState([]);
  const [daysWeather, setDaysWeather] = useState([]);
  const [currentAir, setCurrentAir] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);

  const getWeatherByName = async () => {
    console.log("city & lat & long:", city, latitude, longitude)
    setIsLoading(true);
    if (latitude && longitude) {
      setLatitude(latitude);
      setLongitude(longitude);
      const openWeatherResult = await weatherService.getDataOpenWeather(latitude, longitude)
      if (openWeatherResult) {
        const weatherOneCallData = await weatherService.getOpenWeatherOneCallData(latitude, longitude);
        const nameCmp = city ? city : openWeatherResult?.name;
        setCityName(nameCmp);
        const fvItem = await AsyncStorage.getItem(STORAGE_FAVOURITE_KEY);
        if (fvItem) {
          const arrFvItem = JSON.parse(fvItem);
          const item = arrFvItem.filter(item => {
            return item.name === nameCmp;
          })
          if (item.length !== 0) {
            setIsWishlist(true)
          } else {
            setIsWishlist(false)
          }
        } else {
          setIsWishlist(false)
        }

        setCurrentWeather(openWeatherResult);
        setHourWeather(weatherOneCallData?.hourly);
        setDaysWeather(weatherOneCallData?.daily);

        const airQualityRes = await weatherService.getAirQuality(openWeatherResult?.coord?.lat, openWeatherResult?.coord?.lon);
        console.log("AIR_QUALITY_RES --- status:", airQualityRes.status);
        if (airQualityRes?.status === 200) {
          setCurrentAir(airQualityRes?.data);
        }
        setIsLoading(false);
      }
    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        const openWeatherResult = await weatherService.getDataOpenWeather(location?.coords?.latitude, location?.coords?.longitude);
        setLatitude(location?.coords.latitude);
        setLongitude(location?.coords?.longitude);
        if (openWeatherResult) {
          const weatherOneCallData = await weatherService.getOpenWeatherOneCallData(location?.coords?.latitude, location?.coords?.longitude);
          const nameCmp = city ? city : openWeatherResult?.name;
          setCityName(nameCmp);
          const fvItem = await AsyncStorage.getItem(STORAGE_FAVOURITE_KEY);
          if (fvItem) {
            const arrFvItem = JSON.parse(fvItem);
            const item = arrFvItem.filter(item => {
              return item.name === nameCmp;
            })
            if (item.length !== 0) {
              setIsWishlist(true)
            } else {
              setIsWishlist(false)
            }
          } else {
            setIsWishlist(false)
          }
          setCurrentWeather(openWeatherResult);
          setHourWeather(weatherOneCallData?.hourly);
          setDaysWeather(weatherOneCallData?.daily);

          const airQualityRes = await weatherService.getAirQuality(openWeatherResult?.coord?.lat, openWeatherResult?.coord?.lon);
          console.log("AIR_QUALITY_RES --- status:", airQualityRes.status);

          if (airQualityRes?.status === 200) {
            setCurrentAir(airQualityRes?.data);
          }
          setIsLoading(false);
        }
      }
    }
  }

  const reload = async () => {
    setIsLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, maximumAge: 10000 });
      setLatitude(location?.coords?.latitude);
      setLongitude(location?.coords?.longitude);

      const openWeatherResult = await weatherService.getDataOpenWeather(location?.coords?.latitude, location?.coords?.longitude);
      if (openWeatherResult) {
        setCityName(openWeatherResult?.name);
        const weatherOneCallData = await weatherService.getOpenWeatherOneCallData(location?.coords?.latitude, location?.coords?.longitude);

        const fvItem = await AsyncStorage.getItem(STORAGE_FAVOURITE_KEY);
        if (fvItem) {
          const arrFvItem = JSON.parse(fvItem);
          const nameCmp = openWeatherResult?.name;
          const item = arrFvItem.filter(item => {
            return item.name === nameCmp;
          })
          if (item.length !== 0) {
            setIsWishlist(true)
          } else {
            setIsWishlist(false)
          }
        } else {
          setIsWishlist(false)
        }
        setCurrentWeather(openWeatherResult);
        setHourWeather(weatherOneCallData?.hourly);
        setDaysWeather(weatherOneCallData?.daily);

        const airQualityRes = await weatherService.getAirQuality(openWeatherResult?.coord?.lat, openWeatherResult?.coord?.lon);
        console.log("AIR_QUALITY_RES --- status:", airQualityRes.status);
        if (airQualityRes?.status === 200) {
          setCurrentAir(airQualityRes?.data);
        }
        setIsLoading(false);
      }

    }
  }

  useEffect(() => {
    getWeatherByName();
  }, [city, latitude, longitude]);

  const localDateTime = getTimeByLocal.getDate(currentWeather.dt * 1000);

  return (
    <>
      {
        isLoading ? <View style={styles.container}><Text style={{ fontSize: 30 }}>Đang tải...</Text></View> :
          <>
            <StatusBar barStyle="light-content" />
            <ScrollView
              style={{ width: windowWidth, height: windowHeight }}
            >
              <ImageBackground
                source={blue}
                style={{
                  flex: 1,
                }}>
                <ScrollView
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: 20,
                  }}
                >
                  <View style={styles.topInfoWrapper}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <View>
                        <Text style={styles.city}>{cityName}</Text>
                        <Text style={styles.time}>{localDateTime}</Text>
                      </View>

                      <View>
                        <TouchableOpacity onPress={async () => {
                          if (isWishlist) {
                            const fvItem = await AsyncStorage.getItem(STORAGE_FAVOURITE_KEY);
                            if (fvItem) {
                              const arrFvItem = JSON.parse(fvItem);
                              const item = arrFvItem.filter(item => {
                                return item.name !== cityName;
                              })
                              await AsyncStorage.setItem(STORAGE_FAVOURITE_KEY, JSON.stringify(item));
                            }
                          } else {
                            const fvItem = await AsyncStorage.getItem(STORAGE_FAVOURITE_KEY);
                            if (!fvItem) {
                              const addItem = JSON.stringify([
                                {
                                  name: cityName,
                                  latitude: currentLatitude,
                                  longitude: currentLongitude,
                                }
                              ]);
                              // console.log("addItem", addItem);
                              await AsyncStorage.setItem(STORAGE_FAVOURITE_KEY, addItem);
                            } else {
                              const arrFvItem = JSON.parse(fvItem);
                              const item = arrFvItem.filter(item => {
                                return item.name === cityName;
                              })

                              if (item.length == 0) {
                                arrFvItem.push({
                                  name: cityName,
                                  latitude: currentLatitude,
                                  longitude: currentLongitude,
                                });
                                await AsyncStorage.setItem(STORAGE_FAVOURITE_KEY, JSON.stringify(arrFvItem));
                              }
                            }
                          }
                          setIsWishlist(!isWishlist)
                        }}>
                          {
                            isWishlist ? <AntDesign name="star" size={40} color="white" /> : <AntDesign name="staro" size={40} color="white" />
                          }
                        </TouchableOpacity>
                      </View>

                    </View>
                    <View
                      style={{
                        marginTop: 10
                      }}
                    >
                      <Text style={styles.temparature}>
                        {`${Math.round(currentWeather.main?.temp)}\u2103`}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          alt="icon"
                          source={{
                            uri: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`,
                          }}
                          style={{ width: 45, height: 45 }}
                        />
                        <Text style={styles.weatherType}>
                          {currentWeather.weather[0].description}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: 'rgba(255,255,255,0.7)',
                      marginTop: 20,
                      borderBottomWidth: 1,
                    }}
                  />
                  <View style={styles.bottomInfoWrapper}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>Wind</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {currentWeather.wind?.speed}
                      </Text>
                      <Text style={styles.infoText}>km/h</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>Cloud</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {currentWeather.clouds?.all}
                      </Text>
                      <Text style={styles.infoText}>%</Text>

                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>Humidity</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {currentWeather.main?.humidity}
                      </Text>
                      <Text style={styles.infoText}>%</Text>

                    </View>
                  </View>
                  <View style={styles.bottomInfoWrapper}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>AQI-US</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {currentAir?.data?.current?.pollution?.aqius}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>Main-US</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {currentAir?.data?.current?.pollution?.mainus}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>AQI-CN</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {currentAir?.data?.current?.pollution?.aqicn}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>Main-CN</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {currentAir?.data?.current?.pollution?.maincn}
                      </Text>
                    </View>
                  </View>
                  <ScrollView
                    horizontal={true}
                    style={{
                      borderBottomColor: 'rgba(255,255,255,0.7)',
                      borderBottomWidth: 1,
                    }}
                  />
                  <ScrollView
                    style={styles.nextHour}
                    horizontal={true}
                  >
                    {
                      hourWeather.map((item, index) => {
                        return (
                          <View key={index} style={styles.itemHour}>
                            <Text style={styles.itemTextHour}>
                              {`${Math.round(item?.temp)}\u2103`}
                            </Text>
                            <Text style={styles.itemTextHour}>
                              {getTimeByLocal.getDate(item?.dt * 1000)}
                            </Text>
                          </View>
                        );
                      })
                    }
                  </ScrollView>
                </ScrollView>
              </ImageBackground>
            </ScrollView>



            <View style={styles.appHeader}>
              <TouchableOpacity onPress={() => {
                navigation.navigate('Search', {
                  oldCity: cityName,
                  oldLatitude: currentLatitude,
                  oldLongitude: currentLongitude,
                });
              }}>
                <Feather name="search" size={40} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                navigation.navigate('Wishlist', {
                  oldCity: cityName,
                  oldLatitude: currentLatitude,
                  oldLongitude: currentLongitude,
                })
              }}>
                <Feather name="heart" size={40} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                navigation.navigate('NextDay', {
                  data: daysWeather,
                  oldCity: cityName,
                  oldLatitude: currentLatitude,
                  oldLongitude: currentLongitude,
                })
              }}>
                <AntDesign name="barschart" size={40} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { reload() }}>
                <Ionicons name="reload" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </>
      }
    </>
  );
}

const styles = StyleSheet.create({
  nextHour: {
    marginVertical: 20,
  },
  itemHour: {
    marginRight: 15,
    paddingRight: 10,
    borderRightWidth: 1,
    borderColor: '#fff'
  },
  itemTextHour: {
    color: '#fff',
    fontSize: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: getStatusBarHeight() + 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20
  },
  topInfoWrapper: {
    // flex: 1,
    marginTop: 160,
    // justifyContent: 'space-between',
  },
  city: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  time: {
    color: '#fff',
    fontWeight: 'bold',
  },
  temparature: {
    color: '#fff',
    fontSize: 85,
  },
  weatherType: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
    lineHeight: 34,
    marginLeft: 10,
  },
  bottomInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoBar: {
    width: 45,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorWrapper: {
    position: 'absolute',
    top: 140,
    left: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalDot: {
    height: 5,
    width: 5,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
});
