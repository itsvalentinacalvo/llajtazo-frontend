import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "@/src/modules/auth/screens/LoginScreen";
import { TEST_CREDENTIALS } from "@/src/modules/auth/constants/testCredentials";

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

  describe("Validación de campos vacíos", () => {
    it("muestra error cuando el correo está vacío", async () => {
      const { getAllByText, getByText } = render(<LoginScreen />);
      
      fireEvent.press(getByText("INICIAR SESIÓN"));

      await waitFor(() => {
        const errors = getAllByText("Este campo no puede estar vacío");
        expect(errors.length).toBeGreaterThan(0);
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("MainApp", expect.anything());
    });

    it("muestra error cuando la contraseña está vacía", async () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);
      
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), "test@email.com");
      fireEvent.press(getByText("INICIAR SESIÓN"));

      await waitFor(() => {
        expect(getByText("Este campo no puede estar vacío")).toBeTruthy();
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("MainApp", expect.anything());
    });
  });

  describe("Validación de credenciales incorrectas", () => {
    it("muestra error cuando las credenciales son incorrectas", async () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);
      
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), "wrong@email.com");
      fireEvent.changeText(getByPlaceholderText("Contraseña"), "WrongPass123");
      fireEvent.press(getByText("INICIAR SESIÓN"));

      await waitFor(() => {
        expect(getByText("Correo o contraseña incorrectos")).toBeTruthy();
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("MainApp", expect.anything());
    });

    it("muestra error cuando el correo es correcto pero la contraseña es incorrecta", async () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);
      
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), TEST_CREDENTIALS.email);
      fireEvent.changeText(getByPlaceholderText("Contraseña"), "WrongPass123");
      fireEvent.press(getByText("INICIAR SESIÓN"));

      await waitFor(() => {
        expect(getByText("Correo o contraseña incorrectos")).toBeTruthy();
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("MainApp", expect.anything());
    });

    it("muestra error cuando la contraseña es correcta pero el correo es incorrecto", async () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);
      
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), "wrong@email.com");
      fireEvent.changeText(getByPlaceholderText("Contraseña"), TEST_CREDENTIALS.password);
      fireEvent.press(getByText("INICIAR SESIÓN"));

      await waitFor(() => {
        expect(getByText("Correo o contraseña incorrectos")).toBeTruthy();
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("MainApp", expect.anything());
    });
  });

  describe("Login exitoso", () => {
    it("navega a MainApp cuando las credenciales son correctas", async () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);
      
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), TEST_CREDENTIALS.email);
      fireEvent.changeText(getByPlaceholderText("Contraseña"), TEST_CREDENTIALS.password);
      fireEvent.press(getByText("INICIAR SESIÓN"));

      await waitFor(() => {
        expect((global as any).mockNavigate).toHaveBeenCalledWith("MainApp", { screen: "EventosTab" });
      });
    });
  });

  describe("Limpieza de errores", () => {
    it("limpia el error del campo email cuando el usuario empieza a escribir", async () => {
      const { getAllByText, getByText, getByPlaceholderText, queryAllByText } = render(<LoginScreen />);
      
      fireEvent.press(getByText("INICIAR SESIÓN"));

      await waitFor(() => {
        const errors = getAllByText("Este campo no puede estar vacío");
        expect(errors.length).toBe(2);
      });

      fireEvent.changeText(getByPlaceholderText("abc@email.com"), "t");

      await waitFor(() => {
        const remainingErrors = queryAllByText("Este campo no puede estar vacío");
        expect(remainingErrors.length).toBe(1);
      });
    });
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

  it("llama a los handlers de redes sociales", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Continuar con Google"));
    fireEvent.press(getByText("Continuar con Facebook"));

    expect(consoleSpy).toHaveBeenCalledWith("Google login pressed");
    expect(consoleSpy).toHaveBeenCalledWith("Facebook login pressed");

    consoleSpy.mockRestore();
  });
});
