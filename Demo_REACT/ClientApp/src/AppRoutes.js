import { Buses } from "./components/Buses";
import { Home } from "./components/Home";
import { Cooperativas } from "./components/Cooperativas";
import { Horarios } from "./components/Horarios";
import { Tarifas } from "./components/Tarifas";
import { Rutas } from "./components/Rutas";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
    {
        path: '/Buses',
        element: <Buses />
    },
    {
        path: '/Cooperativas',
        element: <Cooperativas />
    },
    {
        path: '/Horarios',
        element: <Horarios />
    },
    {
        path: '/Tarifas',
        element: <Tarifas />
    },
    {
        path: '/Rutas',
        element: <Rutas />
    }
];

export default AppRoutes;
