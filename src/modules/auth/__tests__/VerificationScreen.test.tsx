import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import VerificationScreen from "@/src/modules/auth/screens/VerificationScreen";
import { TEST_CREDENTIALS } from "@/src/modules/auth/constants/testCredentials";

describe("VerificationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (global as any).mockRoute = { params: {} };
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

  it("muestra el temporizador inicial", () => {
    const { getByText } = render(<VerificationScreen />);
    expect(getByText("0:20")).toBeTruthy();
  });

  it("muestra el email recibido por parámetro", () => {
    (global as any).mockRoute = { params: { email: "test@email.com" } };
    const { getByText } = render(<VerificationScreen />);
    expect(getByText(/test@email.com/)).toBeTruthy();
  });

  describe("Validación de código incompleto", () => {
    it("muestra error cuando el código está incompleto", async () => {
      const { getByText, getByTestId } = render(<VerificationScreen />);

      const codeInput = getByTestId("code-input");
      fireEvent.changeText(codeInput, "12");

      fireEvent.press(getByText("CONTINUAR"));

      await waitFor(() => {
        expect(getByText("Debes ingresar el código completo")).toBeTruthy();
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("Interests");
    });
  });

  describe("Validación de código incorrecto", () => {
    it("muestra error cuando el código es incorrecto", async () => {
      const { getByText, getByTestId } = render(<VerificationScreen />);

      const codeInput = getByTestId("code-input");
      fireEvent.changeText(codeInput, "9999");

      fireEvent.press(getByText("CONTINUAR"));

      await waitFor(() => {
        expect(getByText("El código ingresado es incorrecto")).toBeTruthy();
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("Interests");
    });
  });

  describe("Verificación exitosa", () => {
    it("navega a Interests cuando el código es correcto", async () => {
      const { getByTestId, getByText } = render(<VerificationScreen />);

      const codeInput = getByTestId("code-input");
      fireEvent.changeText(codeInput, TEST_CREDENTIALS.verificationCode);

      fireEvent.press(getByText("CONTINUAR"));

      await waitFor(() => {
        expect((global as any).mockNavigate).toHaveBeenCalledWith("Interests");
      });
    });
  });

  describe("Limpieza de errores", () => {
    it("limpia el error cuando el usuario empieza a escribir", async () => {
      const { getByText, getByTestId, queryByText } = render(<VerificationScreen />);

      const codeInput = getByTestId("code-input");
      fireEvent.changeText(codeInput, "99");
      fireEvent.press(getByText("CONTINUAR"));

      await waitFor(() => {
        expect(getByText("Debes ingresar el código completo")).toBeTruthy();
      });

      fireEvent.changeText(codeInput, "1");

      await waitFor(() => {
        expect(queryByText("Debes ingresar el código completo")).toBeNull();
      });
    });
  });
});
