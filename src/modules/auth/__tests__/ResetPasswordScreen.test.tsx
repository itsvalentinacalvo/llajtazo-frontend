import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ResetPasswordScreen from "@/src/modules/auth/screens/ResetPasswordScreen";
import { TEST_CREDENTIALS } from "@/src/modules/auth/constants/testCredentials";

describe("ResetPasswordScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título correctamente", () => {
    const { getByText } = render(<ResetPasswordScreen />);
    expect(getByText("Restablecer contraseña")).toBeTruthy();
  });

  it("llama a goBack al presionar el botón de retroceso", () => {
    const { getByTestId } = render(<ResetPasswordScreen />);
    const back = getByTestId("back-button");
    fireEvent.press(back);
    expect((global as any).mockGoBack).toHaveBeenCalled();
  });

  describe("Validación de campo vacío", () => {
    it("muestra error cuando el correo está vacío", async () => {
      const { getByText } = render(<ResetPasswordScreen />);
      
      fireEvent.press(getByText("ENVIAR"));

      await waitFor(() => {
        expect(getByText("Este campo no puede estar vacío")).toBeTruthy();
      });
    });
  });

  describe("Validación de correo no registrado", () => {
    it("muestra error cuando el correo no está registrado", async () => {
      const { getByText, getByPlaceholderText } = render(<ResetPasswordScreen />);
      
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), "unknown@email.com");
      fireEvent.press(getByText("ENVIAR"));

      await waitFor(() => {
        expect(getByText("No se encontró una cuenta con este correo")).toBeTruthy();
      });
    });
  });

  describe("Envío exitoso", () => {
    it("muestra log de éxito cuando el correo está registrado", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      const { getByText, getByPlaceholderText } = render(<ResetPasswordScreen />);
      
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), TEST_CREDENTIALS.email);
      fireEvent.press(getByText("ENVIAR"));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("Reset password email sent");
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Limpieza de errores", () => {
    it("limpia el error cuando el usuario empieza a escribir", async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<ResetPasswordScreen />);
      
      fireEvent.press(getByText("ENVIAR"));

      await waitFor(() => {
        expect(getByText("Este campo no puede estar vacío")).toBeTruthy();
      });

      fireEvent.changeText(getByPlaceholderText("abc@email.com"), "t");

      await waitFor(() => {
        expect(queryByText("Este campo no puede estar vacío")).toBeNull();
      });
    });
  });

  it("permite ingresar email", () => {
    const { getByPlaceholderText } = render(<ResetPasswordScreen />);
    const emailInput = getByPlaceholderText("abc@email.com");

    fireEvent.changeText(emailInput, "reset@test.com");
    expect((emailInput.props as any).value).toBe("reset@test.com");
  });
});
