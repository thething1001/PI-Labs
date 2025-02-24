const table = document.getElementById("my-table");
const select_all_checkbox = document.getElementById("select-all");

function addNewStudent() {
    const new_tr = document.createElement("tr");
    const td_selector = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("select-student");
    td_selector.appendChild(checkbox);
    new_tr.appendChild(td_selector);

    const td_group = document.createElement("td");
    const node2 = document.createTextNode("PZ-22");
    td_group.appendChild(node2);
    new_tr.appendChild(td_group);

    const td_name = document.createElement("td");
    const node3 = document.createTextNode("Bohdan Hamela");
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
    status_img.src = "assets/bell.png";
    td_status.appendChild(status_img);
    new_tr.appendChild(td_status);

    const td_controls = document.createElement("td");
    const edit_btn = document.createElement("button");
    const edit_img = document.createElement("img");
    edit_img.src = "assets/bell.png";
    edit_btn.appendChild(edit_img);
    const delete_btn = document.createElement("button");
    td_controls.appendChild(edit_btn);
    td_controls.appendChild(delete_btn);
    new_tr.appendChild(td_controls);

    
    table.appendChild(new_tr);
}

function selectAllPressed(){
    const checkboxes = document.querySelectorAll(".select-student");
    checkboxes.forEach(checkbox => {
        checkbox.checked = select_all_checkbox.checked;
    });
}