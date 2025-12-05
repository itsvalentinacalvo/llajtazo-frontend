import React, { useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from "react";
import { View, StyleSheet, ImageSourcePropType, Platform } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Colors, BorderRadius } from "@/src/core/constants/theme";
import { MapEvent, COCHABAMBA_REGION, CATEGORY_CONFIG } from "../../constants/mapEvents";
import { MapContainerRef, MapContainerProps } from "./types";

function MarkerIcon({
  icon,
  iconLibrary,
}: {
  icon: string | ImageSourcePropType;
  iconLibrary: "feather" | "material" | "ionicons" | "fontawesome" | "image";
}) {
  const size = 20;
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
  onPress: () => void;
  zIndex: number;
}

const CustomMarker = React.memo(function CustomMarker({
  event,
  isSelected,
  onPress,
  zIndex,
}: CustomMarkerProps) {
  const config = CATEGORY_CONFIG[event.category];
  console.debug("[Home][CustomMarker] render", { id: event.id, isSelected });

  return (
    <Marker
      key={event.id}
      identifier={event.id}
      coordinate={event.coordinate}
      onPress={onPress}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={zIndex}
    >
      <View style={[styles.markerContainer, isSelected && styles.markerSelected]}>
        <View style={styles.markerBubble}>
          <View style={[styles.markerIconBox, { backgroundColor: config.color }]}>
            <MarkerIcon icon={config.icon} iconLibrary={config.iconLibrary} />
          </View>
        </View>
        <View style={styles.markerArrow} />
      </View>
    </Marker>
  );
});

export const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(
  function MapContainer({ events, selectedEventId, onSelectEvent }, ref) {
    const mapRef = useRef<MapView>(null);

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

    console.debug("[Home][MapContainer:native] render", { eventsLength: events?.length, selectedEventId });

    const markers = useMemo(() => {
      return events.map((event, index) => {
        const isSelected = selectedEventId === event.id;
        return (
          <CustomMarker
            key={event.id}
            event={event}
            isSelected={isSelected}
            onPress={() => onSelectEvent(event)}
            zIndex={isSelected ? 1000 : index}
          />
        );
      });
    }, [events, selectedEventId, onSelectEvent]);

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
  markerSelected: {
    transform: [{ scale: 1.15 }],
  },
  markerBubble: {
    backgroundColor: Colors.light.white,
    borderRadius: BorderRadius.sm,
    padding: 6,
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
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
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
