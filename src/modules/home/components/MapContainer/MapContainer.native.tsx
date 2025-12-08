import React, { useRef, useEffect, useImperativeHandle, forwardRef, useMemo, useState, useCallback } from "react";
import { View, StyleSheet, ImageSourcePropType, Platform, useWindowDimensions } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import Svg, { Rect, Polygon, G } from "react-native-svg";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring,
  runOnJS,
  cancelAnimation,
} from "react-native-reanimated";
import { Colors, BorderRadius } from "@/src/core/constants/theme";
import { MapEvent, COCHABAMBA_REGION, CATEGORY_CONFIG } from "../../constants/mapEvents";
import { MapContainerRef, MapContainerProps } from "./types";

function MarkerIcon({
  icon,
  iconLibrary,
  size,
}: {
  icon: string | ImageSourcePropType;
  iconLibrary: "feather" | "material" | "ionicons" | "fontawesome" | "image";
  size: number;
}) {
  const color = Colors.light.white;

  switch (iconLibrary) {
    case "image":
      return (
        <Image
          source={icon as ImageSourcePropType}
          style={{ width: size, height: size }}
          contentFit="contain"
        />
      );
    case "material":
      return <MaterialCommunityIcons name={icon as any} size={size} color={color} />;
    case "ionicons":
      return <Ionicons name={icon as any} size={size} color={color} />;
    case "fontawesome":
      return <FontAwesome name={icon as any} size={size} color={color} />;
    case "feather":
    default:
      return <Feather name={icon as any} size={size} color={color} />;
  }
}

interface CustomMarkerProps {
  event: MapEvent;
  isSelected: boolean;
  isVisible: boolean;
  onPress: () => void;
  zIndex: number;
  markerSize: number;
}

const ANIMATION_DURATION = 250;

const SVG_MARKER_SIZE = 60;
const SVG_PADDING = 6;
const SVG_ICON_BOX = 32;
const SVG_ARROW_HEIGHT = 8;
const SVG_BORDER_RADIUS = 8;
const SVG_TOTAL_HEIGHT = SVG_PADDING * 2 + SVG_ICON_BOX + SVG_ARROW_HEIGHT;
const SVG_TOTAL_WIDTH = SVG_PADDING * 2 + SVG_ICON_BOX;

const AndroidMarker = React.memo(function AndroidMarker({
  event,
  isSelected,
  isVisible,
  onPress,
  zIndex,
  markerSize,
}: CustomMarkerProps) {
  const config = CATEGORY_CONFIG[event.category];
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [tracksChanges, setTracksChanges] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setTracksChanges(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    if (tracksChanges) {
      const timer = setTimeout(() => setTracksChanges(false), 300);
      return () => clearTimeout(timer);
    }
  }, [tracksChanges, isSelected]);

  useEffect(() => {
    if (isSelected) {
      setTracksChanges(true);
    }
  }, [isSelected]);

  if (!shouldRender) return null;

  const scale = isSelected ? 1.15 : 1;
  const scaledWidth = SVG_TOTAL_WIDTH * scale;
  const scaledHeight = SVG_TOTAL_HEIGHT * scale;
  const iconSize = 18;

  const bubbleWidth = SVG_ICON_BOX + SVG_PADDING * 2;
  const bubbleHeight = SVG_ICON_BOX + SVG_PADDING * 2;
  const arrowWidth = 12;

  return (
    <Marker
      key={event.id}
      identifier={event.id}
      coordinate={event.coordinate}
      onPress={isVisible ? onPress : undefined}
      tracksViewChanges={tracksChanges}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={isVisible ? zIndex : -1}
      pointerEvents={isVisible ? "auto" : "none"}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <View style={{ width: scaledWidth, height: scaledHeight, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Svg width={scaledWidth} height={scaledHeight} viewBox={`0 0 ${SVG_TOTAL_WIDTH} ${SVG_TOTAL_HEIGHT}`}>
          <G>
            <Rect
              x={0}
              y={0}
              width={bubbleWidth}
              height={bubbleHeight}
              rx={SVG_BORDER_RADIUS}
              ry={SVG_BORDER_RADIUS}
              fill={Colors.light.white}
            />
            <Rect
              x={SVG_PADDING}
              y={SVG_PADDING}
              width={SVG_ICON_BOX}
              height={SVG_ICON_BOX}
              rx={SVG_BORDER_RADIUS}
              ry={SVG_BORDER_RADIUS}
              fill={config.color}
            />
            <Polygon
              points={`${bubbleWidth / 2 - arrowWidth / 2},${bubbleHeight - 1} ${bubbleWidth / 2 + arrowWidth / 2},${bubbleHeight - 1} ${bubbleWidth / 2},${SVG_TOTAL_HEIGHT}`}
              fill={Colors.light.white}
            />
          </G>
        </Svg>
        <View style={{
          position: 'absolute',
          top: SVG_PADDING * scale + (SVG_ICON_BOX * scale - iconSize) / 2,
          left: (scaledWidth - iconSize) / 2,
        }}>
          <MarkerIcon icon={config.icon} iconLibrary={config.iconLibrary} size={iconSize} />
        </View>
      </View>
    </Marker>
  );
});

const IOSMarker = React.memo(function IOSMarker({
  event,
  isSelected,
  isVisible,
  onPress,
  zIndex,
  markerSize,
}: CustomMarkerProps) {
  const config = CATEGORY_CONFIG[event.category];
  const scale = useSharedValue(isVisible ? 1 : 0);
  const opacity = useSharedValue(isVisible ? 1 : 0);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const isAnimatingOut = useRef(false);

  const hideMarker = useCallback(() => {
    if (!isAnimatingOut.current) return;
    setShouldRender(false);
    isAnimatingOut.current = false;
  }, []);

  useEffect(() => {
    cancelAnimation(scale);
    cancelAnimation(opacity);
    
    if (isVisible) {
      isAnimatingOut.current = false;
      setShouldRender(true);
      opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
      scale.value = withSpring(isSelected ? 1.15 : 1, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      isAnimatingOut.current = true;
      scale.value = withTiming(0.5, { duration: ANIMATION_DURATION });
      opacity.value = withTiming(0, { duration: ANIMATION_DURATION }, (finished) => {
        if (finished) {
          runOnJS(hideMarker)();
        }
      });
    }
  }, [isVisible, scale, opacity, hideMarker]);

  useEffect(() => {
    if (isVisible && shouldRender && !isAnimatingOut.current) {
      scale.value = withSpring(isSelected ? 1.15 : 1, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!shouldRender) return null;

  const iconSize = Math.max(14, markerSize * 0.5);
  const iconBoxSize = markerSize;
  const padding = Math.max(4, markerSize * 0.15);
  const arrowSize = Math.max(6, markerSize * 0.25);

  return (
    <Marker
      key={event.id}
      identifier={event.id}
      coordinate={event.coordinate}
      onPress={isVisible ? onPress : undefined}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={isVisible ? zIndex : -1}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <Animated.View style={[styles.markerContainer, animatedStyle]}>
        <View style={[styles.markerBubble, { padding }]}>
          <View style={[styles.markerIconBox, { backgroundColor: config.color, width: iconBoxSize, height: iconBoxSize, borderRadius: iconBoxSize * 0.25 }]}>
            <MarkerIcon icon={config.icon} iconLibrary={config.iconLibrary} size={iconSize} />
          </View>
        </View>
        <View style={[styles.markerArrow, { 
          borderLeftWidth: arrowSize, 
          borderRightWidth: arrowSize, 
          borderTopWidth: arrowSize 
        }]} />
      </Animated.View>
    </Marker>
  );
});

const CustomMarker = Platform.OS === "android" ? AndroidMarker : IOSMarker;

export const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(
  function MapContainer({ events, selectedEventId, onSelectEvent, selectedCategory }, ref) {
    const mapRef = useRef<MapView>(null);
    const { width: screenWidth } = useWindowDimensions();
    
    const markerSize = useMemo(() => {
      if (screenWidth < 350) return 28;
      if (screenWidth < 400) return 32;
      return 40;
    }, [screenWidth]);

    useImperativeHandle(ref, () => ({
      animateToEvent: (event: MapEvent) => {
        if (mapRef.current) {
          const region: Region = {
            latitude: event.coordinate.latitude,
            longitude: event.coordinate.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          mapRef.current.animateToRegion(region, 400);
        }
      },
    }));

    useEffect(() => {
      if (selectedEventId && mapRef.current) {
        const selectedEvent = events.find((e) => e.id === selectedEventId);
        if (selectedEvent) {
          const region: Region = {
            latitude: selectedEvent.coordinate.latitude,
            longitude: selectedEvent.coordinate.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          mapRef.current.animateToRegion(region, 400);
        }
      }
    }, [selectedEventId, events]);

    const markers = useMemo(() => {
      return events.map((event, index) => {
        const isSelected = selectedEventId === event.id;
        const config = CATEGORY_CONFIG[event.category];
        const isVisible = !selectedCategory || 
          config.label.toLowerCase() === selectedCategory.toLowerCase();
        
        return (
          <CustomMarker
            key={event.id}
            event={event}
            isSelected={isSelected}
            isVisible={isVisible}
            onPress={() => onSelectEvent(event)}
            zIndex={isSelected ? 1000 : index}
            markerSize={markerSize}
          />
        );
      });
    }, [events, selectedEventId, selectedCategory, onSelectEvent, markerSize]);

    return (
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={COCHABAMBA_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {markers}
      </MapView>
    );
  }
);

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  markerBubble: {
    backgroundColor: Colors.light.white,
    borderRadius: BorderRadius.sm,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  markerIconBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Colors.light.white,
    marginTop: -1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
