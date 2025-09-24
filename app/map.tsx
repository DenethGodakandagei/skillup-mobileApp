import { courses } from "@/data/courses";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const allCategories = [...new Set(courses.map((c) => c.category))];
const SCREEN_HEIGHT = Dimensions.get("window").height;
const HEADER_HEIGHT = 80;

export default function MapScreen() {
  const { title } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [allCourses, setAllCourses] = useState<
    ((typeof courses)[0] & { distance: number })[]
  >([]);
  const [filteredCourses, setFilteredCourses] = useState<
    ((typeof courses)[0] & { distance: number })[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<
    ((typeof courses)[0] & { distance?: number }) | null
  >(null);
  const [distanceFilterKm, setDistanceFilterKm] = useState<string>("");
  const [showFloatingCard, setShowFloatingCard] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  // Bottom sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%"], []);

  const openFilterSheet = () => {
    setShowFloatingCard(false); // Close the floating card before opening the bottom sheet
    bottomSheetRef.current?.expand();
  };

  const closeFilterSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      if (distanceFilterKm.trim() === "") {
        setIsFilterApplied(false);
      }
    }
  };

  const suggestions = useMemo(() => {
    if (debouncedSearch.trim() === "") return [];
    return allCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.provider.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, allCourses]);

  const MAX_DROPDOWN_HEIGHT = Dimensions.get("window").height * 0.45;
  const ITEM_HEIGHT = 65;

  const dropdownFinalHeight = useMemo(() => {
    const calculatedHeight = suggestions.length * ITEM_HEIGHT;
    return Math.min(calculatedHeight, MAX_DROPDOWN_HEIGHT);
  }, [suggestions, MAX_DROPDOWN_HEIGHT]);

  useEffect(() => {
    Animated.spring(dropdownAnim, {
      toValue: showDropdown ? 1 : 0,
      stiffness: 250,
      damping: 20,
      mass: 1,
      useNativeDriver: false,
    }).start();
  }, [showDropdown, dropdownFinalHeight]);

  useEffect(() => {
    if (showFloatingCard) {
      Animated.spring(cardAnim, {
        toValue: 1,
        stiffness: 250,
        damping: 20,
        mass: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 200, // Duration for the closing animation
        useNativeDriver: true,
      }).start(() => {
        setSelectedCourseDetails(null); // Clear the details after the animation is complete
      });
    }
  }, [showFloatingCard]);

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor("white");
    }
    StatusBar.setBarStyle("dark-content");
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    (async () => {
      let latitude: number, longitude: number;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Using default Colombo.");
          latitude = 6.9271;
          longitude = 79.8612;
        } else {
          const loc = await Location.getCurrentPositionAsync({});
          latitude = loc.coords.latitude;
          longitude = loc.coords.longitude;
        }
      } catch {
        latitude = 6.9271;
        longitude = 79.8612;
      }

      setUserLocation({ lat: latitude, lng: longitude });

      const withDist = courses.map((c) => ({
        ...c,
        distance: getDistance(latitude, longitude, c.lat, c.lng),
      }));

      withDist.sort((a, b) => a.distance - b.distance);
      setAllCourses(withDist);
      setFilteredCourses([]);
    })();
  }, []);

  const handleSelect = (course: (typeof allCourses)[0]) => {
    setSearchText(course.name);
    setDebouncedSearch("");
    setShowDropdown(false);
    Keyboard.dismiss();

    setFilteredCourses([course]);

    mapRef.current?.animateToRegion(
      {
        latitude: course.lat,
        longitude: course.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000
    );
  };

  const handleSearchPress = () => {
    setShowDropdown(false);
    Keyboard.dismiss();
    setSelectedCourseDetails(null);
    setShowFloatingCard(false);
    setIsFilterApplied(false); // Clear filter state on new search

    const searchResults = allCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.provider.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    setFilteredCourses(searchResults);

    if (mapRef.current && searchResults.length > 0) {
      const coordinates: LatLng[] = searchResults.map((c) => ({
        latitude: c.lat,
        longitude: c.lng,
      }));
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 80, bottom: 160, left: 40, right: 40 },
        animated: true,
      });
    }
  };

  const handleMarkerPress = (courseId: number) => {
    const course = allCourses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourseDetails(course);
      setShowFloatingCard(true); // Show the floating card when a marker is pressed
    }
  };

  const applyDistanceFilter = () => {
    Keyboard.dismiss();

    const maxKm = parseFloat(distanceFilterKm);
    if (distanceFilterKm.trim() !== "" && (isNaN(maxKm) || maxKm < 0)) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid positive number for distance."
      );
      setIsFilterApplied(false);
      return;
    }

    let finalFilteredCourses = allCourses;

    if (debouncedSearch.trim() !== "") {
      finalFilteredCourses = allCourses.filter(
        (c) =>
          c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          c.provider.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (!isNaN(maxKm) && maxKm >= 0) {
      finalFilteredCourses = finalFilteredCourses.filter((c) => {
        return c.distance <= maxKm;
      });
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }

    setFilteredCourses(finalFilteredCourses);
    closeFilterSheet();
  };

  const hideFloatingCard = () => {
    setShowFloatingCard(false);
  };

  // jobrole card -> map (pass the title to input)
  useEffect(() => {
    if (title && allCourses.length > 0) {
      const text = String(title);
      setSearchText(text);
      setDebouncedSearch(text);

      const searchResults = allCourses.filter(
        (c) =>
          c.name.toLowerCase().includes(text.toLowerCase()) ||
          c.provider.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCourses(searchResults);
      setShowDropdown(true);

      if (mapRef.current && searchResults.length > 0) {
        const coordinates: LatLng[] = searchResults.map((c) => ({
          latitude: c.lat,
          longitude: c.lng,
        }));
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 80, bottom: 160, left: 40, right: 40 },
          animated: true,
        });
      }
    }
  }, [title, allCourses]);

  if (!userLocation) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1D3D47" />
      </View>
    );
  }

  const nearestCourseId =
    filteredCourses.length > 0
      ? filteredCourses.reduce((nearest, curr) =>
          curr.distance < nearest.distance ? curr : nearest
        ).id
      : null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setShowDropdown(false);
          hideFloatingCard(); // Close the floating card on map touch
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#1D3D47" />
            </TouchableOpacity>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={20}
                color="#888"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search courses or providers..."
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  setShowDropdown(text.trim() !== "");
                }}
                returnKeyType="search"
                onSubmitEditing={handleSearchPress}
              />
            </View>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={openFilterSheet}
            >
              <Ionicons name="options-outline" size={24} color="#1D3D47" />
              {isFilterApplied && <View style={styles.filterDot} />}
            </TouchableOpacity>
          </View>

          <View style={styles.mapViewWrapper}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={StyleSheet.absoluteFill}
              initialRegion={{
                latitude: userLocation.lat,
                longitude: userLocation.lng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation
            >
              {filteredCourses.map((course) => (
                <Marker
                  key={course.id}
                  coordinate={{ latitude: course.lat, longitude: course.lng }}
                  title={course.name}
                  description={`${course.provider} - ${course.distance.toFixed(
                    1
                  )} km away`}
                  pinColor={
                    course.id === nearestCourseId ? "#8177ea" : "purple"
                  }
                  onPress={() => handleMarkerPress(course.id)}
                />
              ))}
            </MapView>
          </View>

          <Animated.View
            style={[
              styles.suggestionList,
              {
                height: dropdownAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, dropdownFinalHeight],
                }),
                opacity: dropdownAnim,
              },
            ]}
          >
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.suggestionText}>{item.name}</Text>
                  <Text style={styles.suggestionSub}>{item.provider}</Text>
                </TouchableOpacity>
              )}
              scrollEnabled={
                suggestions.length * ITEM_HEIGHT > MAX_DROPDOWN_HEIGHT
              }
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      {selectedCourseDetails && (
        <Animated.View
          style={[
            styles.floatingCardWrapper,
            {
              transform: [
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
            {
              opacity: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.floatingCard}>
            {selectedCourseDetails.imgUrl ? (
              <Image
                source={{ uri: selectedCourseDetails.imgUrl }}
                style={styles.floatingThumb}
              />
            ) : (
              <View style={[styles.floatingThumb, styles.placeholderThumb]}>
                <Ionicons name="document-outline" size={40} color="#666" />
              </View>
            )}
            <View style={styles.floatingMeta}>
              <Text style={styles.floatingTitle} numberOfLines={1}>
                {selectedCourseDetails.name}
              </Text>
              <Text style={styles.floatingSub} numberOfLines={1}>
                {selectedCourseDetails.provider}
              </Text>
              <Text style={styles.floatingDetail} numberOfLines={1}>
                Duration: {selectedCourseDetails.duration}
              </Text>
              <Text style={styles.floatingDetail} numberOfLines={1}>
                Starts: {selectedCourseDetails.startDate}
              </Text>
              <View style={styles.floatingBottomRow}>
                <Text style={styles.floatingPrice}>
                  {selectedCourseDetails.price}
                </Text>
                <View style={styles.floatingDistance}>
                  <Ionicons name="location-outline" size={16} color="#fff" />
                  <Text style={styles.floatingDistanceText}>
                    {selectedCourseDetails.distance?.toFixed(1)} km
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.floatingClose}
              onPress={() => hideFloatingCard()}
            >
              <Ionicons name="close" size={24} color="#333333c7" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backdropComponent={BottomSheetBackdrop}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.filterSheetTitle}>Filter by Distance</Text>
          <View style={styles.filterContent}>
            <BottomSheetTextInput
              style={styles.filterInput}
              placeholder="Enter max distance (km)"
              value={distanceFilterKm}
              onChangeText={setDistanceFilterKm}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyDistanceFilter}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1 },
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 20 : 20,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    zIndex: 3,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8177ea",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  mapViewWrapper: {
    flex: 1,
    zIndex: 1,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  suggestionList: {
    position: "absolute",
    top: Platform.OS === "ios" ? 80 : 100,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    zIndex: 2,
  },
  suggestionItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: "#eee",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  suggestionSub: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  bottomSheetContent: {
    paddingHorizontal: 16,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D3D47",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailsText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  registerButton: {
    backgroundColor: "#8177ea",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  filterPillsContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  filterPillsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1D3D47",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  filterPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  pillButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  pillSelected: {
    backgroundColor: "#8177ea",
  },
  pillText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  pillSelectedText: {
    color: "#fff",
  },
  filterInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  applyButton: {
    backgroundColor: "#8177ea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#8177ea",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  applyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsSheetBg: {
    backgroundColor: "#e6e8fa",
  },
  filterSheetBg: {
    backgroundColor: "#fff",
  },
  floatingCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 11,
    zIndex: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
    width: "100%",
  },
  floatingThumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 16,
  },
  placeholderThumb: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingMeta: {
    flex: 1,
  },
  floatingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  floatingSub: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  floatingDetail: {
    color: "#444",
    fontSize: 14,
    marginBottom: 4,
  },
  floatingBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  floatingPrice: {
    fontWeight: "700",
    fontSize: 18,
    color: "#8177ea",
  },
  floatingDistance: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  floatingDistanceText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 14,
  },
  detailsCard: {
    position: "absolute",
    left: 12,
    right: 12,
    height: 320,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    zIndex: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  floatingCardWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 11,
    paddingHorizontal: 16,
  },
  floatingClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -12,
    right: -12,
  },
  floatingCloseText: { fontSize: 18, color: "#333" },

  // Updated bottom sheet styles
  filterSheetTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#1D3D47",
  },
});
