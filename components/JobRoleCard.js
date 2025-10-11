import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const JobRoleCard = ({ role, rank, onPress }) => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Memoize color and icon functions for better performance
  const getMatchColor = useCallback((percentage) => {
    if (percentage >= 80) return ["#10b981", "#06d6a0"];
    if (percentage >= 60) return ["#f59e0b", "#f97316"];
    return ["#ef4444", "#dc2626"];
  }, []);

  const getGrowthIcon = useCallback((potential) => {
    switch (potential?.toLowerCase()) {
      case "high":
        return "trending-up";
      case "medium":
        return "trending-flat";
      case "low":
        return "trending-down";
      default:
        return "help-outline";
    }
  }, []);

  const getGrowthColor = useCallback((potential) => {
    switch (potential?.toLowerCase()) {
      case "high":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  }, []);

  // Memoize computed values
  const matchColors = useMemo(() => getMatchColor(role.match_percentage), [role.match_percentage, getMatchColor]);
  const growthIcon = useMemo(() => getGrowthIcon(role.growth_potential), [role.growth_potential, getGrowthIcon]);
  const growthColor = useMemo(() => getGrowthColor(role.growth_potential), [role.growth_potential, getGrowthColor]);

  // new handler for View Details
  const handleViewDetails = (title) => {
    //console.log("Job Title:", title);
    router.push({
      pathname: "/map",
      params: { title: role.title }, // passing role.title
    });
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.rankContainer}>
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              style={styles.rankBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.rankText}>#{rank}</Text>
            </LinearGradient>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{role.title}</Text>
            <Text style={styles.industry}>
              <MaterialIcons name="business" size={14} color="#6b7280" />{" "}
              {role.industry || "General"}
            </Text>
          </View>

          <LinearGradient
            colors={matchColors}
            style={styles.matchBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.matchText}>{role.match_percentage}%</Text>
          </LinearGradient>
        </View>

        {/* Description */}
        <Text style={styles.reasoning}>{role.reasoning}</Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialIcons name="attach-money" size={18} color="#10b981" />
            <Text style={styles.infoText}>
              {role.salary_range || "Not specified"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons
              name={growthIcon}
              size={18}
              color={growthColor}
            />
            <Text
              style={[
                styles.infoText,
                { color: growthColor },
              ]}
            >
              {role.growth_potential || "Medium"} Growth
            </Text>
          </View>
        </View>

        {/* Skills Section */}
        {role.required_skills && role.required_skills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.skillsTitle}>
              <MaterialIcons name="star" size={16} color="#f59e0b" /> Required
              Skills:
            </Text>
            <View style={styles.skillsContainer}>
              {role.required_skills.slice(0, 6).map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
              {role.required_skills.length > 6 && (
                <View style={styles.skillChip}>
                  <Text style={styles.skillText}>
                    +{role.required_skills.length - 6}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <MaterialIcons name="psychology" size={16} color="#6366f1" />
            <Text style={styles.footerText}>AI Analyzed</Text>
          </View>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => handleViewDetails(role.title)}
          >
            <Text style={styles.expandText}>View Details</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  rankContainer: {
    marginRight: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
    lineHeight: 24,
  },
  industry: {
    fontSize: 13,
    color: "#6b7280",
    flexDirection: "row",
    alignItems: "center",
  },
  matchBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 50,
    alignItems: "center",
  },
  matchText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  reasoning: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 6,
    fontWeight: "500",
  },
  skillsSection: {
    marginBottom: 15,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillChip: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  skillText: {
    fontSize: 12,
    color: "#3730a3",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f4ff",
    borderRadius: 15,
  },
  expandText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
    marginRight: 4,
  },
});

export default JobRoleCard;
