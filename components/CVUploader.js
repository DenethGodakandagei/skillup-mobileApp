import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const CVUploader = ({ onImagePicker, onCamera, onDocumentPicker }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📄 Upload Your CV</Text>
      <Text style={styles.sectionSubtitle}>
        Choose how you'd like to upload your CV
      </Text>
      
      <View style={styles.uploadOptions}>
        {/* Camera Option */}
        <TouchableOpacity style={styles.uploadOption} onPress={onCamera}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.optionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </LinearGradient>
          <Text style={styles.optionTitle}>Take Photo</Text>
          <Text style={styles.optionSubtitle}>Capture CV with camera</Text>
        </TouchableOpacity>

        {/* Gallery Option */}
        <TouchableOpacity style={styles.uploadOption} onPress={onImagePicker}>
          <LinearGradient
            colors={['#10b981', '#06d6a0']}
            style={styles.optionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="photo-library" size={32} color="white" />
          </LinearGradient>
          <Text style={styles.optionTitle}>From Gallery</Text>
          <Text style={styles.optionSubtitle}>Select from photos</Text>
        </TouchableOpacity>

      </View>

      {/* Supported Formats */}
      <View style={styles.supportedFormats}>
        <Text style={styles.formatsTitle}>Supported formats:</Text>
        <View style={styles.formatsList}>
          <View style={styles.formatItem}>
            <MaterialIcons name="image" size={16} color="#6366f1" />
            <Text style={styles.formatText}>JPG, PNG</Text>
          </View>
          <View style={styles.formatItem}>
            <MaterialIcons name="picture-as-pdf" size={16} color="#ef4444" />
            <Text style={styles.formatText}>PDF</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 25,
  },
  uploadOptions: {
    gap: 15,
  },
  uploadOption: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  supportedFormats: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  formatsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  formatsList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  formatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  formatText: {
    fontSize: 13,
    color: '#6b7280',
  },
});

export default CVUploader;