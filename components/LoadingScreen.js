import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ message = 'Processing your CV...' }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Spinning animation
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    // Pulsing animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Step progress animation
    const stepProgress = Animated.loop(
      Animated.sequence([
        Animated.timing(stepAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(stepAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    spin.start();
    pulse.start();
    stepProgress.start();

    return () => {
      spin.stop();
      pulse.stop();
      stepProgress.stop();
    };
  }, [spinValue, scaleValue, fadeAnim, stepAnim]);

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const stepOpacity = stepAnim.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0.3, 1, 0.3, 0.3],
  });

  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6', '#d946ef']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }],
          },
        ]}
      >
        {/* Main Loading Icon */}
        <Animated.View
          style={[
            styles.mainIconContainer,
            {
              transform: [
                { rotate: spinInterpolate },
                { scale: scaleValue },
              ],
            },
          ]}
        >
          <View style={styles.iconBackground}>
            <MaterialIcons name="psychology" size={80} color="#6366f1" />
          </View>
        </Animated.View>

        {/* Loading Message */}
        <Text style={styles.loadingMessage}>{message}</Text>

        {/* Progress Steps */}
        <View style={styles.stepsContainer}>
          <Animated.View style={[styles.step, { opacity: stepOpacity }]}>
            <View style={styles.stepIcon}>
              <MaterialIcons name="document-scanner" size={24} color="#6366f1" />
            </View>
            <Text style={styles.stepText}>Extracting text from CV</Text>
          </Animated.View>

          <View style={styles.stepConnector} />

          <Animated.View 
            style={[
              styles.step, 
              { 
                opacity: stepAnim.interpolate({
                  inputRange: [0, 0.33, 0.66, 1],
                  outputRange: [0.3, 0.3, 1, 0.3],
                })
              }
            ]}
          >
            <View style={styles.stepIcon}>
              <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
            </View>
            <Text style={styles.stepText}>Analyzing with AI</Text>
          </Animated.View>

          <View style={styles.stepConnector} />

          <Animated.View 
            style={[
              styles.step, 
              { 
                opacity: stepAnim.interpolate({
                  inputRange: [0, 0.33, 0.66, 1],
                  outputRange: [0.3, 0.3, 0.3, 1],
                })
              }
            ]}
          >
            <View style={styles.stepIcon}>
              <MaterialIcons name="work" size={24} color="#d946ef" />
            </View>
            <Text style={styles.stepText}>Generating job suggestions</Text>
          </Animated.View>
        </View>

        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: stepAnim.interpolate({
                    inputRange: [0, 0.33, 0.66, 1],
                    outputRange: index === 0 ? [1, 0.3, 0.3, 0.3] : 
                                index === 1 ? [0.3, 1, 0.3, 0.3] : 
                                [0.3, 0.3, 1, 0.3],
                  }),
                  transform: [{
                    scale: stepAnim.interpolate({
                      inputRange: [0, 0.33, 0.66, 1],
                      outputRange: index === 0 ? [1.2, 1, 1, 1] : 
                                  index === 1 ? [1, 1.2, 1, 1] : 
                                  [1, 1, 1.2, 1],
                    })
                  }]
                },
              ]}
            />
          ))}
        </View>

        {/* Fun Facts */}
        <View style={styles.funFactsContainer}>
          <Text style={styles.funFactTitle}>💡 Did you know?</Text>
          <Text style={styles.funFact}>
            AI can analyze thousands of job requirements in seconds to find your perfect match!
          </Text>
        </View>
      </Animated.View>

      {/* Background Animation Elements */}
      <Animated.View
        style={[
          styles.backgroundElement1,
          {
            transform: [
              { 
                rotate: spinValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                })
              }
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundElement2,
          {
            transform: [
              { 
                rotate: spinValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['180deg', '360deg'],
                })
              }
            ],
          },
        ]}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    zIndex: 10,
  },
  mainIconContainer: {
    marginBottom: 30,
  },
  iconBackground: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  loadingMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  stepsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    minWidth: 250,
  },
  stepIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    flex: 1,
  },
  stepConnector: {
    width: 2,
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 6,
  },
  funFactsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    maxWidth: width * 0.8,
    alignItems: 'center',
  },
  funFactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  funFact: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  backgroundElement1: {
    position: 'absolute',
    top: height * 0.1,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: height * 0.1,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
});

export default LoadingScreen;
