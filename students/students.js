const table = document.getElementById("main__table");
const select_all_checkbox = document.getElementById("main__table_selectAll");

let count = 0;
let selectedRows = [];
let studentsList = [];
let studentToEdit;

let isValid = [false, false, false, false, false];

const validationPatterns = {
  name: /^[A-Za-z]{2,50}$/,
};

document.addEventListener("DOMContentLoaded", (e) => {

  // Table Listeners
  document.getElementById("main__table_selectAll").addEventListener("change", (e) => {
    const checkboxes = document.querySelectorAll(".main__table_selectStudent");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = select_all_checkbox.checked;
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      e.target.closest(".modal-container").classList.remove("active");
    });
  });

  // Modal Delete Listeners
  document.getElementById("modal__delete_confirmBtn").addEventListener("click", (e) => {
    selectedRows.forEach((row) => {
      studentsList = studentsList.filter(
        (s) => s.id !== Number(row.firstChild.lastChild.textContent)
      );
      row.remove();
      console.log(studentsList);
    });
    selectedRows = [];

    document.getElementById("modal__delete_container").classList.remove("active");
  });

  document.getElementById("modal__delete_cancelBtn").addEventListener("click", (e) => {
    document.getElementById("modal__delete_container").classList.remove("active");
  });

  document.getElementById("modal__delete_closeBtn").addEventListener("click", (e) => {
    document.getElementById("modal__delete_container").classList.remove("active");
  });

  // Modal AddEdit Listeners
  document.getElementById("main__addStudentBtn").addEventListener("click", (e) => {
    document.querySelectorAll(".modal__addEdit_input_container").forEach((c) => {c.classList.remove("error");})
    document.getElementById("modal__addEdit_form").reset();
    document.getElementById("modal__addEdit_heading").textContent =
      "Add new student";
    document.getElementById("modal__addEdit_container").classList.add("active");
  });

  // Modal AddEdit Validators
  const groupInput = document.getElementById("modal__addEdit_GroupInput");
  const firstNameInput = document.getElementById("modal__addEdit_FirstNameInput");
  const lastNameInput = document.getElementById("modal__addEdit_LastNameInput");
  const genderInput = document.getElementById("modal__addEdit_GenderInput");
  const birthdayInput = document.getElementById("modal__addEdit_BirthdayInput");

  groupInput.addEventListener("change", (e) => {
    isValid[0] = true;
    e.target.parentElement.parentElement.classList.remove("error");
    if(e.target.value === "") {
      isValid[0] = false;
      e.target.parentElement.parentElement.classList.add("error");
    }
  })

  firstNameInput.addEventListener("change", (e) => {
    isValid[1] = true;
    e.target.parentElement.parentElement.classList.remove("error");
    if(!validationPatterns.name.test(e.target.value)) {
      isValid[1] = false;
      e.target.parentElement.parentElement.classList.add("error");
    }
  })

  lastNameInput.addEventListener("change", (e) => {
    isValid[2] = true;
    e.target.parentElement.parentElement.classList.remove("error");
    if(!validationPatterns.name.test(e.target.value)) {
      isValid[2] = false;
      e.target.parentElement.parentElement.classList.add("error");
    }
  })

  genderInput.addEventListener("change", (e) => {
    isValid[3] = true;
    e.target.parentElement.parentElement.classList.remove("error");
    if(e.target.value === "") {
      isValid[3] = false;
      e.target.parentElement.parentElement.classList.add("error");
    }
  })

  birthdayInput.addEventListener("change", (e) => {
    isValid[4] = true;
    e.target.parentElement.parentElement.classList.remove("error");
    if (e.target.value) {
      const birthDate = new Date(e.target.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 16 || age > 100) {
        isValid[4] = false;
        e.target.parentElement.parentElement.classList.add("error");
        e.target.parentElement.querySelector(".error-message").textContent = "Age must be 16-100";
      }
    } else {
      isValid[4] = false;
      e.target.parentElement.parentElement.classList.add("error");
      e.target.parentElement.querySelector(".error-message").textContent = "Required";
    }
  })

  document
    .getElementById("modal__addEdit_form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.submitter != document.getElementById("modal__addEdit_confirmBtn")) return;
      const event = new Event("change")
      groupInput.dispatchEvent(event);
      firstNameInput.dispatchEvent(event);
      lastNameInput.dispatchEvent(event);
      genderInput.dispatchEvent(event);
      birthdayInput.dispatchEvent(event);
      if(!isValid.every(item => item === true)) return;
      isValid = [false, false, false, false, false]

      count++;
      const group = document.getElementById("modal__addEdit_GroupInput").value;
      const firstName = document.getElementById("modal__addEdit_FirstNameInput").value;
      const lastName = document.getElementById("modal__addEdit_LastNameInput").value;
      const gender = document.getElementById("modal__addEdit_GenderInput").value;
      const birthday = document.getElementById("modal__addEdit_BirthdayInput").value;
      
      if (studentToEdit) {
        studentToEdit.group = group;
        studentToEdit.firstName = firstName;
        studentToEdit.lastName = lastName;
        studentToEdit.gender = gender;
        studentToEdit.birthday = birthday;
  
        const row = Array.from(table.rows).find(
          (r) => Number(r.cells[0].lastChild.textContent) === studentToEdit.id
        );
        if (row) {
          row.cells[1].textContent = group;
          row.cells[2].textContent = `${firstName} ${lastName}`;
          row.cells[3].textContent = gender;
          row.cells[4].textContent = birthday;
        }
        console.log(JSON.stringify(studentToEdit))
        console.log(JSON.stringify(studentsList))
        console.log(studentsList);
        studentToEdit = null;
      } else {
        newStudent = {
          id: count,
          group: group,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          birthday: birthday,
        };

        studentsList = [
          ...studentsList,
          newStudent
        ];
        console.log(JSON.stringify(newStudent))
        console.log(JSON.stringify(studentsList))
        console.log(studentsList);
  
        select_all_checkbox.checked = false;
        
        const new_tr = document.createElement("tr");
        const td_selector = document.createElement("td");
        const checkbox_container = document.createElement("div");
        checkbox_container.classList.add("main__table_selector_container");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `main__table_selectStudent-${count}`;
        checkbox.value = count;
        checkbox.classList.add("main__table_selectStudent");
        checkbox.addEventListener("change", (e) => {
          console.log(document.querySelectorAll(".main__table_selectStudent"))
          if(!e.target.checked) select_all_checkbox.checked = false;
          else {
            if (Array.from(document.querySelectorAll(".main__table_selectStudent")).every(c => c.checked)) {
              select_all_checkbox.checked = true;
            }
          }
        })
        checkbox_container.appendChild(checkbox);
        
        const id_label = document.createElement("label"); 
        id_label.textContent = count;
        id_label.setAttribute("for", `main__table_selectStudent-${count}`);
        checkbox_container.appendChild(id_label);
  
        td_selector.appendChild(checkbox_container);
        new_tr.appendChild(td_selector);
  
        const td_group = document.createElement("td");
        td_group.textContent = group;
        new_tr.appendChild(td_group);
  
        const td_name = document.createElement("td");
        td_name.textContent = firstName + " " + lastName;
        new_tr.appendChild(td_name);
  
        const td_gender = document.createElement("td");
        td_gender.textContent = gender;
        new_tr.appendChild(td_gender);
  
        const td_birthday = document.createElement("td");
        td_birthday.textContent = birthday;
        new_tr.appendChild(td_birthday);
  
        const td_status = document.createElement("td");
        const status_img = document.createElement("img");
        status_img.classList.add("main__table_statusImg");
        status_img.src = (count % 2 == 0) ? "../assets/online.svg" : "../assets/offline.svg";
        status_img.alt = "Status";
        td_status.appendChild(status_img);
        new_tr.appendChild(td_status);
  
        const td_controls = document.createElement("td");
        const controls_div = document.createElement("div");
        controls_div.classList.add("main__table_controls_container");
  
        const edit_btn = document.createElement("button");
        edit_btn.classList.add("main__table_controls_button");
        const edit_img = document.createElement("img");
        edit_img.src = "../assets/edit.svg";
        edit_img.alt = "Edit";
        edit_btn.appendChild(edit_img);
        edit_btn.addEventListener("click", (e) => {
          const row = e.target.closest("tr");
          if (row.firstChild.firstChild.firstChild.checked == false) return;
          const id = Number(row.firstChild.firstChild.lastChild.textContent);
          studentToEdit = studentsList.find((s) => Number(s.id) === id);
          console.log(id);
  
          document.getElementById("modal__addEdit_form").reset();
          document.getElementById("modal__addEdit_heading").textContent =
            "Edit student";
          document.getElementById("modal__addEdit_GroupInput").value =
            studentToEdit.group;
          document.getElementById("modal__addEdit_FirstNameInput").value =
            studentToEdit.firstName;
          document.getElementById("modal__addEdit_LastNameInput").value =
            studentToEdit.lastName;
          document.getElementById("modal__addEdit_GenderInput").value =
            studentToEdit.gender;
          document.getElementById("modal__addEdit_BirthdayInput").value =
            studentToEdit.birthday;
          document.getElementById("modal__addEdit_container").classList.add("active");
        });
  
        const delete_btn = document.createElement("button");
        delete_btn.classList.add("main__table_controls_button");
        const delete_img = document.createElement("img");
        delete_img.src = "../assets/trash.svg";
        delete_img.alt = "Delete";
        delete_btn.appendChild(delete_img);
        delete_btn.addEventListener("click", (e) => {
          if (e.target.closest("tr").firstChild.firstChild.firstChild.checked == false)
            return;
          console.log("show modal delete");
  
          selectedRows = [];
          const checkboxes = document.querySelectorAll(".main__table_selectStudent");
          checkboxes.forEach((checkbox) => {
            if (checkbox.checked)
              selectedRows = [...selectedRows, checkbox.closest("tr")];
          });
  
          let message;
          if (selectedRows.length > 1) {
            message = "Are you sure you want to delete multiple users?";
          } else {
            message = `Are you sure you want to delete user ${selectedRows[0].cells[2].innerText}?`;
          }
  
          document.getElementById("modal__delete_text").textContent = message;
          document.getElementById("modal__delete_container").classList.add("active");
        });
  
        controls_div.appendChild(edit_btn);
        controls_div.appendChild(delete_btn);
        td_controls.appendChild(controls_div);
        new_tr.appendChild(td_controls);
  
        table.appendChild(new_tr);
      }
      
      document.getElementById("modal__addEdit_container").classList.remove("active");
    });

  document.getElementById("modal__addEdit_cancelBtn").addEventListener("click", (e) => {
    document.getElementById("modal__addEdit_container").classList.remove("active");
    studentToEdit = null;
  });

  document.getElementById("modal__addEdit_closeBtn").addEventListener("click", (e) => {
    document.getElementById("modal__addEdit_container").classList.remove("active");
    studentToEdit = null;
  });
});
