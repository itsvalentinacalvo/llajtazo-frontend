import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ResetPasswordScreen from "@/src/modules/auth/screens/ResetPasswordScreen";

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

  it("permite ingresar email y enviar el formulario", () => {
    const { getByPlaceholderText, getByText } = render(<ResetPasswordScreen />);
    const emailInput = getByPlaceholderText("abc@email.com");

    fireEvent.changeText(emailInput, "reset@test.com");
    expect((emailInput.props as any).value).toBe("reset@test.com");

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    fireEvent.press(getByText("ENVIAR"));
    expect(consoleSpy).toHaveBeenCalledWith("Send reset password pressed");
    consoleSpy.mockRestore();
  });
});
