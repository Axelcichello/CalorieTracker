import { Activity } from "../types";

export type ActivityActions =
  | {
      type: "save-activity",
      payload: { newActivity: Activity };
    }
  | { type: "set-activeId", payload: { id: Activity["id"] } } 
  | { type: "delete-activity", payload: { id: Activity["id"] } }
  | { type: "restart-app" };

export type ActivityState = {
  activities: Activity[];
  activeId: Activity["id"];
};

const localstorageActivities = () : Activity[] => {
  const activities = localStorage.getItem("activities");
  return activities ? JSON.parse(activities) : [];
}

export const initialState: ActivityState = {
  activities: localstorageActivities(), //obtiene las actividades del localstorage
  activeId: "",
};

export const activityReducer = (
  state: ActivityState = initialState,
  action: ActivityActions
) => {

  if (action.type === "save-activity") {
    //Este codigo maneja la logica para actualizar el state
    let updatedActivities : Activity[] = []
    if(state.activeId) {
      updatedActivities = state.activities.map(activity => activity.id === state.activeId ? action.payload.newActivity : activity) //actualiza la actividad en el state
    }else{
      updatedActivities = [...state.activities, action.payload.newActivity] //agrega la nueva actividad al state
    }

    return {
      ...state,
      activities: updatedActivities, //actualiza el state con la nueva actividad
      activeId: '' //reinicia el id activo
    };
  }

  if (action.type === "set-activeId") {
    return {
      ...state,
      activeId: action.payload.id, //actualiza el id activo en el statec
    };
  }


  if(action.type === "delete-activity") {
    return {
      ...state,
      activities: state.activities.filter(activity => activity.id !== action.payload.id) //elimina la actividad del state
    }
  }

  if(action.type === "restart-app") {
    return{
      activities: [],
      activeId: ''
    }
  }



  // Si no se cumple ninguna de las condiciones anteriores, devuelve el estado actual sin cambios
  return state;
};
