# Manual de Funcionalidad: Onboarding Dinámico

Este manual describe cómo el formulario de onboarding de Heronova es generado de forma dinámica y orientada a datos. 
El objetivo es permitir que cualquier desarrollador pueda agregar, modificar o quitar preguntas durante el Onboarding inicial *sin tener que modificar la lógica compleja de React o el diseño del componente UI*.

---

## 1. Archivo de Configuración de Preguntas

Toda la estructura visual y contenido del formulario está centralizado en un único archivo de configuración:
**Ruta:** `frontend/src/config/onboardingQuestions.ts`

Aquí se exporta la constante `onboardingQuestions`, la cual es un arreglo de objetos `OnboardingQuestion`.

### Tipos Soportados (`QuestionType`)
*   `select`: Muestra un menú desplegable nativo para seleccionar una opción.
*   `radio`: Muestra botones de opción (radio buttons) donde el usuario puede elegir solo uno.
*   `text`: Muestra un campo de texto simple.
*   `number`: Muestra un campo de texto validado para números.

### Propiedades de una Pregunta
| Propiedad | Tipo | Descripción | Requerido |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Importante:** Este `id` actúa como la clave (`key`) del dato. **Debe coincidir exactamente con una propiedad en la interfaz `Business` del backend** (ej. `industry`). | Sí |
| `type` | `QuestionType` | El tipo de campo que se renderizará (ver arriba). | Sí |
| `label` | `string` | La pregunta principal o el título del campo (ej. "Tipo de Industria"). | Sí |
| `placeholder` | `string` | Texto de ayuda dentro del input (para `text`, `number`, `select`). | No |
| `options` | `OnboardingOption[]` | Un arreglo de objetos `{ label, value }` obligatorio si el tipo es `select` o `radio`. | Sí (para select/radio) |
| `required` | `boolean` | Si es `true`, el formulario no dejará continuar si este campo está vacío. | No |

---

## 2. Cómo agregar una nueva pregunta

Para agregar una nueva pregunta (ej. "¿Cuántos empleados tienes?"), debes realizar dos pasos muy simples:

### Paso 1: Configurar la pregunta en el Frontend
Edita `frontend/src/config/onboardingQuestions.ts` y añade tu nueva pregunta al arreglo `onboardingQuestions`:

```typescript
export const onboardingQuestions: OnboardingQuestion[] = [
  // ... preguntas existentes ...
  {
    id: 'employeeCount',
    type: 'select',
    label: '¿Cuántos empleados trabajan en tu negocio?',
    required: true,
    options: [
      { label: 'Solo yo (1)', value: '1' },
      { label: '2 a 5', value: '2_5' },
      { label: 'Más de 5', value: '5_plus' }
    ]
  }
];
```

*Nota: Con solo hacer este cambio, el formulario en la UI de React ya se actualizará y renderizará automáticamente esta nueva pregunta, recolectará su respuesta y la enviará al backend con la clave `employeeCount`.*

### Paso 2: Adaptar el TIPADO en el Backend (y guardado)
Asegúrate de que el Backend sepa recibir este nuevo campo. 
1. Ve a `src/interfaces/index.ts` y añade la propiedad al modelo `Business`:

```typescript
export interface Business {
    // ...
    onboardingCompleted: boolean;
    industry?: string;
    // ... demás campos
    employeeCount?: string; // <-- Nuevo campo mapeado con el `id`
}
```

2. Verifica que el endpoint `/business/onboarding` o la función asíncrona de guardado no elimine las claves adicionales que envía el frontend (por defecto, Firestore guarda el objeto entero si lo esparces, así que `updateOnboarding(businessId, req.body)` funcionaría automáticamente sin más cambios en el código de base de datos).

---

## 3. Comportamiento del Formulario UI

El archivo `frontend/src/components/OnboardingForm.tsx` (y su integración en `dashboard/layout.tsx`) hace lo siguiente:
1. Intercepta al usuario cuando la sesión tiene flag `onboardingCompleted: false`.
2. Itera sobre el arreglo de `onboardingQuestions.ts`.
3. Maneja el estado local (`formData[question.id]`) y las advertencias visuales de campos vacíos obligatorios.
4. Renderiza los inputs (HTML nativo o de librerías como Radix/Lucide dependiendo de la implementación UI) basándose en el atributo `type`.
5. Al hacer submit, hace el POST con todo el objeto JSON hacia el backend y llama a router para quitar el bloqueo de Onboarding.

**Regla de oro:** No toques la lógica de `OnboardingForm.tsx` a menos que desees agregar un *nuevo tipo visual de input* que no exista (ej. un slider numérico complejo, o subida de imágenes). Para todo lo demás, modificar la configuración es suficiente.
