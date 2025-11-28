import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import InterestsScreen from "@/src/modules/auth/screens/InterestsScreen";

describe("InterestsScreen", () => {
  const navigationMock = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza título y subtítulo", () => {
    const { getByText } = render(<InterestsScreen navigation={navigationMock} /> as any);
    expect(getByText("Selecciona")).toBeTruthy();
    expect(getByText("Algunas palabras clave que describan tus intereses")).toBeTruthy();
  });

  it("permite seleccionar varios intereses sin navegar", () => {
    const { getByText } = render(<InterestsScreen navigation={navigationMock} /> as any);
    const teatro = getByText("Teatro");
    const musica = getByText("Música");

    fireEvent.press(teatro);
    fireEvent.press(musica);

    // Seleccionar no debe navegar inmediatamente
    expect(navigationMock.navigate).not.toHaveBeenCalled();
  });

  it("navega al presionar FINALIZAR", () => {
    const { getByText } = render(<InterestsScreen navigation={navigationMock} /> as any);
    const finalizar = getByText("FINALIZAR");
    fireEvent.press(finalizar);
    expect(navigationMock.navigate).toHaveBeenCalledWith("MainApp", { screen: "Home" });
  });
});
