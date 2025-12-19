// بيانات الطلاب
function getStudents() { return JSON.parse(localStorage.getItem('students') || '[]'); }
function saveStudents(s) { localStorage.setItem('students', JSON.stringify(s)); }

// تبديل الصفحات
function showSupervisor() {
    document.getElementById('homePage').style.display='none';
    document.getElementById('supervisorPage').style.display='block';
    renderStudents();
}

function showAdmin() {
    document.getElementById('homePage').style.display='none';
    document.getElementById('adminPage').style.display='block';
}

function backHome() {
    document.getElementById('homePage').style.display='flex';
    document.getElementById('supervisorPage').style.display='none';
    document.getElementById('adminPage').style.display='none';
}

function backSupervisor() {
    document.getElementById('studentPage').style.display='none';
    document.getElementById('supervisorPage').style.display='block';
}

// إضافة طالب
function addStudent() {
    const s = getStudents();
    const id = Date.now();
    const newStudent = {
        id,
        name: document.getElementById('name').value,
        className: document.getElementById('className').value,
        housing: document.getElementById('housing').value,
        phone: document.getElementById('phone').value,
        problems: []
    };
    s.push(newStudent);
    saveStudents(s);
    renderStudents();
    alert("تم إضافة الطالب!");
}

// عرض قائمة الطلاب
function renderStudents() {
    const s = getStudents();
    let h = '<tr><th>رقم الملف</th><th>الاسم</th><th>فتح</th></tr>';
    s.forEach(st => {
        h += `<tr><td>${st.id}</td><td>${st.name}</td><td><button onclick="openStudent(${st.id})">فتح</button></td></tr>`;
    });
    document.getElementById('studentsTable').innerHTML = h;
}

// فتح ملف الطالب
let currentStudent = null;
function openStudent(id) {
    const s = getStudents();
    currentStudent = s.find(st => st.id == id);
    if(currentStudent){
        document.getElementById('supervisorPage').style.display='none';
        document.getElementById('adminPage').style.display='none';
        document.getElementById('studentPage').style.display='block';
        renderStudentInfo();
        renderProblems();
    }
}

// عرض معلومات الطالب
function renderStudentInfo() {
    if(currentStudent){
        document.getElementById('studentInfo').innerHTML =
        `<b>الاسم:</b> ${currentStudent.name}<br>
         <b>الفصل:</b> ${currentStudent.className}<br>
         <b>السكن:</b> ${currentStudent.housing}<br>
         <b>الهاتف:</b> ${currentStudent.phone}`;
    }
}

// إضافة مشكلة
function addProblem() {
    if(currentStudent){
        currentStudent.problems.push({
            subject: document.getElementById('subject').value,
            part: document.getElementById('part').value,
            type: document.getElementById('type').value,
            teacher: document.getElementById('teacher').value,
            notes: document.getElementById('notes').value
        });
        const s = getStudents();
        const index = s.findIndex(st => st.id == currentStudent.id);
        s[index] = currentStudent;
        saveStudents(s);
        renderProblems();
    }
}

// عرض مشاكل الطالب
function renderProblems() {
    if(currentStudent){
        let h = '<tr><th>المادة</th><th>الجزئية</th><th>الأستاذ</th><th>نوع المشكلة</th><th>ملاحظات</th></tr>';
        currentStudent.problems.forEach(p=>{
            h += `<tr><td>${p.subject}</td><td>${p.part}</td><td>${p.teacher}</td><td>${p.type}</td><td>${p.notes}</td></tr>`;
        });
        document.getElementById('problemsTable').innerHTML=h;
    }
}

// البحث الإداري بعرض كل التفاصيل
function search() {
    const q = document.getElementById('query').value;
    const s = getStudents();
    let h = '';

    s.forEach(st => {
        if(st.name.includes(q) || st.housing.includes(q) || st.className.includes(q) || 
           st.problems.some(p => p.subject.includes(q) || p.part.includes(q) || p.teacher.includes(q))) {

            h += `<tr>
                    <td>${st.id}</td>
                    <td>${st.name}</td>
                    <td>${st.className}</td>
                    <td>${st.housing}</td>
                    <td>${st.phone}</td>
                    <td>
                        <button onclick="openStudent(${st.id})">فتح ملف الطالب</button>
                        <table border="1" style="margin-top:5px;width:100%">
                            <tr><th>المادة</th><th>الجزئية</th><th>الأستاذ</th><th>نوع المشكلة</th><th>ملاحظات</th></tr>`;

            st.problems.forEach(p => {
                h += `<tr>
                        <td>${p.subject}</td>
                        <td>${p.part}</td>
                        <td>${p.teacher}</td>
                        <td>${p.type}</td>
                        <td>${p.notes}</td>
                      </tr>`;
            });

            h += `</table></td></tr>`;
        }
    });

    if(h === '') h = '<tr><td colspan="6">لا توجد نتائج مطابقة</td></tr>';

    document.getElementById('results').innerHTML = 
        '<tr><th>رقم الملف</th><th>الاسم</th><th>الفصل</th><th>السكن</th><th>رقم الهاتف</th><th>المشاكل</th></tr>' + h;
}
