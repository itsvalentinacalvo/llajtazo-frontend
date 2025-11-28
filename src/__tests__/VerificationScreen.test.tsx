import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import VerificationScreen from "@/src/modules/auth/screens/VerificationScreen";

describe("VerificationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renderiza el título correctamente", () => {
    const { getByText } = render(<VerificationScreen />);
    expect(getByText("Verificación")).toBeTruthy();
  });

  it("llama a goBack al presionar el botón de retroceso", () => {
    const { getByTestId } = render(<VerificationScreen />);
    const back = getByTestId("back-button");
    fireEvent.press(back);
    expect((global as any).mockGoBack).toHaveBeenCalled();
  });

  it("habilita el botón CONTINUAR luego de ingresar código y navega a Interests", () => {
    const { getByTestId, getByText } = render(<VerificationScreen />);

    const codeInput = getByTestId("code-input");
    // Simular completar el código usando el mock de CodeInput (llama onComplete)
    fireEvent.changeText(codeInput, "1234");

    // Ahora el botón CONTINUAR debería estar habilitado; presionarlo debe navegar
    const continueButton = getByText("CONTINUAR");
    fireEvent.press(continueButton);

    expect((global as any).mockNavigate).toHaveBeenCalledWith("Interests");
  });

  it("muestra el temporizador inicial", () => {
    const { getByText } = render(<VerificationScreen />);
    // Formato 20 seconds -> 0:20
    expect(getByText("0:20")).toBeTruthy();
  });
});
