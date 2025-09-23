

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Header = ({ title, onBack, onSettings, showSettings = true }) => {
  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.leftSection}>
            {onBack && (
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.rightSection}>
            {showSettings && onSettings && (
              <TouchableOpacity style={styles.settingsButton} onPress={onSettings}>
                <MaterialIcons name="settings" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingBottom: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  settingsButton: {
    padding: 5,
  },
});

export default Header;