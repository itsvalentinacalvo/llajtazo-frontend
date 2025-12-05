import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterScreen from "@/src/modules/auth/screens/RegisterScreen";
import { TEST_CREDENTIALS } from "@/src/core/test/profileData";

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
    expect((global as any).mockReplace).toHaveBeenCalledWith("Login");
  });

  describe("Validación de campos vacíos", () => {
    it("muestra error cuando el nombre está vacío", async () => {
      const { getAllByText, getByText } = render(<RegisterScreen />);
      
      fireEvent.press(getByText("REGÍSTRATE"));

      await waitFor(() => {
        const errors = getAllByText("Este campo no puede estar vacío");
        expect(errors.length).toBeGreaterThan(0);
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("Verification", expect.anything());
    });

    it("muestra error cuando el correo está vacío", async () => {
      const { getAllByText, getByText, getByPlaceholderText } = render(<RegisterScreen />);
      
      fireEvent.changeText(getByPlaceholderText("Nombre Completo"), "Test User");
      fireEvent.press(getByText("REGÍSTRATE"));

      await waitFor(() => {
        const errors = getAllByText("Este campo no puede estar vacío");
        expect(errors.length).toBeGreaterThan(0);
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("Verification", expect.anything());
    });

    it("muestra error cuando la contraseña está vacía", async () => {
      const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
      
      fireEvent.changeText(getByPlaceholderText("Nombre Completo"), "Test User");
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), "test@email.com");
      fireEvent.press(getByText("REGÍSTRATE"));

      await waitFor(() => {
        expect(getByText("Este campo no puede estar vacío")).toBeTruthy();
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("Verification", expect.anything());
    });
  });

  describe("Validación de contraseña", () => {
    it("muestra error cuando la contraseña tiene menos de 8 caracteres", async () => {
      const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
      
      fireEvent.changeText(getByPlaceholderText("Nombre Completo"), "Test User");
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), "test@email.com");
      fireEvent.changeText(getByPlaceholderText("Contraseña"), "Pass1");
      fireEvent.press(getByText("REGÍSTRATE"));

      await waitFor(() => {
        expect(getByText("Debe tener un mínimo de 8 caracteres")).toBeTruthy();
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("Verification", expect.anything());
    });
  });

  describe("Validación de correo duplicado", () => {
    it("muestra error cuando el correo ya está registrado", async () => {
      const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
      
      fireEvent.changeText(getByPlaceholderText("Nombre Completo"), "Test User");
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), TEST_CREDENTIALS.email);
      fireEvent.changeText(getByPlaceholderText("Contraseña"), "Password123");
      fireEvent.press(getByText("REGÍSTRATE"));

      await waitFor(() => {
        expect(getByText("Ese correo ya se encuentra registrado")).toBeTruthy();
      });
      expect((global as any).mockNavigate).not.toHaveBeenCalledWith("Verification", expect.anything());
    });
  });

  describe("Registro exitoso", () => {
    it("navega a Verification con email cuando todos los campos son válidos", async () => {
      const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
      
      const testEmail = "newuser@email.com";
      fireEvent.changeText(getByPlaceholderText("Nombre Completo"), "Test User");
      fireEvent.changeText(getByPlaceholderText("abc@email.com"), testEmail);
      fireEvent.changeText(getByPlaceholderText("Contraseña"), "Password123");
      fireEvent.press(getByText("REGÍSTRATE"));

      await waitFor(() => {
        expect((global as any).mockNavigate).toHaveBeenCalledWith("Verification", { email: testEmail });
      });
    });
  });

  describe("Limpieza de errores", () => {
    it("limpia el error del campo nombre cuando el usuario empieza a escribir", async () => {
      const { getAllByText, getByText, getByPlaceholderText, queryAllByText } = render(<RegisterScreen />);
      
      fireEvent.press(getByText("REGÍSTRATE"));

      await waitFor(() => {
        const errors = getAllByText("Este campo no puede estar vacío");
        expect(errors.length).toBe(3);
      });

      fireEvent.changeText(getByPlaceholderText("Nombre Completo"), "T");

      await waitFor(() => {
        const remainingErrors = queryAllByText("Este campo no puede estar vacío");
        expect(remainingErrors.length).toBe(2);
      });
    });
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

      expect(consoleSpy).toHaveBeenCalledWith("[Register] Google register pressed");
      expect(consoleSpy).toHaveBeenCalledWith("[Register] Facebook register pressed");

    consoleSpy.mockRestore();
  });
});
