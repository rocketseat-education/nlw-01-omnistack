import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Picker from 'react-native-picker-select'
import axios from 'axios'


interface IBGEUFResponse {
  sigla: string[2]
}

interface IBGECityResponse {
  nome: string
}

interface SelectPicker {
  label: string,
  value: string,
}

const Home = () => {

  const [ufs, setUfs] = useState<SelectPicker[]>([])
  const [cities, setCities] = useState<SelectPicker[]>([])

  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity })
  }

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      const ufInitials = res.data.map(uf => {
        return {
          label: uf.sigla,
          value: uf.sigla
        }
      })

      ufInitials.sort((a, b) => {
        return a.value > b.value ? 1 : -1
      })

      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '') {
      return
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => {
        const cityNames = res.data.map(city => {
          return {
            label: city.nome,
            value: city.nome
          }
        })

        setCities(cityNames)
      })
  }, [selectedUf])

  function handleSelectUf(event: string) {
    setSelectedUf(event)
  }

  function handleSelectCity(event: string) {
    setSelectedCity(event)
  }

  const placeholders = {
    uf: {
      label: 'Selecione uma UF',
      value: ''
    },
    city: {
      label: 'Selecione uma Cidade',
      value: ''
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Picker
            placeholder={placeholders.uf}
            onValueChange={handleSelectUf}
            value={selectedUf}
            items={ufs}
          />

          <Picker
            placeholder={placeholders.city}
            value={selectedCity}
            onValueChange={handleSelectCity}
            items={cities}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;