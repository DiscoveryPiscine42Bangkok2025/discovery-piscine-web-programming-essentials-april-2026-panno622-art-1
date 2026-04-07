$(document).ready(function() {
    const $ftList = $('#ft_list');
    const COOKIE_NAME = "todo_list";

    // --- 1. ฟังก์ชันดึงค่าจาก Cookie ---
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    // --- 2. ฟังก์ชันบันทึกข้อมูลลง Cookie ---
    function saveCookies() {
        const todos = [];
        // ใช้ .each() ของ jQuery วนลูปหา div
        $ftList.find('div').each(function() {
            todos.push($(this).text());
        });
        
        const jsonStr = JSON.stringify(todos);
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(jsonStr)}; path=/; max-age=${7*24*60*60}`;
    }

    // --- 3. ฟังก์ชันสร้าง Element และจัดการการลบ ---
    function createTodoElement(text) {
        if (!text || $.trim(text) === "") return;

        // สร้าง <div> ใหม่ด้วย jQuery
        const $div = $('<div></div>').text(text);

        // การลบ: ใช้ .on('click') แทน onclick
        $div.on('click', function() {
            if (confirm("Do you really want to remove this TO DO?")) {
                $(this).remove(); // ลบออกจาก DOM
                saveCookies();    // อัปเดต Cookie
            }
        });

        // วางไว้บนสุด (prepend)
        $ftList.prepend($div);
    }

    // --- 4. จัดการปุ่ม New ---
    $('#new').on('click', function() {
        const task = prompt("Enter your new TO DO:");
        if (task) {
            createTodoElement(task);
            saveCookies();
        }
    });

    // --- 5. โหลดข้อมูลเมื่อเปิดหน้าเว็บ (Refresh/Replay) ---
    function loadTodos() {
        const savedData = getCookie(COOKIE_NAME);
        if (savedData) {
            try {
                const todos = JSON.parse(savedData);
                // reverse ลำดับก่อนวาดเพื่อให้ prepend ออกมาถูกต้องเหมือนก่อน refresh
                $.each(todos.reverse(), function(index, value) {
                    createTodoElement(value);
                });
            } catch (e) {
                console.error("Error parsing cookie", e);
            }
        }
    }

    // เรียกใช้งานฟังก์ชันโหลดข้อมูลทันทีที่หน้าเว็บพร้อม
    loadTodos();
});