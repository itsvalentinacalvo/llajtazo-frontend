import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  Platform,
  Alert,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  Image as RNImage,
} from "react-native";
import type { ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScreenKeyboardAwareScrollView } from "@/src/core/components/ScreenKeyboardAwareScrollView";
import { addDraftEvent } from "@/src/core/test/testDatabase";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";
import type { BusinessStackParamList } from "@/src/modules/business/navigation/BusinessNavigator";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/src/core/constants/theme";
import { interests } from "@/src/modules/auth/screens/InterestsScreen";
import { ImageAdjustments } from "@/src/modules/business/components/ImageAdjustments";
import RICHEDITTEXT, { RICHEDITTEXTRef } from "@/src/modules/business/components/RichEditText";
import {
  EventFormData,
  EventImageData,
  Ticket,
} from "@/src/modules/business/types/event";
import { MiniMapPicker } from "@/src/modules/business/components/MiniMapPicker";
import {
  EVENT_IMAGE_FRAME_HEIGHT,
  clamp,
  getImageMetrics,
} from "@/src/modules/business/utils/imageAdjustment";
import { buildEventDetailFromForm, OrganizerLite } from "@/src/core/test/eventDetailData";

const eventTags = interests
  .filter((i) => !i.isHidden)
  .slice(0, 8);

const SCREEN_HEIGHT = Dimensions.get("window").height;

type NavigationProp = NativeStackNavigationProp<BusinessStackParamList>;
type EditEventRouteProp = RouteProp<{ EditEvento: { eventId?: string } }, "EditEvento">;

export default function NuevoEventoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditEventRouteProp>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { events, updateEvent } = useBusiness();
  
  const eventId = route.params?.eventId;
  const isEditMode = Boolean(eventId);
  const existingEvent = isEditMode ? events.find((e) => e.id === eventId) : null;
  const [step, setStep] = useState<1 | 2>(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [imageFrameWidth, setImageFrameWidth] = useState(0);
  const [pendingImageForAdjust, setPendingImageForAdjust] = useState<EventImageData | null>(null);
  const [showImageAdjuster, setShowImageAdjuster] = useState(false);

  const modalTranslateY = useRef(new Animated.Value(0)).current;
  const editorRef = useRef<RICHEDITTEXTRef | null>(null);


  const [formData, setFormData] = useState<EventFormData>({
    eventImage: null,
    title: "",
    subtitle: "",
    details: "",
    tags: [],
    dateTime: new Date(),
    locationName: "",
    googleMapsLink: "",
    latitude: undefined,
    longitude: undefined,
    mapImage: null,
    tickets: [],
    spotifyUrl: "",
    youtubeVideo: "",
  });

  const [ticketForm, setTicketForm] = useState({
    name: "",
    price: "",
    fee: "",
    stock: "",
    isPaid: true,
    minPerPurchase: "",
    maxPerPurchase: "",
  });

  const [step1Error, setStep1Error] = useState("");
  const [ticketError, setTicketError] = useState("");

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          Animated.timing(modalTranslateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowCreateTicket(false);
            modalTranslateY.setValue(0);
          });
        } else {
          Animated.spring(modalTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (!pendingImageForAdjust || !imageFrameWidth) {
      return;
    }
    setShowImageAdjuster(true);
    setPendingImageForAdjust(null);
  }, [pendingImageForAdjust, imageFrameWidth]);

  useEffect(() => {
    if (!formData.eventImage || !imageFrameWidth) {
      return;
    }

    const { minOffset } = getImageMetrics(
      formData.eventImage,
      imageFrameWidth,
      EVENT_IMAGE_FRAME_HEIGHT
    );
    const clampedOffset = clamp(formData.eventImage.offsetY, minOffset, 0);

    if (clampedOffset !== formData.eventImage.offsetY) {
      setFormData((prev) => {
        if (!prev.eventImage) {
          return prev;
        }
        return {
          ...prev,
          eventImage: {
            ...prev.eventImage,
            offsetY: clampedOffset,
          },
        };
      });
    }
  }, [formData.eventImage?.width, formData.eventImage?.height, formData.eventImage?.offsetY, imageFrameWidth]);

  useEffect(() => {
    if (!isEditMode || !existingEvent) return;

    const startTimeIso = (existingEvent as any).startTimeIso as string | undefined;
    const descriptionHTML = (existingEvent as any).descriptionHTML as string | undefined;
    const spotifyEmbedUrl = (existingEvent as any).spotifyEmbedUrl as string | undefined;
    const spotifyPlaylistUrl = (existingEvent as any).spotifyPlaylist as string | undefined;
    const googleMapsLink = (existingEvent as any).googleMapsLink as string | undefined;
    const latitude = (existingEvent as any).latitude as number | undefined;
    const longitude = (existingEvent as any).longitude as number | undefined;
    const sectorImage = (existingEvent as any).sectorImage as { uri?: string } | undefined;
    const tickets = (existingEvent.tickets || []).map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
      fee: 0,
      stock: t.available ? 100 : 0,
      isPaid: (t.price || 0) > 0,
      minPerPurchase: 1,
      maxPerPurchase: 10,
    }));

    setFormData({
      eventImage: typeof existingEvent.image === "object" && "uri" in existingEvent.image
        ? { uri: (existingEvent.image as { uri: string }).uri, width: 0, height: 0, offsetY: 0 }
        : null,
      title: existingEvent.title,
      subtitle: existingEvent.subtitle || "",
      details: descriptionHTML || "",
      tags: existingEvent.tags || [],
      dateTime: startTimeIso ? new Date(startTimeIso) : new Date(),
      locationName: existingEvent.location || "",
      googleMapsLink: googleMapsLink || "",
      latitude,
      longitude,
      mapImage: sectorImage && "uri" in sectorImage ? (sectorImage as any).uri : null,
      tickets,
      spotifyUrl: spotifyPlaylistUrl || spotifyEmbedUrl || "",
      youtubeVideo: "",
    });
  }, [isEditMode, existingEvent]);

  const requestMediaPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu galeria para subir imagenes."
      );
      return false;
    }
    return true;
  }, []);

  const handlePickEventImage = useCallback(async () => {
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) return;

    const mediaType = (ImagePicker as any).MediaType?.IMAGES
      ? [(ImagePicker as any).MediaType.IMAGES]
      : ImagePicker.MediaTypeOptions.Images;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.uri;

      const applyImageData = (width: number, height: number) => {
        const imageData: EventImageData = {
          uri,
          width,
          height,
          offsetY: 0,
        };
        setFormData((prev) => ({ ...prev, eventImage: imageData }));
        setPendingImageForAdjust(imageData);
      };

      RNImage.getSize(
        uri,
        (width, height) => applyImageData(width, height),
        () => applyImageData(asset.width ?? 1920, asset.height ?? 1080)
      );
    }
  }, [requestMediaPermission]);

  const handlePickMapImage = useCallback(async () => {
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) return;

    const mediaType2 = (ImagePicker as any).MediaType?.IMAGES
      ? [(ImagePicker as any).MediaType.IMAGES]
      : ImagePicker.MediaTypeOptions.Images;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType2,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData((prev) => ({ ...prev, mapImage: result.assets[0].uri }));
    }
  }, [requestMediaPermission]);

  const handleAdjustImage = useCallback(() => {
    if (!formData.eventImage) {
      return;
    }

    if (imageFrameWidth <= 0) {
      setPendingImageForAdjust(formData.eventImage);
      return;
    }

    setShowImageAdjuster(true);
  }, [formData.eventImage, imageFrameWidth]);

  const handleCancelImageAdjust = useCallback(() => {
    setShowImageAdjuster(false);
  }, []);

  const handleConfirmImageAdjust = useCallback((offsetY: number) => {
    setFormData((prev) => {
      if (!prev.eventImage) {
        return prev;
      }

      return {
        ...prev,
        eventImage: {
          ...prev.eventImage,
          offsetY,
        },
      };
    });
    setShowImageAdjuster(false);
  }, []);

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (selectedDate) {
        const newDate = new Date(formData.dateTime);
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());
        setFormData((prev) => ({ ...prev, dateTime: newDate }));
        setTimeout(() => setShowTimePicker(true), 100);
      }
    } else if (selectedDate) {
      setFormData((prev) => ({ ...prev, dateTime: selectedDate }));
    }
  };

  const handleTimeChange = (_event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const newDate = new Date(formData.dateTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFormData((prev) => ({ ...prev, dateTime: newDate }));
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const formatDateTime = (date: Date) =>
    date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleNextStep = () => {
    if (!formData.title.trim()) {
      setStep1Error("El titulo del evento es requerido");
      return;
    }
    if (formData.tags.length === 0) {
      setStep1Error("Selecciona al menos una etiqueta");
      return;
    }
    if (!formData.locationName.trim()) {
      setStep1Error("El nombre del lugar es requerido");
      return;
    }
    setStep1Error("");
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSaveEvent = () => {
    if (isEditMode && eventId) {
      const eventDate = new Date(formData.dateTime);
      const formatDateForCard = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
        const month = months[date.getMonth()];
        return `${day} DE ${month}`;
      };
      const formatTimeForCard = (date: Date) => {
        return date.toLocaleTimeString("es-ES", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).toUpperCase();
      };
      
      updateEvent(eventId, {
        title: formData.title,
        subtitle: formData.subtitle,
        date: formatDateForCard(eventDate),
        time: formatTimeForCard(eventDate),
        location: formData.locationName,
        tags: formData.tags,
        image: formData.eventImage?.uri 
          ? { uri: formData.eventImage.uri } 
          : existingEvent?.image,
        // pass through spotify for preview/edit screens
        spotifyUrl: formData.spotifyUrl || (existingEvent as any)?.spotifyUrl || "",
        // persist coordinates and maps link so Preview/EventDetail can render MiniMap
        latitude: formData.latitude,
        longitude: formData.longitude,
        googleMapsLink: formData.googleMapsLink,
      } as any);
      
      Alert.alert("Evento actualizado", "Los cambios han sido guardados.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      // Build EventDetail for preview using the form data and organizer context
      try {
        const organizer: OrganizerLite = {
          id: 502,
          name: "Alice Park",
          avatar: require("@/src/core/assets/events/alice-park/profile.jpg"),
        };

        const eventDetail = buildEventDetailFromForm(
          {
            id: eventId,
            title: formData.title,
            subtitle: formData.subtitle,
            detailsHtml: formData.details, // rich HTML from editor, includes age/reembolso
            dateTime: formData.dateTime,
            eventImage: formData.eventImage ? { uri: formData.eventImage.uri, width: formData.eventImage.width, height: formData.eventImage.height, offsetY: formData.eventImage.offsetY } : null,
            locationName: formData.locationName,
            locationAddress: "",
            latitude: formData.latitude,
            longitude: formData.longitude,
            tickets: (formData.tickets || []).map((t) => ({
              id: t.id,
              name: t.name,
              price: t.price,
              currency: "Bs.",
              available: true,
            })),
            spotifyPlaylist: formData.spotifyUrl,
            category: "musica",
            // tags preserved for EventDetail
            // @ts-ignore
            tags: formData.tags,
            // include Google Maps link for preview
            // @ts-ignore
            googleMapsLink: formData.googleMapsLink,
          },
          organizer
        );

        // Navigate to preview screen with the built detail
        // Adjust route name/params to your navigator setup if needed
        // @ts-ignore
        navigation.navigate("PreviewEvent", { eventDetail });
      } catch (e) {
        console.warn("Failed to build event detail", e);
      }
    }
  };

  const handleCreateTicket = () => {
    if (!ticketForm.name.trim()) {
      setTicketError("El nombre del ticket es requerido");
      return;
    }
    if (!ticketForm.stock.trim() || parseInt(ticketForm.stock) <= 0) {
      setTicketError("El stock debe ser mayor a 0");
      return;
    }
    if (ticketForm.isPaid && (!ticketForm.price.trim() || parseFloat(ticketForm.price) <= 0)) {
      setTicketError("El precio debe ser mayor a 0");
      return;
    }

    setTicketError("");
    const newTicket: Ticket = {
      id: Date.now().toString(),
      name: ticketForm.name.trim(),
      price: parseFloat(ticketForm.price) || 0,
      fee: parseFloat(ticketForm.fee) || 0,
      stock: parseInt(ticketForm.stock) || 0,
      isPaid: ticketForm.isPaid,
      minPerPurchase: parseInt(ticketForm.minPerPurchase) || 1,
      maxPerPurchase: parseInt(ticketForm.maxPerPurchase) || 10,
    };

    setFormData((prev) => ({
      ...prev,
      tickets: [...prev.tickets, newTicket],
    }));

    setTicketForm({
      name: "",
      price: "",
      fee: "",
      stock: "",
      isPaid: true,
      minPerPurchase: "",
      maxPerPurchase: "",
    });
    setShowCreateTicket(false);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setFormData((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((t) => t.id !== ticketId),
    }));
  };

  const calculateClientPrice = () => {
    const price = parseFloat(ticketForm.price) || 0;
    const fee = parseFloat(ticketForm.fee) || 0;
    return price + fee;
  };

  const calculateServiceFee = () => {
    const price = parseFloat(ticketForm.price) || 0;
    return price * 0.05;
  };

  const calculateNetReceived = () => {
    const clientPays = calculateClientPrice();
    const serviceFee = calculateServiceFee();
    return clientPays - serviceFee;
  };

  const renderStep1 = () => (
    <>
      <View
        style={[styles.imageUploader, { backgroundColor: theme.backgroundSecondary }]}
        onLayout={(event) => setImageFrameWidth(event.nativeEvent.layout.width)}
      >
        {formData.eventImage ? (
          <>
            <Image
              source={{ uri: formData.eventImage.uri }}
              style={[
                styles.eventImage,
                imageFrameWidth
                  ? {
                      width: imageFrameWidth,
                      height: getImageMetrics(
                        formData.eventImage,
                        imageFrameWidth,
                        EVENT_IMAGE_FRAME_HEIGHT
                      ).scaledHeight,
                      transform: [{ translateY: formData.eventImage.offsetY }],
                    }
                  : null,
              ]}
              contentFit="cover"
            />
            <View style={styles.imageActionsRow} pointerEvents="box-none">
              <Pressable style={styles.imageActionButton} onPress={handleAdjustImage}>
                <Feather name="move" size={16} color="#FFFFFF" />
                <ThemedText style={styles.imageActionButtonText}>Ajustar</ThemedText>
              </Pressable>
              <Pressable style={styles.imageActionButton} onPress={handlePickEventImage}>
                <Feather name="refresh-cw" size={16} color="#FFFFFF" />
                <ThemedText style={styles.imageActionButtonText}>Cambiar</ThemedText>
              </Pressable>
            </View>
          </>
        ) : (
          <Pressable
            style={styles.imagePlaceholder}
            onPress={handlePickEventImage}
          >
            <Feather name="camera" size={32} color={theme.textSecondary} />
            <ThemedText style={[styles.uploadHint, { color: theme.textSecondary }] }>
              Toca para subir imagen (16:9)
            </ThemedText>
          </Pressable>
        )}
      </View>

      <ThemedText style={styles.label}>
        Titulo del evento<ThemedText style={styles.required}>*</ThemedText>
      </ThemedText>
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
        value={formData.title}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
        placeholder=""
        placeholderTextColor={theme.textSecondary}
      />

      <ThemedText style={styles.label}>Subtitulo del evento</ThemedText>
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
        value={formData.subtitle}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, subtitle: text }))}
        placeholder=""
        placeholderTextColor={theme.textSecondary}
      />

      <ThemedText style={styles.label}>Detalles del evento</ThemedText>
      <RICHEDITTEXT
        ref={editorRef}
        value={formData.details}
        onChange={(html) =>
          setFormData((prev) => ({ ...prev, details: html }))
        }
        placeholder="Escribe los detalles del evento..."
        theme={theme}
        editorStyle={styles.eventDetailsEditor as ViewStyle}
      />


      <ThemedText style={styles.label}>
        Etiquetas<ThemedText style={styles.required}>*</ThemedText>
      </ThemedText>
      <View style={styles.tagsContainer}>
        {eventTags.map((tag) => {
          const isSelected = formData.tags.includes(tag.id);
          return (
            <Pressable
              key={tag.id}
              style={[
                styles.tagPill,
                {
                  backgroundColor: isSelected ? Colors.light.primary : "transparent",
                  borderColor: Colors.light.primary,
                },
              ]}
              onPress={() => toggleTag(tag.id)}
            >
              <ThemedText
                style={[
                  styles.tagText,
                  { color: isSelected ? "#FFFFFF" : Colors.light.primary },
                ]}
              >
                {tag.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ThemedText style={styles.label}>
        Fecha y Hora<ThemedText style={styles.required}>*</ThemedText>
      </ThemedText>
      <Pressable
        style={[styles.input, styles.dateInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}
        onPress={openDatePicker}
      >
        <ThemedText style={{ color: theme.text }}>{formatDateTime(formData.dateTime)}</ThemedText>
        <Feather name="calendar" size={20} color={theme.textSecondary} />
      </Pressable>

      {Platform.OS === "ios" && showDatePicker ? (
        <View style={[styles.iosDatePickerContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <View style={styles.iosDatePickerHeader}>
            <Pressable onPress={() => setShowDatePicker(false)}>
              <ThemedText style={{ color: Colors.light.primary }}>Cancelar</ThemedText>
            </Pressable>
            <Pressable onPress={() => setShowDatePicker(false)}>
              <ThemedText style={{ color: Colors.light.primary, fontWeight: "600" }}>Listo</ThemedText>
            </Pressable>
          </View>
          <DateTimePicker
            value={formData.dateTime}
            mode="datetime"
            display="spinner"
            onChange={handleDateChange}
            locale="es-ES"
            style={{ height: 200 }}
          />
        </View>
      ) : null}

      {Platform.OS === "android" && showDatePicker ? (
        <DateTimePicker
          value={formData.dateTime}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      ) : null}

      {Platform.OS === "android" && showTimePicker ? (
        <DateTimePicker
          value={formData.dateTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      ) : null}

      <ThemedText style={styles.label}>
        Nombre del lugar <ThemedText style={styles.required}>*</ThemedText>
      </ThemedText>
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
        value={formData.locationName}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, locationName: text }))}
        placeholder=""
        placeholderTextColor={theme.textSecondary}
      />

      <ThemedText style={styles.label}>Enlace a Google Maps</ThemedText>
      <MiniMapPicker
        latitude={formData.latitude}
        longitude={formData.longitude}
        onChange={(lat, lng) => {
          setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng, googleMapsLink: `https://www.google.com/maps?q=${lat},${lng}` }));
        }}
      />
      <ThemedText style={styles.label}>Mapa General</ThemedText>
      <Pressable
        style={[styles.uploadButton, { borderColor: Colors.light.primary }]}
        onPress={handlePickMapImage}
      >
        <ThemedText style={[styles.uploadButtonText, { color: Colors.light.primary }]}>SUBIR IMAGEN</ThemedText>
      </Pressable>
      {formData.mapImage ? (
        <View style={styles.mapPreviewContainer}>
          <Image source={{ uri: formData.mapImage }} style={styles.mapPreview} contentFit="cover" />
          <Pressable
            style={styles.removeMapButton}
            onPress={() => setFormData((prev) => ({ ...prev, mapImage: null }))}
          >
            <Feather name="x" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : null}

      {step1Error ? (
        <ThemedText style={styles.errorText}>{step1Error}</ThemedText>
      ) : null}

      <Pressable style={styles.nextButton} onPress={handleNextStep}>
        <ThemedText style={styles.nextButtonText}>SIGUIENTE</ThemedText>
        <Feather name="arrow-right" size={20} color="#FFFFFF" />
      </Pressable>
    </>
  );

  const renderStep2 = () => (
    <>
      {/* existing Step 2 UI omitted in snippet */}
      <ThemedText style={styles.label}>
        Crear Tickets <ThemedText style={styles.required}>*</ThemedText>
      </ThemedText>

      <View style={[styles.ticketsTable, { borderColor: theme.inputBorder }]}>
        <View style={[styles.tableHeader, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={[styles.tableHeaderText, { flex: 0.5 }]}>Nro</ThemedText>
          <ThemedText style={[styles.tableHeaderText, { flex: 1 }]}>Ticket</ThemedText>
          <ThemedText style={[styles.tableHeaderText, { flex: 1 }]}>Precio</ThemedText>
          <ThemedText style={[styles.tableHeaderText, { flex: 1 }]}>Acciones</ThemedText>
        </View>

        {formData.tickets.length === 0 ? (
          <View style={styles.emptyTickets}>
            <Feather name="info" size={16} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              No existen tickets
            </ThemedText>
          </View>
        ) : (
          formData.tickets.map((ticket, index) => (
            <View key={ticket.id} style={[styles.tableRow, { borderTopColor: theme.inputBorder }]}>
              <ThemedText style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</ThemedText>
              <ThemedText style={[styles.tableCell, { flex: 1 }]}>{ticket.name}</ThemedText>
              <ThemedText style={[styles.tableCell, { flex: 1 }]}>
                {ticket.isPaid ? `Bs. ${ticket.price}` : "Gratis"}
              </ThemedText>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                <Pressable onPress={() => handleDeleteTicket(ticket.id)}>
                  <Feather name="trash-2" size={18} color={theme.error} />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      <Pressable style={styles.createTicketButton} onPress={() => setShowCreateTicket(true)}>
        <ThemedText style={styles.createTicketText}>CREAR +</ThemedText>
      </Pressable>

      <ThemedText style={[styles.label, { marginTop: Spacing.xl }]}>Playlist de Spotify</ThemedText>
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
        value={formData.spotifyUrl}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, spotifyUrl: text }))}
        placeholder=""
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
      />

      <ThemedText style={styles.label}>Video de Youtube</ThemedText>
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
        value={formData.youtubeVideo}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, youtubeVideo: text }))}
        placeholder=""
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
      />

      <Pressable style={[styles.nextButton, { marginTop: Spacing["3xl"] }]} onPress={handleSaveEvent}>
        <ThemedText style={styles.nextButtonText}>{isEditMode ? "GUARDAR CAMBIOS" : "GUARDAR"}</ThemedText>
      </Pressable>
    </>
  );

  const renderCreateTicketModal = () => (
    <Modal
      visible={showCreateTicket}
      animationType="slide"
      transparent
      onRequestClose={() => setShowCreateTicket(false)}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { backgroundColor: theme.backgroundRoot },
            { transform: [{ translateY: modalTranslateY }] },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.modalHandleArea}>
            <View style={styles.modalHandle} />
            <ThemedText style={styles.swipeHint}>Desliza hacia abajo para cerrar</ThemedText>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedText style={styles.modalTitle}>Crear Tickets</ThemedText>

            <ThemedText style={styles.modalLabel}>Informacion basica</ThemedText>

            <View style={styles.ticketTypeToggle}>
              <Pressable
                style={[
                  styles.toggleButton,
                  ticketForm.isPaid && styles.toggleButtonActive,
                ]}
                onPress={() => setTicketForm((prev) => ({ ...prev, isPaid: true }))}
              >
                <ThemedText style={[styles.toggleText, ticketForm.isPaid && styles.toggleTextActive]}>
                  Pago
                </ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleButton,
                  !ticketForm.isPaid && styles.toggleButtonActive,
                ]}
                onPress={() => setTicketForm((prev) => ({ ...prev, isPaid: false }))}
              >
                <ThemedText style={[styles.toggleText, !ticketForm.isPaid && styles.toggleTextActive]}>
                  Sin Costo
                </ThemedText>
              </Pressable>
            </View>

            <ThemedText style={styles.modalInputLabel}>
              Nombre <ThemedText style={styles.required}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
              value={ticketForm.name}
              onChangeText={(text) => setTicketForm((prev) => ({ ...prev, name: text }))}
              placeholder=""
              placeholderTextColor={theme.textSecondary}
            />

            {ticketForm.isPaid ? (
              <View style={styles.priceRow}>
                <View style={styles.priceField}>
                  <ThemedText style={styles.modalInputLabel}>
                    Precio<ThemedText style={styles.required}>*</ThemedText>
                  </ThemedText>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                    value={ticketForm.price}
                    onChangeText={(text) => setTicketForm((prev) => ({ ...prev, price: text }))}
                    placeholder=""
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.priceField}>
                  <ThemedText style={styles.modalInputLabel}>
                    Fee <ThemedText style={styles.required}>*</ThemedText>
                  </ThemedText>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                    value={ticketForm.fee}
                    onChangeText={(text) => setTicketForm((prev) => ({ ...prev, fee: text }))}
                    placeholder=""
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.priceField}>
                  <ThemedText style={styles.modalInputLabel}>
                    Stock <ThemedText style={styles.required}>*</ThemedText>
                  </ThemedText>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                    value={ticketForm.stock}
                    onChangeText={(text) => setTicketForm((prev) => ({ ...prev, stock: text }))}
                    placeholder=""
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            ) : (
              <View style={styles.priceField}>
                <ThemedText style={styles.modalInputLabel}>
                  Stock <ThemedText style={styles.required}>*</ThemedText>
                </ThemedText>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                  value={ticketForm.stock}
                  onChangeText={(text) => setTicketForm((prev) => ({ ...prev, stock: text }))}
                  placeholder=""
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            )}

            <ThemedText style={styles.modalLabel}>Detalle</ThemedText>

            <View style={styles.detailRow}>
              <View>
                <ThemedText style={styles.detailTitle}>Tu cliente paga</ThemedText>
                <ThemedText style={[styles.detailSubtitle, { color: theme.textSecondary }]}>
                  Precio del Ticket + Fee
                </ThemedText>
              </View>
              <ThemedText style={styles.detailValue}>Bs. {calculateClientPrice().toFixed(0)}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <View>
                <ThemedText style={styles.detailTitle}>Comision por servicio</ThemedText>
                <ThemedText style={[styles.detailSubtitle, { color: theme.textSecondary }]}>
                  5% del precio del ticket
                </ThemedText>
              </View>
              <ThemedText style={styles.detailValue}>- Bs. {calculateServiceFee().toFixed(0)}</ThemedText>
            </View>

            <View style={[styles.detailRow, styles.highlightRow, { backgroundColor: theme.backgroundSecondary }]}>
              <View>
                <ThemedText style={[styles.detailTitle, { fontWeight: "600" }]}>Tu recibes</ThemedText>
                <ThemedText style={[styles.detailSubtitle, { color: theme.textSecondary }]}>
                  Precio del cliente - fee
                </ThemedText>
              </View>
              <ThemedText style={[styles.detailValue, { fontWeight: "700" }]}>
                Bs. {calculateNetReceived().toFixed(0)}
              </ThemedText>
            </View>

            <ThemedText style={[styles.modalInputLabel, { marginTop: Spacing.lg }]}>
              Cantidad de Tickets por compra
            </ThemedText>
            <View style={styles.quantityRow}>
              <TextInput
                style={[styles.quantityInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                value={ticketForm.minPerPurchase}
                onChangeText={(text) => setTicketForm((prev) => ({ ...prev, minPerPurchase: text }))}
                placeholder="Minimo"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.quantityInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                value={ticketForm.maxPerPurchase}
                onChangeText={(text) => setTicketForm((prev) => ({ ...prev, maxPerPurchase: text }))}
                placeholder="Maximo"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>

            {ticketError ? (
              <ThemedText style={styles.errorText}>{ticketError}</ThemedText>
            ) : null}

            <Pressable style={styles.createTicketSubmitButton} onPress={handleCreateTicket}>
              <ThemedText style={styles.nextButtonText}>CREAR TICKET</ThemedText>
            </Pressable>

            <View style={{ height: insets.bottom + Spacing.md }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        {step === 2 ? (
          <Pressable onPress={handlePrevStep} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </Pressable>
        ) : (
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="x" size={24} color={theme.text} />
          </Pressable>
        )}
        <ThemedText style={styles.headerTitle}>{isEditMode ? "Editar Evento" : "Nuevo Evento"}</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScreenKeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 ? renderStep1() : renderStep2()}
        <View style={{ height: insets.bottom + Spacing.xl }} />
      </ScreenKeyboardAwareScrollView>

      <ImageAdjustments
        visible={showImageAdjuster}
        image={formData.eventImage}
        frameWidth={imageFrameWidth}
        frameHeight={EVENT_IMAGE_FRAME_HEIGHT}
        onCancel={handleCancelImageAdjust}
        onSave={handleConfirmImageAdjust}
        theme={theme}
      />
      {renderCreateTicketModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  imageUploader: {
    height: EVENT_IMAGE_FRAME_HEIGHT,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
    overflow: "hidden",
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  eventDetailsEditor: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  imageActionsRow: {
    position: "absolute",
    bottom: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  imageActionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  uploadHint: {
    fontSize: 13,
  },
  label: {
    fontSize: 14,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  required: {
    color: Colors.light.error,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iosDatePickerContainer: {
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    overflow: "hidden",
  },
  iosDatePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  tagPill: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
  },
  uploadButton: {
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    alignSelf: "center",
    marginTop: Spacing.sm,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  mapPreviewContainer: {
    position: "relative",
    marginTop: Spacing.md,
  },
  mapPreview: {
    width: "100%",
    height: 140,
    borderRadius: BorderRadius.xs,
  },
  removeMapButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.sm,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing["3xl"],
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  ticketsTable: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderTopWidth: 1,
  },
  tableCell: {
    fontSize: 14,
    textAlign: "center",
  },
  emptyTickets: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
  },
  createTicketButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.sm,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  createTicketText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    maxHeight: "90%",
  },
  modalHandleArea: {
    alignItems: "center",
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#CCCCCC",
    borderRadius: 2,
  },
  swipeHint: {
    fontSize: 11,
    color: "#999999",
    marginTop: Spacing.xs,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.lg,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  modalInputLabel: {
    fontSize: 14,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  modalInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
  },
  ticketTypeToggle: {
    flexDirection: "row",
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  priceRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  priceField: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  highlightRow: {
    borderRadius: BorderRadius.xs,
    borderBottomWidth: 0,
    marginTop: Spacing.sm,
  },
  detailTitle: {
    fontSize: 14,
  },
  detailSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  detailValue: {
    fontSize: 16,
  },
  quantityRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  quantityInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    textAlign: "center",
  },
  createTicketSubmitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.sm,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 13,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
