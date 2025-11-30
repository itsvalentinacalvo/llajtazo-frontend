import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import InterestsScreen from "@/src/modules/auth/screens/InterestsScreen";

describe("InterestsScreen", () => {
  const navigationMock = { navigate: jest.fn(), dispatch: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    navigationMock.navigate.mockClear();
    navigationMock.dispatch.mockClear();
  });

  it("renderiza título y subtítulo", () => {
    const { getByText } = render(<InterestsScreen navigation={navigationMock} />);
    expect(getByText("Selecciona")).toBeTruthy();
    expect(getByText("Algunas palabras clave que describan tus intereses")).toBeTruthy();
  });

  it("permite seleccionar varios intereses sin navegar", () => {
    const { getByText } = render(<InterestsScreen navigation={navigationMock} />);
    const teatro = getByText("Teatro");
    const musica = getByText("Música");

    fireEvent.press(teatro);
    fireEvent.press(musica);

    expect(navigationMock.dispatch).not.toHaveBeenCalled();
  });

  describe("Validación de selección mínima", () => {
    it("muestra error cuando no se selecciona ningún interés", async () => {
      const { getByText } = render(<InterestsScreen navigation={navigationMock} />);
      
      fireEvent.press(getByText("FINALIZAR"));

      await waitFor(() => {
        expect(getByText("Se debe seleccionar al menos una palabra clave")).toBeTruthy();
      });
      expect(navigationMock.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("Finalización exitosa", () => {
    it("navega a MainApp cuando hay al menos un interés seleccionado", async () => {
      const { getByText } = render(<InterestsScreen navigation={navigationMock} />);
      
      fireEvent.press(getByText("Teatro"));
      fireEvent.press(getByText("FINALIZAR"));

      await waitFor(() => {
        expect(navigationMock.dispatch).toHaveBeenCalledWith({
          type: "RESET",
          payload: {
            index: 0,
            routes: [{ name: "MainApp", params: { screen: "ExplorarTab" } }],
          },
        });
      });
    });

    it("navega a MainApp cuando hay múltiples intereses seleccionados", async () => {
      const { getByText } = render(<InterestsScreen navigation={navigationMock} />);
      
      fireEvent.press(getByText("Teatro"));
      fireEvent.press(getByText("Música"));
      fireEvent.press(getByText("Deportes"));
      fireEvent.press(getByText("FINALIZAR"));

      await waitFor(() => {
        expect(navigationMock.dispatch).toHaveBeenCalledWith({
          type: "RESET",
          payload: {
            index: 0,
            routes: [{ name: "MainApp", params: { screen: "ExplorarTab" } }],
          },
        });
      });
    });
  });

  describe("Limpieza de errores", () => {
    it("limpia el error cuando el usuario selecciona un interés", async () => {
      const { getByText, queryByText } = render(<InterestsScreen navigation={navigationMock} />);
      
      fireEvent.press(getByText("FINALIZAR"));

      await waitFor(() => {
        expect(getByText("Se debe seleccionar al menos una palabra clave")).toBeTruthy();
      });

      fireEvent.press(getByText("Teatro"));

      await waitFor(() => {
        expect(queryByText("Se debe seleccionar al menos una palabra clave")).toBeNull();
      });
    });
  });
});
