const table = document.getElementById("my-table");
const select_all_checkbox = document.getElementById("select-all");
let count = 0;
let selectedRow;

document.addEventListener("DOMContentLoaded", (e) => {
  document.getElementById("select-all").addEventListener("change", (e) => {
    const checkboxes = document.querySelectorAll(".select-student");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = select_all_checkbox.checked;
    });
  });

  document.getElementById("confirmDelete").addEventListener("click", (e) => {
    if (selectedRow) {
      selectedRow.remove();
    }
    document.getElementById("modalDeleteStudent").style.display = "none";
  });

  document.getElementById("cancelDelete").addEventListener("click", (e) => {
    document.getElementById("modalDeleteStudent").style.display = "none";
  });

  document.getElementById("add-student-btn").addEventListener("click", (e) => {
    count++;
    const new_tr = document.createElement("tr");
    const td_selector = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = count;
    checkbox.classList.add("select-student");
    td_selector.appendChild(checkbox);
    new_tr.appendChild(td_selector);

    const td_group = document.createElement("td");
    td_group.textContent = "PZ-22";
    new_tr.appendChild(td_group);

    const td_name = document.createElement("td");
    td_name.textContent = "Bohdan Hamela " + count;
    new_tr.appendChild(td_name);

    const td_gender = document.createElement("td");
    td_gender.textContent = "Male";
    new_tr.appendChild(td_gender);

    const td_birthday = document.createElement("td");
    td_birthday.textContent = new Date().toISOString().split("T")[0];
    new_tr.appendChild(td_birthday);

    const td_status = document.createElement("td");
    const status_img = document.createElement("img");
    status_img.classList.add("status-img");
    status_img.src = "assets/online.png";
    td_status.appendChild(status_img);
    new_tr.appendChild(td_status);

    const td_controls = document.createElement("td");
    const controls_div = document.createElement("div");
    controls_div.classList.add("controls-container");

    const edit_btn = document.createElement("button");
    edit_btn.classList.add("control-button");
    const edit_img = document.createElement("img");
    edit_img.src = "assets/edit.png";
    edit_btn.appendChild(edit_img);

    const delete_btn = document.createElement("button");
    delete_btn.classList.add("control-button");
    const delete_img = document.createElement("img");
    delete_img.src = "assets/close.png";
    delete_btn.appendChild(delete_img);
    delete_btn.addEventListener("click", (e) => {
      console.log("show modal delete");
      const row = e.target.closest("tr");
      const name = row.cells[2].innerText;
      selectedRow = row;

      document.getElementById(
        "modalDeleteText"
      ).textContent = `Are you sure you want to delete user ${name}?`;
      document.getElementById("modalDeleteStudent").style.display = "block";
    });

    controls_div.appendChild(edit_btn);
    controls_div.appendChild(delete_btn);
    td_controls.appendChild(controls_div);
    new_tr.appendChild(td_controls);

    table.appendChild(new_tr);
  });
});
