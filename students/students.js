const table = document.getElementById("my-table");
const select_all_checkbox = document.getElementById("select-all");

let count = 0;
let selectedRows = [];
let studentsList = [];
let studentToEdit;

document.addEventListener("DOMContentLoaded", (e) => {
  // Table Listeners
  document.getElementById("select-all").addEventListener("change", (e) => {
    const checkboxes = document.querySelectorAll(".select-student");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = select_all_checkbox.checked;
    });
  });

  document.getElementById("add-student-btn").addEventListener("click", (e) => {
    document.getElementById("modalAddEditForm").reset();
    document.getElementById("modalAddEditHeading").textContent =
      "Add new student";
    document.getElementById("modalAddEditStudent").style.display = "block";
  });

  // Modal Delete Listeners
  document.getElementById("confirmDelete").addEventListener("click", (e) => {
    selectedRows.forEach((row) => {
      studentsList = studentsList.filter(
        (s) => s.id !== Number(row.lastChild.textContent)
      );
      row.remove();
      console.log(studentsList);
    });
    selectedRows = [];

    document.getElementById("modalDeleteStudent").style.display = "none";
  });

  document.getElementById("cancelDelete").addEventListener("click", (e) => {
    document.getElementById("modalDeleteStudent").style.display = "none";
  });

  document.getElementById("closeDelete").addEventListener("click", (e) => {
    document.getElementById("modalDeleteStudent").style.display = "none";
  });

  // Modal AddEdit Listeners
  document
    .getElementById("modalAddEditForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.submitter != document.getElementById("confirmAddEdit")) return;
      count++;
      const group = document.getElementById("AddEditGroupInput").value;
      const firstName = document.getElementById("AddEditFirstNameInput").value;
      const lastName = document.getElementById("AddEditLastNameInput").value;
      const gender = document.getElementById("AddEditGenderInput").value;
      const birthday = document.getElementById("AddEditBirthdayInput").value;
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
      checkbox.id = `select-student-${count}`;
      checkbox.value = count;
      checkbox.classList.add("select-student");
      td_selector.appendChild(checkbox);

      const id_label = document.createElement("label");
      id_label.textContent = count;
      // id_label.style.display = "none";
      id_label.setAttribute("for", `select-student-${count}`);
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
      status_img.classList.add("status-img");
      status_img.src = "../assets/online.png";
      status_img.alt = "Status";
      td_status.appendChild(status_img);
      new_tr.appendChild(td_status);

      const td_controls = document.createElement("td");
      const controls_div = document.createElement("div");
      controls_div.classList.add("controls-container");

      const edit_btn = document.createElement("button");
      edit_btn.classList.add("control-button");
      const edit_img = document.createElement("img");
      edit_img.src = "../assets/edit.png";
      edit_img.alt = "Edit";
      edit_btn.appendChild(edit_img);
      edit_btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        if (row.firstChild.firstChild.checked == false) return;
        console.log("show modal edit");
        const id = Number(row.lastChild.textContent);
        studentToEdit = studentsList.find((s) => s.id === id);

        document.getElementById("modalAddEditForm").reset();
        document.getElementById("modalAddEditHeading").textContent =
          "Edit student";
        document.getElementById("AddEditGroupInput").value =
          studentToEdit.group;
        document.getElementById("AddEditFirstNameInput").value =
          studentToEdit.firstName;
        document.getElementById("AddEditLastNameInput").value =
          studentToEdit.lastName;
        document.getElementById("AddEditGenderInput").value =
          studentToEdit.gender;
        document.getElementById("AddEditBirthdayInput").value =
          studentToEdit.birthday;
        document.getElementById("modalAddEditStudent").style.display = "block";
      });

      const delete_btn = document.createElement("button");
      delete_btn.classList.add("control-button");
      const delete_img = document.createElement("img");
      delete_img.src = "../assets/close.png";
      delete_img.alt = "Delete";
      delete_btn.appendChild(delete_img);
      delete_btn.addEventListener("click", (e) => {
        if (e.target.closest("tr").firstChild.firstChild.checked == false)
          return;
        console.log("show modal delete");

        const checkboxes = document.querySelectorAll(".select-student");
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

        document.getElementById("modalDeleteText").textContent = message;
        document.getElementById("modalDeleteStudent").style.display = "block";
      });

      controls_div.appendChild(edit_btn);
      controls_div.appendChild(delete_btn);
      td_controls.appendChild(controls_div);
      new_tr.appendChild(td_controls);

      table.appendChild(new_tr);

      document.getElementById("modalAddEditStudent").style.display = "none";
    });

  document.getElementById("cancelAddEdit").addEventListener("click", (e) => {
    document.getElementById("modalAddEditStudent").style.display = "none";
  });

  document.getElementById("closeAddEdit").addEventListener("click", (e) => {
    document.getElementById("modalAddEditStudent").style.display = "none";
  });
});
