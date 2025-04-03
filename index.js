const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE';
let selectedId = '';

window.onload = async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {

        mode = 'EDIT';
        selectedId = id;

        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            const user = response.data;

            document.querySelector('input[name=firstname]').value = user.firstname;
            document.querySelector('input[name=lastname]').value = user.lastname;
            document.querySelector('input[name=age]').value = user.age;
            document.querySelector('textarea[name=description]').value = user.description;

            document.querySelectorAll('input[name=gender]').forEach(genderDOM => {
                if (genderDOM.value === user.gender) {
                    genderDOM.checked = true;
                }
            });

            document.querySelectorAll('input[name=interest]').forEach(interestDOM => {
                if (user.interests.includes(interestDOM.value)) {
                    interestDOM.checked = true;
                }
            });

        } catch (error) {
            console.error('Error:', error);
        }

    }

}

const validateData = (userData) => {

    let errors = [];

    if (!userData.firstName) errors.push('กรุณากรอกชื่อ');
    if (!userData.lastName) errors.push('กรุณากรอกนามสกุล');
    if (!userData.age) errors.push('กรุณากรอกอายุ');
    if (!userData.gender) errors.push('กรุณาเลือกเพศ');
    if (!userData.interests.length) errors.push('กรุณาเลือกความสนใจ');
    if (!userData.description) errors.push('กรุณากรอกข้อมูล');

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
        let gender = genderDOM ? genderDOM.value : null;
        let interests = Array.from(interestDOMs).map(i => i.value);

        let userData = {
            firstName: firstNameDOM.value.trim(),
            lastName: lastNameDOM.value.trim(),
            age: ageDOM.value.trim(),
            gender,
            description: descriptionDOM.value.trim(),
            interests
        };

        let errors = validateData(userData);

        if (errors.length > 0) {
            throw { message: 'ข้อมูลไม่ครบถ้วน', errors };
        }

        let message = '';
        let messageClass = '';

        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/users`, userData);
            message = 'บันทึกข้อมูลเรียบร้อย';
            messageClass = 'message success';
        } else {
            await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
            message = 'แก้ไขข้อมูลเรียบร้อย';
            messageClass = 'message update';
        }

        messageDOM.innerText = message;
        messageDOM.className = messageClass;
        messageDOM.style.display = 'block';

    } catch (error) {
        console.error('Error:', error);

        let errorMessage = error.message || 'เกิดข้อผิดพลาด';
        let errorList = error.errors || [];

        let htmlData = `<div>
                            <div>${errorMessage}</div>
                            <ul>${errorList.map(err => `<li>${err}</li>`).join('')}</ul>
                        </div>`;

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
        messageDOM.style.display = 'block';
    }
    
}