# Heronova 1.0.0 - SaaS Development Roadmap 🚀

This roadmap outlines the path to transforming Heronova from a functional backend into a production-ready, revenue-generating SaaS product based on a "White-Glove" (Llave en mano) onboarding model.

## Phase 1: The First Impression & Onboarding
*Target: Create a seamless and professional experience for new business owners immediately after they register.*

- [X] **Onboarding Questionnaire UI**:
  - Build a welcome screen that appears right after registration/first login.
  - Ask 3-4 key questions to profile the client:
    1. Industry type (Clinic, Salon, Restaurant, etc.).
    2. Approximate monthly message volume.
    3. Current WhatsApp usage (None, WhatsApp Business, API).
  - Save this data to the `Business` document in Firestore to help you decide the best technical architecture (Meta Cloud API vs WATI vs Other) for each client.
- [X] **Pending Setup State**:
  - Since WhatsApp setup is manual initially, show a "Pending Setup" status card on the dashboard instructing the user to schedule a configuration call or wait for your team.

## Phase 2: CONFIGURACION DEL FLUJO DE MENSAJES.
*Target: Ofrecer al cliente la posibilidad de configurar el flujo de mensajes de su negocio.*

- [ ] **Mostrar un video con un ejemplo de la experiencia del cliente**:
  - Mostrar un video con un ejemplo de la experiencia del cliente.
  - Colocar un boton para iniciar la configuracion del flujo de mensajes.
- [ ] **Abrir una ventana para preguntar si quiere hacer la configruacion completa o desea usar una plantilla de ejemplo**:
  - Si el cliente desea usar una plantilla de ejemplo, mostrar una lista de plantillas de ejemplo.
    1. Diseñar un componente en la interfaz que tenga el diseño de una conversacion tipica de whatsapp el componente se puede llamar de momento "whatsappWindow", este componente debe mostrar un mensaje de ejemplo del usuario (Puede ser fijo no editale) y la respuesta del bot, esta respuesta debe venir del documento de la plantilla seleccionada en la pagina de plantillas.
    2. Dentro de la pagina de plantillas se deben mostrar los mensajes pos secciones, por ejemplo: 
      - Saludo
      - Despedida
      - Horario
      - Citas
      Yo me imagino cada sección como una ventana desplegable donde el usuario de click y se despliegeuen los mensajes de esa seccion en orden segun el flujo de la seccion, cada mensaje con un mensaje de ejemplo y un botón para editarlo. cada vez que se de click en un mensaje se debe mostrar en el componente de whatsappWindow que se encontraria en grande en la parte derecha de la pagina con marco de celular si es posible, esto es opcional. 
    3. Cada plantilla se debe de poder guardar en la base de datos.
    4. No es necesario que hagas todas las secciones, el codigo debe de ser modificable y escalable, entonces con que hagas unas dos plantillas, con dos secciones y al menos una seccion con dos mensajes, es suficiente, yo me encargo de anexar las demas plantillas de mensajes, si me podrias decir tambien una manera adecuada de organizar los documentos de firestore de la platilla estaria perfecto.
  - Si el cliente desea hacer la configuracion completa... Esta parte vamos a dejarla pendiente, primero hagamos el caso de las plantillas.
- [ ] **Calendar & Appointments Module**:
  - Visual calendar (FullCalendar or similar) inside the dashboard showing all appointments booked by the AI.
  - Email or push notifications (via frontend) alerting the owner of new bookings.


