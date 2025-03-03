const table = document.getElementById("main__table");
const select_all_checkbox = document.getElementById("main__table_selectAll");

let count = 0;
let selectedRows = [];
let studentsList = [];
let studentToEdit;

document.addEventListener("DOMContentLoaded", (e) => {
  // Table Listeners
  document.getElementById("main__table_selectAll").addEventListener("change", (e) => {
    const checkboxes = document.querySelectorAll(".main__table_selectStudent");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = select_all_checkbox.checked;
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

    document.getElementById("modal__delete").style.display = "none";
  });

  document.getElementById("modal__delete_cancelBtn").addEventListener("click", (e) => {
    document.getElementById("modal__delete").style.display = "none";
  });

  document.getElementById("modal__delete_closeBtn").addEventListener("click", (e) => {
    document.getElementById("modal__delete").style.display = "none";
  });

  // Modal AddEdit Listeners
  document.getElementById("main__addStudentBtn").addEventListener("click", (e) => {
    document.getElementById("modal__addEdit_form").reset();
    document.getElementById("modal__addEdit_heading").textContent =
      "Add new student";
    document.getElementById("modal__addEdit").style.display = "block";
  });

  document
    .getElementById("modal__addEdit_form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.submitter != document.getElementById("modal__addEdit_confirmBtn")) return;
      count++;
      const group = document.getElementById("modal__addEdit_GroupInput").value;
      const firstName = document.getElementById("modal__addEdit_FirstNameInput").value;
      const lastName = document.getElementById("modal__addEdit_LastNameInput").value;
      const gender = document.getElementById("modal__addEdit_GenderInput").value;
      const birthday = document.getElementById("modal__addEdit_BirthdayInput").value;
      studentsList = [
        ...studentsList,
        {
          id: count,
          group: group,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          birthday: birthday,
        },
      ];
      console.log(studentsList);

      const new_tr = document.createElement("tr");
      const td_selector = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `main__table_selectStudent-${count}`;
      checkbox.value = count;
      checkbox.classList.add("main__table_selectStudent");
      td_selector.appendChild(checkbox);

      const id_label = document.createElement("label");
      id_label.textContent = count;
      // id_label.style.opacity = 0;
      // id_label.style.position = "absolute";
      id_label.setAttribute("for", `main__table_selectStudent-${count}`);
      td_selector.appendChild(id_label);

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
      status_img.src = "../assets/online.svg";
      status_img.alt = "Status";
      td_status.appendChild(status_img);
      new_tr.appendChild(td_status);

      const td_controls = document.createElement("td");
      const controls_div = document.createElement("div");
      controls_div.classList.add("main__table_controls_container");

      const edit_btn = document.createElement("button");
      edit_btn.classList.add("main__table_controls_button");
      const edit_img = document.createElement("img");
      edit_img.src = "../assets/edit.png";
      edit_img.alt = "Edit";
      edit_btn.appendChild(edit_img);
      edit_btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        if (row.firstChild.firstChild.checked == false) return;
        const id = Number(row.firstChild.lastChild.textContent);
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
        document.getElementById("modal__addEdit").style.display = "block";
      });

      const delete_btn = document.createElement("button");
      delete_btn.classList.add("main__table_controls_button");
      const delete_img = document.createElement("img");
      delete_img.src = "../assets/close.png";
      delete_img.alt = "Delete";
      delete_btn.appendChild(delete_img);
      delete_btn.addEventListener("click", (e) => {
        if (e.target.closest("tr").firstChild.firstChild.checked == false)
          return;
        console.log("show modal delete");

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
        document.getElementById("modal__delete").style.display = "block";
      });

      controls_div.appendChild(edit_btn);
      controls_div.appendChild(delete_btn);
      td_controls.appendChild(controls_div);
      new_tr.appendChild(td_controls);

      table.appendChild(new_tr);

      document.getElementById("modal__addEdit").style.display = "none";
    });

  document.getElementById("modal__addEdit_cancelBtn").addEventListener("click", (e) => {
    document.getElementById("modal__addEdit").style.display = "none";
  });

  document.getElementById("modal__addEdit_closeBtn").addEventListener("click", (e) => {
    document.getElementById("modal__addEdit").style.display = "none";
  });
});
