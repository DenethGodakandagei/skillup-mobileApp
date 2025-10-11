import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PerformanceMonitor = ({ stage, startTime }) => {
  const stageTimes = useRef({});

  useEffect(() => {
    if (stage && startTime) {
      const currentTime = Date.now();
      const duration = currentTime - startTime;
      
      stageTimes.current[stage] = duration;
      
      // Log performance metrics (remove in production)
      console.log(`Performance: ${stage} completed in ${duration}ms`);
    }
  }, [stage, startTime]);

  // Don't render anything in production
  if (__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Stage: {stage || 'Initializing'} | 
          Time: {startTime ? Date.now() - startTime : 0}ms
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    borderRadius: 5,
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontSize: 10,
  },
});

export default PerformanceMonitor;
