// ==UserScript==
// @name                     Assets-Distinguisher
// @name:en                Assets-Distinguisher
// @namespace            https://github.com
// @version                  2.0
// @description           为GitHub Release Assets添加隔行变色效果。
// @description:en       Add alternating row colors to GitHub Release Assets.
// @author                  https://github.com/HumanMus1c
// @match                   https://github.com/*/releases*
// @grant                    GM_addStyle
// @grant                    GM_registerMenuCommand
// @grant                    GM_getValue
// @grant                    GM_setValue
// @grant                    unsafeWindow
// @license                  MIT
// ==/UserScript==

(function() {
    // 默认颜色配置
    const defaultColors = {
        oddRowColor: "#f8f9fa",
        evenRowColor: "#ffffff",
        hoverColor: "#e9ecef"
    };

    // 从存储中读取颜色配置
    const colors = {
        oddRowColor: GM_getValue("oddRowColor", defaultColors.oddRowColor),
        evenRowColor: GM_getValue("evenRowColor", defaultColors.evenRowColor),
        hoverColor: GM_getValue("hoverColor", defaultColors.hoverColor)
    };

    // 添加CSS样式
    GM_addStyle(`
        .Box.Box--condensed.mt-3 li.Box-row:nth-child(odd) {
            background-color: ${colors.oddRowColor} !important;
        }
        .Box.Box--condensed.mt-3 li.Box-row:nth-child(even) {
            background-color: ${colors.evenRowColor} !important;
        }
        .Box.Box--condensed.mt-3 li.Box-row:hover {
            background-color: ${colors.hoverColor} !important;
        }

        /* 对话框样式 - 米色背景，黑色字体 */
        .color-picker-dialog {
            position: fixed;
            top: 50%; /* 垂直居中 */
            left: 6px; /* 距离左侧15px */
            transform: translateY(-50%); /* 垂直居中偏移 */
            background: beige; /* 米色背景 */
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 300px;
            color: black; /* 黑色字体 */
            font-family: Arial, sans-serif;
            max-height: 50vh; /* 最大高度为视口的90% */
            overflow-y: auto; /* 添加垂直滚动条 */
        }

        /* 移除模态遮罩 */
        /* .color-picker-dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
        } */

        .color-picker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2px;
            padding-bottom: 2px;
            border-bottom: 1px solid #d0c9c1;
        }

        .color-picker-title {
            font-weight: bold;
            margin: 0;
            font-size: 18px;
            color: black; /* 黑色字体 */
        }

        .color-picker-close {
            cursor: pointer;
            padding: 5px 10px;
            font-size: 24px;
            color: #666;
            transition: color 0.2s;
        }

        .color-picker-close:hover {
            color: #000;
        }

        .color-picker-content {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .color-picker-row {
            display: flex;
            align-items: center;
            gap: 15px;
            justify-content: space-between;
        }

        .menu-command {
            font-size: 14px;
            font-weight: 500;
            color: black; /* 黑色字体 */
            min-width: 120px;
        }

        .button-row {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .dialog-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        }

        .cancel-button {
            background-color: #007bff; /* 蓝色背景 */
            color: white;
        }

        .cancel-button:hover {
            background-color: #0069d9;
        }

        .confirm-button {
            background-color: #ffa500; /* 橙黄色背景 */
            color: black;
        }

        .confirm-button:hover {
            background-color: #e69500;
        }

        .color-button {
            width: 30px;
            height: 30px;
            border-radius: 4px;
            border: 1px solid #ccc;
            cursor: pointer;
            background: #f0f0f0;
        }

        /* 颜色选择器容器 */
        .color-picker-container {
            position: relative;
            display: inline-block;
        }

        /* 隐藏原生颜色选择器 */
        .color-picker-container input[type="color"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
    `);

    // 创建颜色选择器对话框
    function createColorPickerDialog() {
        // 如果对话框已存在，则显示它
        let dialog = document.querySelector('.color-picker-dialog');
        if (dialog) {
            dialog.style.display = 'block';
            return;
        }

        // 创建新的对话框 - 使用普通div代替dialog元素
        dialog = document.createElement('div');
        dialog.className = 'color-picker-dialog';
        dialog.innerHTML = `
            <div class="color-picker-header">
                <h3 class="color-picker-title">颜色选择器</h3>
                <span class="color-picker-close" title="关闭">&times;</span>
            </div>
            <div class="color-picker-content">
                <div class="color-picker-row">
                    <span class="menu-command">⚙️ 设置奇数行颜色</span>
                    <div class="color-picker-container">
                        <button class="color-button" id="oddRowColorBtn" style="background-color: ${colors.oddRowColor}"></button>
                        <input type="color" id="oddRowColorPicker" value="${colors.oddRowColor}">
                    </div>
                </div>
                <div class="color-picker-row">
                    <span class="menu-command">⚙️ 设置偶数行颜色</span>
                    <div class="color-picker-container">
                        <button class="color-button" id="evenRowColorBtn" style="background-color: ${colors.evenRowColor}"></button>
                        <input type="color" id="evenRowColorPicker" value="${colors.evenRowColor}">
                    </div>
                </div>
                <div class="color-picker-row">
                    <span class="menu-command">⚙️ 设置悬停颜色</span>
                    <div class="color-picker-container">
                        <button class="color-button" id="hoverColorBtn" style="background-color: ${colors.hoverColor}"></button>
                        <input type="color" id="hoverColorPicker" value="${colors.hoverColor}">
                    </div>
                </div>
                <div class="button-row">
                    <button class="dialog-button cancel-button">取消</button>
                    <button class="dialog-button confirm-button">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // 获取元素引用
        const closeBtn = dialog.querySelector('.color-picker-close');
        const cancelBtn = dialog.querySelector('.cancel-button');
        const confirmBtn = dialog.querySelector('.confirm-button');

        const oddRowColorBtn = dialog.querySelector('#oddRowColorBtn');
        const evenRowColorBtn = dialog.querySelector('#evenRowColorBtn');
        const hoverColorBtn = dialog.querySelector('#hoverColorBtn');

        const oddRowColorPicker = dialog.querySelector('#oddRowColorPicker');
        const evenRowColorPicker = dialog.querySelector('#evenRowColorPicker');
        const hoverColorPicker = dialog.querySelector('#hoverColorPicker');

        // 初始化颜色变量
        let newOddColor = colors.oddRowColor;
        let newEvenColor = colors.evenRowColor;
        let newHoverColor = colors.hoverColor;

        // 设置颜色按钮点击事件 - 打开颜色选择器
        [oddRowColorBtn, evenRowColorBtn, hoverColorBtn].forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡

                // 找到对应的颜色选择器
                const picker = btn.nextElementSibling;
                if (picker && picker.tagName === 'INPUT' && picker.type === 'color') {
                    picker.click();
                }
            });
        });

        // 颜色选择器变化事件
        oddRowColorPicker.addEventListener('input', (e) => {
            newOddColor = e.target.value;
            oddRowColorBtn.style.backgroundColor = newOddColor;
        });

        evenRowColorPicker.addEventListener('input', (e) => {
            newEvenColor = e.target.value;
            evenRowColorBtn.style.backgroundColor = newEvenColor;
        });

        hoverColorPicker.addEventListener('input', (e) => {
            newHoverColor = e.target.value;
            hoverColorBtn.style.backgroundColor = newHoverColor;
        });

        // 关闭按钮功能 - 移除对话框
        closeBtn.addEventListener('click', () => {
            dialog.style.display = 'none';
        });

        // 取消按钮功能 - 移除对话框
        cancelBtn.addEventListener('click', () => {
            dialog.style.display = 'none';
        });

        // 确认按钮功能
        confirmBtn.addEventListener('click', () => {
            // 保存颜色设置
            GM_setValue("oddRowColor", newOddColor);
            GM_setValue("evenRowColor", newEvenColor);
            GM_setValue("hoverColor", newHoverColor);

            dialog.style.display = 'none';
            location.reload();
        });

        // 点击对话框外部关闭 - 移除
        // 非模态对话框不需要此功能，用户可以直接操作页面其他部分

        // 添加ESC键关闭支持
        document.addEventListener('keydown', function handleEsc(e) {
            if (e.key === 'Escape') {
                dialog.style.display = 'none';
                // 移除事件监听器
                document.removeEventListener('keydown', handleEsc);
            }
        });
    }

    // 注册油猴菜单选项
    GM_registerMenuCommand("🎨 取色器", createColorPickerDialog);

    // 独立的菜单命令
    GM_registerMenuCommand("⚙️ 设置奇数行颜色", () => {
        const newColor = prompt("请输入奇数行背景色（HEX格式，如#f8f9fa）:", colors.oddRowColor);
        if (newColor) {
            GM_setValue("oddRowColor", newColor);
            location.reload();
        }
    });

    GM_registerMenuCommand("⚙️ 设置偶数行颜色", () => {
        const newColor = prompt("请输入偶数行背景色（HEX格式，如#ffffff）:", colors.evenRowColor);
        if (newColor) {
            GM_setValue("evenRowColor", newColor);
            location.reload();
        }
    });

    GM_registerMenuCommand("⚙️ 设置悬停颜色", () => {
        const newColor = prompt("请输入鼠标悬停颜色（HEX格式，如#e9ecef）:", colors.hoverColor);
        if (newColor) {
            GM_setValue("hoverColor", newColor);
            location.reload();
        }
    });

    GM_registerMenuCommand("🔄 重置为默认颜色", () => {
        GM_setValue("oddRowColor", defaultColors.oddRowColor);
        GM_setValue("evenRowColor", defaultColors.evenRowColor);
        GM_setValue("hoverColor", defaultColors.hoverColor);
        location.reload();
    });
})();