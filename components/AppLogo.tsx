import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { APP_LOGO } from '../constants/ImageAssets';

type LogoSize = 'small' | 'medium' | 'large';

interface AppLogoProps {
  size?: LogoSize;
  showText?: boolean;
}

export default function AppLogo({ size = 'medium', showText = true }: AppLogoProps) {
  const { colors } = useTheme();
  
  // Size mapping
  const sizeMap = {
    small: 40,
    medium: 80,
    large: 120
  };
  
  const logoSize = sizeMap[size];
  const fontSize = size === 'small' ? 16 : size === 'medium' ? 24 : 32;
  
  return (
    <View style={styles.container}>
      <Image 
        source={APP_LOGO} 
        style={[
          styles.logo, 
          { width: logoSize, height: logoSize }
        ]} 
        resizeMode="contain"
      />
      
      {showText && (
        <Text style={[styles.appName, { color: colors.primary, fontSize }]}>
          Revit
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 10,
    borderRadius: 10, // Adding slight rounding to the logo
  },
  appName: {
    fontWeight: 'bold',
  }
});
