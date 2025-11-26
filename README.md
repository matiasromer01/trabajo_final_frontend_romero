# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Complicaciones en el Trabajo Final

Una de las funcionalidades que me resultó más complicada fue la implementación del modo oscuro, especialmente en lo relacionado a cómo debía manejar y pasar la función como prop para que el cambio de tema se aplicara correctamente en toda la aplicación.  Al principio, no me daba cuenta de cómo debía pasar la función que alterna el modo oscuro entre los distintos componentes, para que realmente afectara a toda la interfaz y no solo a una parte ( en esta parte me apoyé en un video de yt y copilot para una mejor aplicación). Sin embargo, la parte del CSS no me generó complicaciones, ya que definir las variables y los estilos para ambos temas fue bastante directo y sencillo. El verdadero desafío estuvo en la lógica de React y en cómo conectar el estado del modo oscuro con el resto de la app.
