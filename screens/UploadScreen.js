
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import CVUploader from '../components/CVUploader';
import LoadingScreen from '../components/LoadingScreen';
import { useApp } from '../context/AppContext';
import { AIService } from '../services/aiService';
import { OCRService } from '../services/ocrService';

const { width } = Dimensions.get('window');

const UploadScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useApp();

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Camera roll access is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        await processCV(result.assets[0].uri, 'image');
      }
    } catch (error) {
      showError('Failed to pick image: ' + error.message);
    }
  };

  const handleCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Camera access is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        await processCV(result.assets[0].uri, 'image');
      }
    } catch (error) {
      showError('Failed to take photo: ' + error.message);
    }
  };

  

  const processCV = async (uri, type) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Step 1: Extract text from CV
      let extractedText;
      if (type === 'pdf') {
        extractedText = await OCRService.extractTextFromPDF(uri);
      } else {
        extractedText = await OCRService.extractTextFromImage(uri);
      }

      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('Could not extract enough text from CV. Please try a clearer image.');
      }

      dispatch({ type: 'SET_CV_DATA', payload: { text: extractedText, uri } });

      // Step 2: Analyze CV for job roles
      const analysis = await AIService.analyzeCV(extractedText);
      dispatch({ type: 'SET_JOB_SUGGESTIONS', payload: analysis });

      // Navigate to results
      router.replace('/results');

    } catch (error) {
      showError(error.message);
    } finally {
      // Ensure loading is cleared if something prevented reducer updates
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const showError = (message) => {
    dispatch({ type: 'SET_ERROR', payload: message });
    Alert.alert('Error', message);
  };

  if (state.loading) {
    return <LoadingScreen message="Analyzing your CV..." />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
     

      {/* Main Content */}
      <View style={styles.content}>
        {/* Upload Section */}
        <CVUploader 
          onImagePicker={handleImagePicker}
          onCamera={handleCamera}
        />

        

        {/* How It Works Section */}
        <View style={styles.howItWorksContainer}>
          <Text style={styles.howItWorksTitle}>🚀 How it works:</Text>
          
          <View style={styles.stepsList}>
            <StepItem
              stepNumber="1"
              title="Upload Your CV"
              description="Take a photo, select from gallery, or upload a PDF"
              icon="file-upload"
            />
            <StepItem
              stepNumber="2"
              title="AI Analysis"
              description="Our AI extracts and analyzes your skills, experience, and qualifications"
              icon="psychology"
            />
            <StepItem
              stepNumber="3"
              title="Get Suggestions"
              description="Receive personalized job role recommendations with match scores"
              icon="recommend"
            />
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for best results:</Text>
          <View style={styles.tipsList}>
            <TipItem text="Ensure CV text is clear and readable" />
            <TipItem text="Include all relevant work experience" />
            <TipItem text="List your technical and soft skills" />
            <TipItem text="Mention your education and certifications" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Feature Item Component
const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <MaterialIcons name={icon} size={24} color="#6366f1" />
    </View>
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

// Step Item Component
const StepItem = ({ stepNumber, title, description, icon }) => (
  <View style={styles.stepItem}>
    <View style={styles.stepNumberContainer}>
      <Text style={styles.stepNumber}>{stepNumber}</Text>
    </View>
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <MaterialIcons name={icon} size={20} color="#6366f1" />
        <Text style={styles.stepTitle}>{title}</Text>
      </View>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  </View>
);

// Tip Item Component
const TipItem = ({ text }) => (
  <View style={styles.tipItem}>
    <MaterialIcons name="check-circle" size={16} color="#10b981" />
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  content: {
    padding: 20,
  },
  featuresContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  featuresList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIconContainer: {
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 12,
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  howItWorksContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  howItWorksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  stepsList: {
    gap: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    backgroundColor: '#6366f1',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 15,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#166534',
    marginLeft: 10,
    flex: 1,
  },
});

export default UploadScreen;