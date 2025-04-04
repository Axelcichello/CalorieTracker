import React, {
  useState,
  ChangeEvent,
  FormEvent,
  Dispatch,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid"; //importa la libreria uuid para generar ids unicos
import { categories } from "../data/categories";
import type { Activity } from "../types";
import { ActivityActions, ActivityState } from "../reducers/activity-reducer";

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  state: ActivityState;
};

const initialState: Activity = {
  id: uuidv4(), //genera un id unico para cada actividad
  category: 1,
  name: "",
  calories: 0,
};

export default function Form({ dispatch, state }: FormProps) {
  const [activity, setActivity] = useState<Activity>(initialState); //inicializa el estado de la actividad con el valor inicial

  useEffect(() => {
    if (state.activeId) {
      const selectedActivity = state.activities.filter( stateActivity => stateActivity.id === state.activeId)[0]; //filtra la actividad seleccionada por el id activo
      setActivity(selectedActivity)
    }
  }, [state.activeId]); //verifica si el id activo ha cambiado y actualiza el estado de la actividad

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const isNumberField = ["category", "calories"].includes(e.target.id); //verifica si el id es category o calories

    setActivity({
      ...activity,
      [e.target.id]: isNumberField ? +e.target.value : e.target.value, //convierte el valor a numero si es category o calories
    });
  };

  const isValidActivity = () => {
    const { name, calories } = activity;
    return name.trim() !== "" && calories > 0; //verifica si el nombre no esta vacio y las calorias son mayores a 0
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //evita que se recargue la pagina al enviar el formulario

    dispatch({ type: "save-activity", payload: { newActivity: activity } }); //envia la accion al reducer

    setActivity({
      ...initialState,
      id: uuidv4(), //genera un nuevo id unico para la nueva actividad
    }); //reinicia el formulario
  };

  return (
    <form
      className="space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="category" className="font-bold">
          Categoria:
        </label>
        <select
          onChange={handleChange}
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          id="category"
          value={activity.category}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name" className="font-bold">
          Actividad:
        </label>
        <input
          onChange={handleChange}
          value={activity.name}
          type="text"
          id="name"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Ej. Comida, Jugo de naranja, Ensaladas, Pesas."
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories" className="font-bold">
          Calorias:
        </label>
        <input
          onChange={handleChange}
          value={activity.calories}
          type="text"
          id="calories"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Calorias. Ej. 300 o 500"
        />
      </div>

      <input
        type="submit"
        className="disabled:opacity-10 bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer"
        value={activity.category === 1 ? "Agregar comida" : "Agregar ejercicio"}
        disabled={!isValidActivity()}
      />
    </form>
  );
}
