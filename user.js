const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {

    console.log('User page loaded');

    try {
        // 1. โหลดข้อมูลผู้ใช้จาก API
        const response = await axios.get(`${BASE_URL}/users`);
        console.log(response.data);
        
        // 2. อ้างอิง DOM ของ user list
        const userDOM = document.getElementById('user');
        if (!userDOM) return; // ตรวจสอบว่ามี element 'user' หรือไม่

        let htmlData = '';

        response.data.forEach(user => {
            htmlData += `
            <div class="user-item">
                <div class="content">${user.id} ${user.firstname} ${user.lastname}</div>
                <div class="buttons">
                    <a href="index1.html?id=${user.id}">
                        <button class="edit">Edit</button>
                    </a>
                    <button class="delete" data-id="${user.id}">Delete</button>
                </div>
            </div>
            `;
        });

        userDOM.innerHTML = htmlData;

        // 3. กำหนด event listener สำหรับปุ่ม Delete
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                if (confirm(`ต้องการลบผู้ใช้ ID: ${id} ใช่หรือไม่?`)) {
                    try {
                        await axios.delete(`${BASE_URL}/users/${id}`);
                        loadData(); // โหลดข้อมูลใหม่หลังจากลบ
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                }
            });
        });

    } catch (error) {
        console.error('Error fetching users:', error);
    }

};