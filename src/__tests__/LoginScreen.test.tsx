import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LoginScreen from "@/src/modules/auth/screens/LoginScreen";

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título correctamente", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("Iniciar Sesión")).toBeTruthy();
  });

  it("permite navegar a ResetPassword", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("¿Olvidaste tu contraseña?"));
    expect((global as any).mockNavigate).toHaveBeenCalledWith("ResetPassword");
  });

  it("permite navegar a Register", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Regístrate"));
    expect((global as any).mockNavigate).toHaveBeenCalledWith("Register");
  });

  it("permite ingresar email y contraseña", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("abc@email.com");
    const passwordInput = getByPlaceholderText("Contraseña");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "mypassword");

    expect((emailInput.props as any).value).toBe("test@example.com");
    expect((passwordInput.props as any).value).toBe("mypassword");
  });

  it("llama a los handlers de login y redes sociales", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("INICIAR SESIÓN"));
    fireEvent.press(getByText("Continuar con Google"));
    fireEvent.press(getByText("Continuar con Facebook"));

    expect(consoleSpy).toHaveBeenCalledWith("Log in pressed");
    expect(consoleSpy).toHaveBeenCalledWith("Google login pressed");
    expect(consoleSpy).toHaveBeenCalledWith("Facebook login pressed");

    consoleSpy.mockRestore();
  });
});
