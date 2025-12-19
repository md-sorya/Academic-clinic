// البيانات
function getStudents() { return JSON.parse(localStorage.getItem('students') || '[]'); }
function saveStudents(s) { localStorage.setItem('students', JSON.stringify(s)); }

// صفحات
function showSupervisor(){
    document.getElementById('homePage').style.display='none';
    document.getElementById('supervisorPage').style.display='block';
    renderStudents();
}
function showAdmin(){
    document.getElementById('homePage').style.display='none';
    document.getElementById('adminPage').style.display='block';
}
function backHome(){
    document.getElementById('homePage').style.display='flex';
    document.getElementById('supervisorPage').style.display='none';
    document.getElementById('adminPage').style.display='none';
}
function backSupervisor(){
    document.getElementById('studentPage').style.display='none';
    document.getElementById('supervisorPage').style.display='block';
}

// إضافة طالب
function addStudent(){
    const s=getStudents();
    const id=Date.now();
    const newStudent={id,name:document.getElementById('name').value,className:document.getElementById('className').value,housing:document.getElementById('housing').value,phone:document.getElementById('phone').value,problems:[],finalResults:[]};
    s.push(newStudent);
    saveStudents(s);
    renderStudents();
    alert("تم إضافة الطالب!");
}

// عرض الطلاب
function renderStudents(){
    const s=getStudents();
    let h='<tr><th>رقم الملف</th><th>الاسم</th><th>فتح</th><th>حذف</th></tr>';
    s.forEach(st=>{
        h+=`<tr>
            <td>${st.id}</td>
            <td>${st.name}</td>
            <td><button onclick="openStudent(${st.id})">فتح</button></td>
            <td><button onclick="deleteStudent(${st.id})">حذف</button></td>
        </tr>`;
    });
    document.getElementById('studentsTable').innerHTML=h;
}
function deleteStudent(id){
    if(confirm("هل تريد حذف هذا الطالب بالكامل؟")){
        let s=getStudents();
        s=s.filter(st=>st.id!=id);
        saveStudents(s);
        renderStudents();
    }
}

// فتح ملف الطالب
let currentStudent=null;
function openStudent(id){
    const s=getStudents();
    currentStudent=s.find(st=>st.id==id);
    if(currentStudent){
        document.getElementById('supervisorPage').style.display='none';
        document.getElementById('adminPage').style.display='none';
        document.getElementById('studentPage').style.display='block';
        renderStudentInfo();
        renderProblems();
    }
}

// تعديل بيانات الطالب
function renderStudentInfo(){
    if(currentStudent){
        let infoHtml=`
        <label>الاسم:</label><input id="editName" value="${currentStudent.name}">
        <label>الفصل:</label><input id="editClass" value="${currentStudent.className}">
        <label>السكن:</label><input id="editHousing" value="${currentStudent.housing}">
        <label>الهاتف:</label><input id="editPhone" value="${currentStudent.phone}">
        <button onclick="saveStudentEdits()">حفظ التعديلات</button>
        <h3>النتيجة النهائية</h3>
        <table id="finalResultsTable">
            <tr><th>اسم المشكلة</th><th>الدرجة</th><th>تعديل</th></tr>`;
        currentStudent.finalResults.forEach((res,index)=>{
            infoHtml+=`<tr>
                <td>${res.problemName}</td>
                <td><input id="grade${index}" value="${res.grade}"></td>
                <td><button onclick="saveGrade(${index})">حفظ</button></td>
            </tr>`;
        });
        infoHtml+=`</table>
        <input id="newProblemName" placeholder="اسم المشكلة">
        <input id="newGrade" placeholder="الدرجة">
        <button onclick="addFinalResult()">إضافة نتيجة جديدة</button>`;
        document.getElementById('studentInfo').innerHTML=infoHtml;
    }
}
function saveStudentEdits(){
    currentStudent.name=document.getElementById('editName').value;
    currentStudent.className=document.getElementById('editClass').value;
    currentStudent.housing=document.getElementById('editHousing').value;
    currentStudent.phone=document.getElementById('editPhone').value;
    saveCurrentStudent();
    alert("تم حفظ التعديلات!");
    renderStudentInfo();
    renderStudents();
}
function saveCurrentStudent(){
    const s=getStudents();
    const index=s.findIndex(st=>st.id==currentStudent.id);
    s[index]=currentStudent;
    saveStudents(s);
}

// إضافة مشكلة
function addProblem(){
    if(currentStudent){
        currentStudent.problems.push({
            subject:document.getElementById('subject').value,
            part:document.getElementById('part').value,
            type:document.getElementById('type').value,
            teacher:document.getElementById('teacher').value,
            notes:document.getElementById('notes').value,
            status:'قائمة'
        });
        saveCurrentStudent();
        renderProblems();
    }
}

// عرض مشاكل الطالب
function renderProblems(){
    if(currentStudent){
        let h='<tr><th>المادة</th><th>الجزئية</th><th>الأستاذ</th><th>نوع المشكلة</th><th>ملاحظات</th><th>الحالة</th><th>إجراءات</th></tr>';
        currentStudent.problems.forEach((p,index)=>{
            const disabled=p.status==='تم حل المشكلة'?'disabled':'';
            h+=`<tr>
                <td><input value="${p.subject}" id="sub${index}" ${disabled}></td>
                <td><input value="${p.part}" id="part${index}" ${disabled}></td>
                <td><input value="${p.teacher}" id="teacher${index}" ${disabled}></td>
                <td><input value="${p.type}" id="type${index}" ${disabled}></td>
                <td><input value="${p.notes}" id="notes${index}" ${disabled}></td>
                <td>
                    <select id="status${index}" ${disabled}>
                        <option ${p.status==='قائمة'?'selected':''}>قائمة</option>
                        <option ${p.status==='جاري المعالجة'?'selected':''}>جاري المعالجة</option>
                        <option ${p.status==='تم حل المشكلة'?'selected':''}>تم حل المشكلة</option>
                    </select>
                </td>
                <td>
                    <button onclick="saveProblem(${index})" ${disabled}>حفظ</button>
                    <button onclick="deleteProblem(${index})" ${disabled}>حذف</button>
                </td>
            </tr>`;
        });
        document.getElementById('problemsTable').innerHTML=h;
    }
}

function saveProblem(index){
    currentStudent.problems[index].subject=document.getElementById(`sub${index}`).value;
    currentStudent.problems[index].part=document.getElementById(`part${index}`).value;
    currentStudent.problems[index].teacher=document.getElementById(`teacher${index}`).value;
    currentStudent.problems[index].type=document.getElementById(`type${index}`).value;
    currentStudent.problems[index].notes=document.getElementById(`notes${index}`).value;
    currentStudent.problems[index].status=document.getElementById(`status${index}`).value;
    saveCurrentStudent();
    alert("تم حفظ التعديل!");
    renderProblems();
}

function deleteProblem(index){
    if(confirm("هل تريد حذف هذه المشكلة؟")){
        currentStudent.problems.splice(index,1);
        saveCurrentStudent();
        renderProblems();
    }
}

// إدارة النتيجة النهائية
function saveGrade(index){
    currentStudent.finalResults[index].grade=document.getElementById(`grade${index}`).value;
    saveCurrentStudent();
    alert("تم حفظ الدرجة!");
}
function addFinalResult(){
    const name=document.getElementById('newProblemName').value;
    const grade=document.getElementById('newGrade').value;
    if(name && grade){
        currentStudent.finalResults.push({problemName:name,grade:grade});
        saveCurrentStudent();
        renderStudentInfo();
        document.getElementById('newProblemName').value='';
        document.getElementById('newGrade').value='';
    }else{
        alert("يرجى إدخال اسم المشكلة والدرجة");
    }
}

// البحث الإداري
function search(){
    const q=document.getElementById('query').value.toLowerCase().trim();
    const s=getStudents();
    let h='';
    s.forEach(st=>{
        const matchBasic=st.name.toLowerCase().includes(q)||
                         st.housing.toLowerCase().includes(q)||
                         st.className.toLowerCase().includes(q)||
                         st.id.toString()===q;
        const filteredProblems=st.problems.filter(p=>
            p.teacher.toLowerCase().includes(q)||
            p.subject.toLowerCase().includes(q)||
            p.part.toLowerCase().includes(q)
        );
        if(matchBasic || filteredProblems.length>0){
            h+=`<tr>
                <td>${st.id}</td>
                <td>${st.name}</td>
                <td>${st.className}</td>
                <td>${st.housing}</td>
                <td>${st.phone}</td>
                <td>
                    <button onclick="openStudent(${st.id})">فتح ملف الطالب</button>
                    <table border="1" style="margin-top:5px;width:100%">
                        <tr><th>المادة</th><th>الجزئية</th><th>الأستاذ</th><th>نوع المشكلة</th><th>ملاحظات</th><th>الحالة</th></tr>`;
            filteredProblems.forEach(p=>{
                h+=`<tr>
                    <td>${p.subject}</td>
                    <td>${p.part}</td>
                    <td>${p.teacher}</td>
                    <td>${p.type}</td>
                    <td>${p.notes}</td>
                    <td>${p.status}</td>
                </tr>`;
            });
            h+=`</table></td></tr>`;
        }
    });
    if(h==='') h='<tr><td colspan="6">لا توجد نتائج مطابقة</td></tr>';
    document.getElementById('results').innerHTML='<tr><th>رقم الملف</th><th>الاسم</th><th>الفصل</th><th>السكن</th><th>رقم الهاتف</th><th>المشاكل</th></tr>'+h;
}
