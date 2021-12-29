//formulario
const form = document.querySelector("#nueva-cita");
//inputs formulario
const petInput = document.querySelector("#mascota");
const ownerInput = document.querySelector("#propietario");
const phoneInput = document.querySelector("#telefono");
const dateInput = document.querySelector("#fecha");
const timeInput = document.querySelector("#hora");
const sickInput = document.querySelector("#sintomas");
//Citas sección
const appointsH1 = document.querySelector("#administra");
const appointsList = document.querySelector("#citas");

const appointmentObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
  editado: false,
};

function resetAppointmentObj() {
  appointmentObj.mascota = "";
  appointmentObj.propietario = "";
  appointmentObj.telefono = "";
  appointmentObj.fecha = "";
  appointmentObj.hora = "";
  appointmentObj.sintomas = "";
  appointmentObj.editado = false;
}

class Appointments {
  constructor() {
    this.appointments = [];
  }

  addAppointment(appointment) {
    this.appointments = [appointment, ...this.appointments];
  }

  deleteAppointment(appointmentId) {
    this.appointments = this.appointments.filter(
      (appointment) => appointment.id !== appointmentId
    );
  }

  editAppointment(appointmentUpdated) {
    this.appointments = this.appointments.map((appointment) =>
      appointment.id === appointmentUpdated.id
        ? appointmentUpdated
        : appointment
    );
  }
}
const appointmentsList = new Appointments();

class UI {
  showAlert(msg, type) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(
      "text-center",
      "alert",
      "d-block",
      "col-12",
      "float-message"
    );

    switch (type) {
      case 0:
        msgDiv.classList.add("alert-danger");
        break;
      case 1:
        msgDiv.classList.add("alert-success");
        break;
    }

    msgDiv.textContent = msg.toUpperCase();

    const content = document.querySelector("#contenido");

    if (content.querySelectorAll("alert").length === 0) {
      content.insertBefore(msgDiv, document.querySelector(".agregar-cita"));
    }

    setTimeout(() => {
      msgDiv.remove();
    }, 2000);
  }

  showList({ appointments }) {
    //Se puede aplicar deestructuring /recordar p. ej "ev"
    this.clearList();

    appointments.forEach((appoint) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        appoint;

      const appointmentLi = document.createElement("li");
      appointmentLi.classList.add("cita", "p-3");
      appointmentLi.dataset.id = id;

      const petElementH2 = document.createElement("h2");
      petElementH2.classList.add("card-title", "font-weight-bolder");
      petElementH2.innerHTML = `${mascota}`;

      const ownerElementP = document.createElement("p");
      ownerElementP.classList.add("card-title", "font-weight-bolder");
      ownerElementP.innerHTML = `${propietario}`;

      const phoneElementP = document.createElement("p");
      phoneElementP.classList.add("card-title", "font-weight-bolder");
      phoneElementP.innerHTML = `${telefono}`;

      const dateElementP = document.createElement("p");
      dateElementP.classList.add("card-title", "font-weight-bolder");
      dateElementP.innerHTML = `${fecha}`;

      const timeElementP = document.createElement("p");
      timeElementP.classList.add("card-title", "font-weight-bolder");
      timeElementP.innerHTML = `${hora}`;

      const sickElementP = document.createElement("p");
      sickElementP.classList.add("card-title", "font-weight-bolder");
      sickElementP.innerHTML = `${sintomas}`;

      //buttons
      const deleteBtn = document.createElement("button");
      deleteBtn.onclick = () => deleteAppointment(id);
      deleteBtn.classList.add("btn", "btn-danger", "mr-2");
      deleteBtn.innerHTML =
        'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

      const editBtn = document.createElement("button");
      editBtn.onclick = () => loadAppointmentInputs(appoint);
      editBtn.classList.add("btn", "btn-info");
      editBtn.innerHTML =
        'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

      appointmentLi.appendChild(petElementH2);
      appointmentLi.appendChild(ownerElementP);
      appointmentLi.appendChild(phoneElementP);
      appointmentLi.appendChild(dateElementP);
      appointmentLi.appendChild(timeElementP);
      appointmentLi.appendChild(sickElementP);
      appointmentLi.appendChild(deleteBtn);
      appointmentLi.appendChild(editBtn);

      appointsList.appendChild(appointmentLi);
    });
  }

  clearList() {
    appointsList.innerHTML = null;
  }
}

document.addEventListener("DOMContentLoaded", runApp);

const userInterface = new UI();
function runApp() {
  loadEventListenners();
  loadLocalStorage();
  userInterface.showList(appointmentsList);
}

function loadEventListenners() {
  petInput.addEventListener("blur", updateAppointObjData);
  ownerInput.addEventListener("blur", updateAppointObjData);
  phoneInput.addEventListener("blur", updateAppointObjData);
  dateInput.addEventListener("blur", updateAppointObjData);
  timeInput.addEventListener("blur", updateAppointObjData);
  sickInput.addEventListener("blur", updateAppointObjData);

  form.addEventListener("submit", newAppointment);
}

function updateAppointObjData(ev) {
  appointmentObj[ev.target.name] = ev.target.value;
}

function newAppointment(ev) {
  ev.preventDefault();

  if (validateSubmit()) {
    if (!appointmentObj.editado) {
      appointmentObj.id = Date.now();
      appointmentsList.addAppointment({ ...appointmentObj });

      userInterface.showAlert("Cita agregada correctamente", 1);
    } else {
      appointmentsList.editAppointment({...appointmentObj});
      userInterface.showAlert("Cita editada correctamente", 1);
    }

    updateLocalStorage();
    userInterface.showList(appointmentsList);

    form.reset();
    resetAppointmentObj();
  }
}

function validateSubmit() {
  const { mascota, propietario, telefono, fecha, hora, sintomas } =
    appointmentObj;

  if (!mascota || !propietario || !telefono || !fecha || !hora || !sintomas) {
    console.error("Campos faltantes");
    userInterface.showAlert("Todos los campos son obligatorios", 0);
    return false;
  }
  return true;
}

function deleteAppointment(appointmentId) {
  appointmentsList.deleteAppointment(appointmentId);

  userInterface.showAlert("La cita ha sido eliminada", 0);

  updateLocalStorage();

  userInterface.showList(appointmentsList);
}

function editAppointment(appointment) {
  appointmentsList.editAppointment(appointment);
  showList(appointmentsList);
}

function loadAppointmentInputs({mascota, propietario, telefono, fecha, hora, sintomas, id}) {
  userInterface.showAlert('Cargando edición', 1);
    
  appointmentObj.editado = true;

  appointmentObj.mascota = mascota;
  appointmentObj.propietario = propietario;
  appointmentObj.telefono = telefono;
  appointmentObj.fecha = fecha;
  appointmentObj.hora = hora;
  appointmentObj.sintomas = sintomas;
  appointmentObj.id = id;

  petInput.value = mascota;
  ownerInput.value = propietario;
  phoneInput.value = telefono;
  dateInput.value = fecha;
  timeInput.value = hora;
  sickInput.value = sintomas;


  form.querySelector('button[type="submit"]').textContent = "Guardar Cambios";
}

function loadLocalStorage() {
    appointmentsList.appointments = JSON.parse(localStorage.getItem('appointsList'))??[];
}

function updateLocalStorage() {
    localStorage.setItem('appointsList', JSON.stringify(appointmentsList.appointments));
}
