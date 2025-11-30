// Jest global setup: mocks compartidos para tests
// Definir mocks globales reutilizables
global.mockNavigate = jest.fn();
global.mockGoBack = jest.fn();

// Route mock for screens that receive params
global.mockRoute = { params: {} };

// Navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: global.mockNavigate,
    goBack: global.mockGoBack,
  }),
  useRoute: () => global.mockRoute,
}));

// Safe area y header
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("@react-navigation/elements", () => ({ useHeaderHeight: () => 0 }));

// LinearGradient simplificado
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { LinearGradient: (props) => React.createElement(View, props) };
});

// Mock icons to avoid async state updates inside icon components during tests
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Feather: (props) => React.createElement(Text, null, props.name || "icon"),
  };
});

// Componentes de Auth (mocks simples para tests unitarios)
jest.mock("@/src/modules/auth/components/AuthInput", () => {
  const React = require("react");
  const { View, TextInput, Text } = require("react-native");
  return (props) =>
    React.createElement(View, null,
      React.createElement(TextInput, { ...props, testID: props.placeholder }),
      props.error && props.error.trim() ? React.createElement(Text, null, props.error) : null
    );
});

jest.mock("@/src/modules/auth/components/PrimaryButton", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");
  // Respect `disabled` prop so tests can verify disabled state
  return (props) =>
    React.createElement(
      Pressable,
      { onPress: props.disabled ? undefined : props.onPress },
      React.createElement(Text, null, props.title),
    );
});

jest.mock("@/src/modules/auth/components/SocialButton", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");
  return (props) =>
    React.createElement(
      Pressable,
      { onPress: props.onPress },
      React.createElement(Text, null, props.title),
    );
});

jest.mock("@/src/modules/auth/components/Divider", () => {
  const React = require("react");
  const { View } = require("react-native");
  return () => React.createElement(View, null);
});

// Mock CodeInput used in VerificationScreen
jest.mock("@/src/modules/auth/components/CodeInput", () => {
  const React = require("react");
  const { View, TextInput, Text } = require("react-native");
  // This mock forwards text changes to onComplete and onCodeChange so tests can simulate entering the code
  return (props) =>
    React.createElement(View, null,
      React.createElement(TextInput, {
        testID: "code-input",
        onChangeText: (text) => {
          props.onComplete && props.onComplete(text);
          props.onCodeChange && props.onCodeChange(text);
        },
      }),
      props.error ? React.createElement(Text, null, props.error) : null
    );
});

// Exportar named `ScreenKeyboardAwareScrollView` para coincidir con importaciones
jest.mock("@/src/core/components/ScreenKeyboardAwareScrollView", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ScreenKeyboardAwareScrollView: ({ children }) =>
      React.createElement(View, null, children),
  };
});

// Global mocks para componentes de layout y hooks usados en varias pantallas
jest.mock("@/src/core/components/ScreenScrollView", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ScreenScrollView: ({ children }) =>
      React.createElement(View, null, children),
  };
});

jest.mock("@/src/core/components/ThemedText", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: (props) => React.createElement(Text, props, props.children),
  };
});

jest.mock("@/src/core/hooks/useTheme", () => {
  return { useTheme: () => ({ theme: "light" }) };
});

// Optional: limpiar mocks antes de cada test (si prefieres centralizarlo aquí)
beforeEach(() => {
  jest.clearAllMocks();
  global.mockRoute = { params: {} };
});
