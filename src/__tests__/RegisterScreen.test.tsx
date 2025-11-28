import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import RegisterScreen from "@/src/modules/auth/screens/RegisterScreen";

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título correctamente", () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText("Hola, Bienvenido! 👋")).toBeTruthy();
  });

  it("permite navegar a Login", () => {
    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText("Inicia Sesión"));
    expect((global as any).mockNavigate).toHaveBeenCalledWith("Login");
  });

  it("permite navegar a Verification al registrarse", () => {
    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText("REGÍSTRATE"));
    expect((global as any).mockNavigate).toHaveBeenCalledWith("Verification");
  });

  it("permite ingresar nombre, email y contraseña", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    const nameInput = getByPlaceholderText("Nombre Completo");
    const emailInput = getByPlaceholderText("abc@email.com");
    const passwordInput = getByPlaceholderText("Contraseña");

    fireEvent.changeText(nameInput, "Nombre Test");
    fireEvent.changeText(emailInput, "user@test.com");
    fireEvent.changeText(passwordInput, "secret");

    expect((nameInput.props as any).value).toBe("Nombre Test");
    expect((emailInput.props as any).value).toBe("user@test.com");
    expect((passwordInput.props as any).value).toBe("secret");
  });

  it("llama a los handlers de redes sociales", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText("Registrarte con Google"));
    fireEvent.press(getByText("Registrarte con Facebook"));

    expect(consoleSpy).toHaveBeenCalledWith("Google register pressed");
    expect(consoleSpy).toHaveBeenCalledWith("Facebook register pressed");

    consoleSpy.mockRestore();
  });
});
