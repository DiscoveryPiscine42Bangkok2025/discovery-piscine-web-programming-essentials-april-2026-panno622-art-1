const ftList = document.getElementById('ft_list');
const newBtn = document.getElementById('new');

// --- 1. ฟังก์ชันบันทึกข้อมูลลง Cookie ---
function saveToCookie() {
    const todos = [];
    // ดึงข้อความจาก div ทุกตัวที่อยู่ใน ft_list ณ ขณะนั้น
    const items = ftList.querySelectorAll('div');
    items.forEach(item => {
        todos.push(item.textContent);
    });
    
    // แปลง Array เป็น JSON String และ Encode เพื่อป้องกันอักขระพิเศษ
    const jsonStr = JSON.stringify(todos);
    // ตั้งชื่อ cookie ว่า 'todo_data' ให้หมดอายุใน 7 วัน
    document.cookie = "todo_data=" + encodeURIComponent(jsonStr) + "; path=/; max-age=" + (7*24*60*60);
}

// --- 2. ฟังก์ชันสร้าง Element และจัดการการลบ ---
function createTodoElement(text) {
    if (!text || text.trim() === "") return;

    const div = document.createElement('div');
    div.textContent = text;

    // การลบ: เมื่อคลิกต้องถามยืนยัน
    div.onclick = function() {
        if (confirm("Do you really want to remove this TO DO?")) {
            this.remove(); // ลบออกจาก DOM อย่างถาวร
            saveToCookie(); // อัปเดต Cookie หลังจากลบออกแล้ว
        }
    };

    // โจทย์สั่งให้วางไว้บนสุดเสมอ
    ftList.prepend(div);
}

// --- 3. จัดการปุ่ม New ---
newBtn.onclick = function() {
    const task = prompt("Enter your new TO DO:");
    if (task) {
        createTodoElement(task);
        saveToCookie(); // อัปเดต Cookie หลังจากเพิ่มใหม่
    }
};

// --- 4. โหลดข้อมูลจาก Cookie เมื่อเปิดหน้าเว็บ (Refresh/Replay) ---
window.onload = function() {
    const name = "todo_data=";
    const ca = document.cookie.split(';');
    let cookieValue = "";

    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            cookieValue = decodeURIComponent(c.substring(name.length, c.length));
            break;
        }
    }

    if (cookieValue) {
        try {
            const todos = JSON.parse(cookieValue);
            // เนื่องจากเราใช้ .prepend (เพิ่มบนสุด) 
            // ตอนโหลดเราต้องเริ่มสร้างจากอันเก่าสุดไปอันใหม่สุด ลำดับถึงจะเหมือนเดิม
            todos.reverse().forEach(text => {
                createTodoElement(text);
            });
        } catch (e) {
            console.error("Error parsing cookie", e);
        }
    }
    
    function getCookie(name) {
        // เพิ่ม "; " ไว้ข้างหน้าเพื่อให้การค้นหามีรูปแบบเหมือนกันทุกตัว
        const value = `; ${document.cookie}`; 
        
        // ตัด String ออกเป็น 2 ส่วน โดยใช้ชื่อ Cookie ที่ต้องการเป็นจุดตัด
        const parts = value.split(`; ${name}=`); 
        
        // ถ้าเจอข้อมูล (แปลว่ามี 2 ส่วน) ให้หยิบส่วนหลังมา แล้วตัดเอาแค่ก่อนถึงเครื่องหมาย ; ตัวถัดไป
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function saveCookies() {
        const todos = [];
        
        // 1. ไปกวาดเอา <div> ทุกตัวที่อยู่ใน #ft_list มา
        document.querySelectorAll('#ft_list div').forEach(item => {
            // 2. ดึงเอาแค่ข้อความข้างใน (Text Content) ใส่ลงใน Array
            todos.push(item.textContent);
        });
        
        // 3. แปลง Array ให้กลายเป็นข้อความ (String) ด้วย JSON.stringify
        const jsonStr = JSON.stringify(todos);
        
        // 4. บันทึกลง Cookie
        // - encodeURIComponent: ป้องกันปัญหาถ้าในข้อความมีภาษาไทยหรืออักขระพิเศษ
        // - path=/: ให้ Cookie นี้ใช้งานได้ทุกหน้าในเว็บไซต์
        // - max-age: ตั้งเวลาหมดอายุ (ในที่นี้คือ 7 วัน คิดจาก วินาที x นาที x ชั่วโมง x วัน)
        document.cookie = "todo_list=" + encodeURIComponent(jsonStr) + "; path=/; max-age=" + (7*24*60*60);
    }
};