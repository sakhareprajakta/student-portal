// live preview
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const phoneInput = document.getElementById("phone");

function updatePreview() {
  document.getElementById("previewName").innerText = nameInput.value || "Your Name";
  document.getElementById("previewCourse").innerText = "Selected Course: " + (courseInput.value || "-");
  document.getElementById("previewEmail").innerText = "Email: " + (emailInput.value || "-");
  document.getElementById("previewPhone").innerText = "Phone: " + (phoneInput.value || "-");
}

[nameInput, emailInput, courseInput, phoneInput].forEach(el=>{
  el && el.addEventListener("input", updatePreview);
});
updatePreview();

// client-side validation
function validateForm() {
  const msg = document.getElementById("formMsg");
  msg.innerText = "";
  if (!nameInput.value.trim()) { msg.innerText = "Name required"; return false; }
  if (!emailInput.value.includes("@")) { msg.innerText = "Enter valid email"; return false; }
  if (!courseInput.value.trim()) { msg.innerText = "Course required"; return false; }
  return true;
}

// Save via API
document.getElementById("saveApi").addEventListener("click", async () => {
  if (!validateForm()) return;
  const payload = {
    name: nameInput.value,
    email: emailInput.value,
    course: courseInput.value,
    phone: phoneInput.value
  };
  try {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      alert("Saved via API");
      loadStudents();
    } else {
      alert("Error: " + (data.error || JSON.stringify(data)));
    }
  } catch (e) { alert("Network error"); }
});

// Load students
async function loadStudents(){
  const ul = document.getElementById("studentList");
  ul.innerHTML = "<li class='list-group-item'>Loading...</li>";
  try {
    const res = await fetch("/api/students"); //api calling path
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      ul.innerHTML = data.map(s => `<li class="list-group-item">${s.id}. ${s.name} — ${s.email} — ${s.course}</li>`).join("");
    } else {
      ul.innerHTML = "<li class='list-group-item'>No students</li>";
    }
  } catch(e){
    ul.innerHTML = "<li class='list-group-item text-danger'>Failed to load</li>";
  }
}

document.getElementById("loadStudents").addEventListener("click", loadStudents);
