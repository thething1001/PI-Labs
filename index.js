const table = document.getElementById("my-table");
const select_all_checkbox = document.getElementById("select-all");
let count = 0;

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
    const node2 = document.createTextNode("PZ-22");
    td_group.appendChild(node2);
    new_tr.appendChild(td_group);

    const td_name = document.createElement("td");
    const node3 = document.createTextNode("Bohdan Hamela " + count);
    td_name.appendChild(node3);
    new_tr.appendChild(td_name);

    const td_gender = document.createElement("td");
    const node4 = document.createTextNode("Male");
    td_gender.appendChild(node4);
    new_tr.appendChild(td_gender);

    const td_birthday = document.createElement("td");
    const node5 = document.createTextNode(new Date().toISOString().split('T')[0]);
    td_birthday.appendChild(node5);
    new_tr.appendChild(td_birthday);

    const td_status = document.createElement("td");
    const status_img = document.createElement("img");
    status_img.classList.add("status-img");
    status_img.src = "assets/bell.png";
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
    delete_btn.onclick =() => deleteStudent(delete_btn);;
    
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
    table.removeChild(row);
}