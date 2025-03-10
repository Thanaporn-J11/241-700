const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; // default mode
let selectedId = '';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('id', id);
    
    if (id) {
        mode = 'EDIT';
        selectedId = id;

        //1. เราจะดึงข้อมูล user ที่ต้องการแก้ไข
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            const user = response.data;

            //2. เราจะนำข้อมูลของ user ที่ดึงมา ใส่ใน input ที่เรามี
            let firstNameDOM = document.querySelector('input[name=firstname]');
            let lastNameDOM = document.querySelector('input[name=lastname]');
            let ageDOM = document.querySelector('input[name=age]');
            let descriptionDOM = document.querySelector('textarea[name=description]');

            firstNameDOM.value = user.firstname;
            lastNameDOM.value = user.lastname;
            ageDOM.value = user.age;
            descriptionDOM.value = user.description;

            let genderDOMs = document.querySelectorAll('input[name=gender]');
            let interestDOMs = document.querySelectorAll('input[name=interest]');

            for (let i = 0; i < genderDOMs.length; i++) {
                if (genderDOMs[i].value == user.gender) {
                    genderDOMs[i].checked = true;
                }
            }
            for (let i = 0; i < interestDOMs.length; i++) {
                if (user.interests.includes(interestDOMs[i].value)) {
                    interestDOMs[i].checked = true;
                }
            }

        } catch (error) {
            console.log('error', error);
        }
    }
}

const validateData = (userData) => {
    let errors = [];

    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ');
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศ');
    }
    if (!userData.interests) {
        errors.push('กรุณาเลือกความสนใจ');
    }
    if (!userData.description) {
        errors.push('กรุณากรอกข้อมูล');
    }
    return errors;
}

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked');
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked');
    let descriptionDOM = document.querySelector('textarea[name=description]');

    let messageDOM = document.getElementById('message');
    
    try {
        // ดึงค่าจาก gender ถ้าไม่มีการเลือก จะได้ค่า null
        let gender = genderDOM ? genderDOM.value : null;

        // สร้าง string สำหรับ interests ที่ถูกเลือก
        let interests = '';
        for (let i = 0; i < interestDOMs.length; i++) {
            interests += interestDOMs[i].value;
            if (i != interestDOMs.length - 1) {
                interests += ', ';
            }
        }

        // สร้าง userData ที่จะส่งไป
        let userData = {
            firstName: firstNameDOM.value,
            lastName: lastNameDOM.value,
            age: ageDOM.value,
            gender: gender,  // ค่าที่ดึงจาก gender
            description: descriptionDOM.value,
            interests: interests
        }

        console.log('submitData', userData);

        // ตรวจสอบว่าเป็นโหมด CREATE หรือ EDIT
        let message = 'บันทึกข้อมูลเรียบร้อย';
        if (mode == 'CREATE') {
            const response = await axios.post(`${BASE_URL}/users`, userData);
            console.log('response', response.data);
        } else {
            const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
            message = 'แก้ไขข้อมูลเรียบร้อย';
            console.log('response', response.data);
        }

        messageDOM.innerText = message;
        messageDOM.className = 'message success';

    } catch (error) {
        console.log('error message', error.message);
        console.log('error', error.errors);
        
        if (error.response) {
            console.log('error.response', error.response.data);
            error.message = error.response.data.message;
            error.errors = error.response.data.errors;
        }

        let htmlData = '<div>';
        htmlData += `<div>${error.message}</div>`;
        htmlData += '<ul>';
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</li>`;
        }
        htmlData += '</ul>';
        htmlData += '</div>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }
}
