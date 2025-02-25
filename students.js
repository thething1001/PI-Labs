const table = document.getElementById("my-table");
const select_all_checkbox = document.getElementById("select-all");
let count = 0;
let selectedRow;

function addNewStudent() {
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
    td_group.textContent = "PZ-22"
    new_tr.appendChild(td_group);

    const td_name = document.createElement("td");
    td_name.textContent = "Bohdan Hamela " + count;
    new_tr.appendChild(td_name);

    const td_gender = document.createElement("td");
    td_gender.textContent = "Male";
    new_tr.appendChild(td_gender);

    const td_birthday = document.createElement("td");
    td_birthday.textContent = new Date().toISOString().split('T')[0];
    new_tr.appendChild(td_birthday);

    const td_status = document.createElement("td");
    const status_img = document.createElement("img");
    status_img.classList.add("status-img");
    status_img.src = "assets/online.png";
    td_status.appendChild(status_img);
    new_tr.appendChild(td_status);

    const td_controls = document.createElement("td");
    const tcontrols_div = document.createElement("div");
    tcontrols_div.classList.add("controls-container");

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
    delete_btn.onclick = () => deleteStudent(delete_btn);;
    
    tcontrols_div.appendChild(edit_btn);
    tcontrols_div.appendChild(delete_btn);
    td_controls.appendChild(tcontrols_div)
    new_tr.appendChild(td_controls);

    table.appendChild(new_tr);
}

function selectAllPressed(){
    const checkboxes = document.querySelectorAll(".select-student");
    checkboxes.forEach(checkbox => {
        checkbox.checked = select_all_checkbox.checked;
    });
}

function deleteStudent(button){
    const row = button.closest("tr");
    const name = row.cells[2].innerText;
    selectedRow = row;

    document.getElementById("modalText").textContent = `Are you sure you want to delete user ${name}?`;
    document.getElementById("modal").style.display = "block";
}

function onConfirmDelete(){
    if (selectedRow) {
        selectedRow.remove();
    }
    document.getElementById("modal").style.display = "none";
}

function onCancelDelete(){
    document.getElementById("modal").style.display = "none";
}

