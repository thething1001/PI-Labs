const table = document.getElementById("main__table");
const paginationContainer = document.querySelector(".main__table_pagination");

let studentsList = [];
let page = 1;
const studentsPerPage = 7;

let selectedRows = [];
let studentToEdit;

let isValid = [false, false, false, false, false];

const validationPatterns = {
  name: /^[A-Za-z]{2,50}$/,
};

async function fetchStudents() {
  try {
    const auth_token = sessionStorage.getItem("auth_token");
    const response = await fetch(`${BASE_API_URL}/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status == 401) {
      tokenExpired();
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    studentsList = await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

// Display students for the current page
function displayStudents() {
  table.innerHTML = `
    <tr class="main__table_header">
      <th>
        <input type="checkbox" id="main__table_selectAll" name="main__table_selectAll" value="Select All"/>
        <label for="main__table_selectAll">Select All</label>
      </th>
      <th>Group</th>
      <th>Name</th>
      <th>Gender</th>
      <th>Birthday</th>
      <th>Status</th>
      <th>Options</th>
    </tr>
  `;

  // Calculate pagination
  const totalPages = Math.ceil(studentsList.length / studentsPerPage);
  page = Math.max(1, Math.min(page, totalPages)); // Ensure valid page

  // Slice students for current page
  const start = (page - 1) * studentsPerPage;
  const end = start + studentsPerPage;
  studentsList.slice(start, end).forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="main__table_selector_container">
          <input type="checkbox" id="main__table_selectStudent-${
            student.id
          }" value="${student.id}" class="main__table_selectStudent"/>
          <label for="main__table_selectStudent-${student.id}">${
      student.id
    }</label>
        </div>
      </td>
      <td>${student.group_name}</td>
      <td>${student.first_name} ${student.last_name}</td>
      <td>${student.gender}</td>
      <td>${student.birthday}</td>
      <td><img class="main__table_statusImg" src="../assets/${
        student.status ? "online.svg" : "offline.svg"
      }" alt="Status"/></td>
      <td>
        <div class="main__table_controls_container">
          <button class="main__table_controls_button edit-btn"><img src="../assets/edit.svg" alt="Edit"/></button>
          <button class="main__table_controls_button delete-btn"><img src="../assets/trash.svg" alt="Delete"/></button>
        </div>
      </td>
    `;
    table.appendChild(row);
  });

  updatePagination(totalPages);

  attachRowListeners();
}

function updatePagination(totalPages) {
  paginationContainer.innerHTML = '';

  if (totalPages > 1) {
    paginationContainer.innerHTML = `
      <button class="pagination-btn" ${page === 1 ? "disabled" : ""} data-page="${page - 1}"><</button>
    `;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
          <button class="pagination-btn" ${i === page ? "disabled" : ""} data-page="${i}">${i}</button>
        `;
      }
    } else {
      paginationContainer.innerHTML += `
        <button class="pagination-btn" ${1 === page ? "disabled" : ""} data-page="1">1</button>
      `;

      if (page <= 4) {
        for (let i = 2; i <= 5; i++) {
          paginationContainer.innerHTML += `
            <button class="pagination-btn" ${i === page ? "disabled" : ""} data-page="${i}">${i}</button>
          `;
        }
        paginationContainer.innerHTML += `<span>...</span>`;
      } else if (page >= totalPages - 3) {
        paginationContainer.innerHTML += `<span>...</span>`;
        for (let i = totalPages - 4; i < totalPages; i++) {
          paginationContainer.innerHTML += `
            <button class="pagination-btn" ${i === page ? "disabled" : ""} data-page="${i}">${i}</button>
          `;
        }
      } else {
        paginationContainer.innerHTML += `<span>...</span>`;
        for (let i = page - 1; i <= page + 1; i++) {
          paginationContainer.innerHTML += `
            <button class="pagination-btn" ${i === page ? "disabled" : ""} data-page="${i}">${i}</button>
          `;
        }
        paginationContainer.innerHTML += `<span>...</span>`;
      }

      paginationContainer.innerHTML += `
        <button class="pagination-btn" ${totalPages === page ? "disabled" : ""} data-page="${totalPages}">${totalPages}</button>
      `;
    }

    paginationContainer.innerHTML += `
      <button class="pagination-btn" ${page === totalPages ? "disabled" : ""} data-page="${page + 1}">></button>
    `;

    document.querySelectorAll(".pagination-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newPage = parseInt(btn.getAttribute("data-page"));
        if (!isNaN(newPage)) {
          page = newPage;
          displayStudents();
        }
      });
    });
  }
}

async function updateTable() {
  await fetchStudents();
  displayStudents();
}

function attachRowListeners() {
  const selectAll = document.getElementById("main__table_selectAll");
  if (selectAll) {
    selectAll.addEventListener("change", (e) => {
      document
        .querySelectorAll(".main__table_selectStudent")
        .forEach((checkbox) => {
          checkbox.checked = e.target.checked;
        });
    });
  }

  document
    .querySelectorAll(".main__table_selectStudent")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        if (!e.target.checked) {
          document.getElementById("main__table_selectAll").checked = false;
        } else if (
          Array.from(
            document.querySelectorAll(".main__table_selectStudent")
          ).every((c) => c.checked)
        ) {
          document.getElementById("main__table_selectAll").checked = true;
        }
      });
    });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (!row.querySelector(".main__table_selectStudent").checked) return;
      const id = row.querySelector(".main__table_selectStudent").value;
      studentToEdit = { id };
      document.getElementById("modal__addEdit_heading").textContent =
        "Edit student";
      document.getElementById("modal__addEdit_GroupInput").value =
        row.cells[1].textContent;
      const [firstName, lastName] = row.cells[2].textContent.split(" ");
      document.getElementById("modal__addEdit_FirstNameInput").value =
        firstName;
      document.getElementById("modal__addEdit_LastNameInput").value = lastName;
      document.getElementById("modal__addEdit_GenderInput").value =
        row.cells[3].textContent;
      document.getElementById("modal__addEdit_BirthdayInput").value =
        row.cells[4].textContent;
      document
        .getElementById("modal__addEdit_container")
        .classList.add("active");
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (!row.querySelector(".main__table_selectStudent").checked) return;
      selectedRows = Array.from(
        document.querySelectorAll(".main__table_selectStudent:checked")
      ).map((c) => c.closest("tr"));
      const message =
        selectedRows.length > 1
          ? "Are you sure you want to delete multiple users?"
          : `Are you sure you want to delete user ${selectedRows[0].cells[2].textContent}?`;
      document.getElementById("modal__delete_text").textContent = message;
      document
        .getElementById("modal__delete_container")
        .classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateTable();

  // Modal Backdrop
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      e.target.closest(".modal-container").classList.remove("active");
    });
  });

  // Modal Delete Listeners
  document
    .getElementById("modal__delete_confirmBtn")
    .addEventListener("click", async (e) => {
      const ids = selectedRows.map(
        (row) => row.querySelector(".main__table_selectStudent").value
      );
      try {
        const auth_token = sessionStorage.getItem("auth_token");
        const response = await fetch(`${BASE_API_URL}/students`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`,
          },
          body: JSON.stringify({ ids: ids }),
        });
        if (response.status == 401) {
          tokenExpired();
          return;
        }
        if (response.ok) {
          updateTable();
          selectedRows = [];
          document
            .getElementById("modal__delete_container")
            .classList.remove("active");
        } else {
          console.error("Failed to delete students");
        }
      } catch (error) {
        console.error("Error deleting students:", error);
      }
    });

  document
    .getElementById("modal__delete_cancelBtn")
    .addEventListener("click", () => {
      document
        .getElementById("modal__delete_container")
        .classList.remove("active");
    });

  document
    .getElementById("modal__delete_closeBtn")
    .addEventListener("click", () => {
      document
        .getElementById("modal__delete_container")
        .classList.remove("active");
    });

  // Modal Add/Edit Listeners
  document
    .getElementById("main__addStudentBtn")
    .addEventListener("click", () => {
      document
        .querySelectorAll(".modal__addEdit_input_container")
        .forEach((c) => c.classList.remove("error"));
      document.getElementById("modal__addEdit_form").reset();
      document.getElementById("modal__addEdit_heading").textContent =
        "Add new student";
      studentToEdit = null;
      document
        .getElementById("modal__addEdit_container")
        .classList.add("active");
    });

  // Modal Add/Edit Validators
  const groupInput = document.getElementById("modal__addEdit_GroupInput");
  const firstNameInput = document.getElementById(
    "modal__addEdit_FirstNameInput"
  );
  const lastNameInput = document.getElementById("modal__addEdit_LastNameInput");
  const genderInput = document.getElementById("modal__addEdit_GenderInput");
  const birthdayInput = document.getElementById("modal__addEdit_BirthdayInput");

  groupInput.addEventListener("change", (e) => {
    isValid[0] = e.target.value !== "";
    e.target.parentElement.parentElement.classList.toggle("error", !isValid[0]);
  });

  firstNameInput.addEventListener("change", (e) => {
    isValid[1] = validationPatterns.name.test(e.target.value);
    e.target.parentElement.parentElement.classList.toggle("error", !isValid[1]);
  });

  lastNameInput.addEventListener("change", (e) => {
    isValid[2] = validationPatterns.name.test(e.target.value);
    e.target.parentElement.parentElement.classList.toggle("error", !isValid[2]);
  });

  genderInput.addEventListener("change", (e) => {
    isValid[3] = e.target.value !== "";
    e.target.parentElement.parentElement.classList.toggle("error", !isValid[3]);
  });

  birthdayInput.addEventListener("change", (e) => {
    isValid[4] = false;
    e.target.parentElement.parentElement.classList.add("error");
    if (e.target.value) {
      const birthDate = new Date(e.target.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      if (age >= 16 && age <= 100) {
        isValid[4] = true;
        e.target.parentElement.parentElement.classList.remove("error");
      } else {
        e.target.parentElement.querySelector(".error-message").textContent =
          "Age must be 16-100";
      }
    } else {
      e.target.parentElement.querySelector(".error-message").textContent =
        "Required";
    }
  });

  document
    .getElementById("modal__addEdit_form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      if (e.submitter !== document.getElementById("modal__addEdit_confirmBtn"))
        return;

      const event = new Event("change");
      groupInput.dispatchEvent(event);
      firstNameInput.dispatchEvent(event);
      lastNameInput.dispatchEvent(event);
      genderInput.dispatchEvent(event);
      birthdayInput.dispatchEvent(event);

      if (!isValid.every((item) => item)) return;
      isValid = [false, false, false, false, false];

      const studentData = {
        group_name: groupInput.value,
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        gender: genderInput.value,
        birthday: birthdayInput.value,
        status: false, // Default status
      };

      try {
        const method = studentToEdit ? "PUT" : "POST";
        const auth_token = sessionStorage.getItem("auth_token");
        const response = await fetch(
          `${BASE_API_URL}/students${
            studentToEdit ? `/${studentToEdit.id}` : ""
          }`,
          {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify(studentData),
          }
        );
        if (response.status == 401) {
          tokenExpired();
          return;
        }
        if (response.ok) {
          updateTable();
          document
            .getElementById("modal__addEdit_container")
            .classList.remove("active");
          studentToEdit = null;
        } else {
          const data = await response.json();
          const errorMessage = data.errors.join("; ");
          document.getElementById("modal__error_text").textContent =
            errorMessage;
          document
            .getElementById("modal__error_container")
            .classList.add("active");
        }
      } catch (error) {
        document.getElementById("modal__error_text").textContent =
          "An unexpected error occurred while saving the student.";
        document
          .getElementById("modal__error_container")
          .classList.add("active");
      }
    });

  document
    .getElementById("modal__addEdit_cancelBtn")
    .addEventListener("click", () => {
      document
        .getElementById("modal__addEdit_container")
        .classList.remove("active");
      studentToEdit = null;
    });

  document
    .getElementById("modal__addEdit_closeBtn")
    .addEventListener("click", () => {
      document
        .getElementById("modal__addEdit_container")
        .classList.remove("active");
      studentToEdit = null;
    });

  // Modal Error Listeners
  document
    .getElementById("modal__error_closeBtn")
    .addEventListener("click", () => {
      document
        .getElementById("modal__error_container")
        .classList.remove("active");
    });

  document
    .getElementById("modal__error_okBtn")
    .addEventListener("click", () => {
      document
        .getElementById("modal__error_container")
        .classList.remove("active");
    });
});
