// ==UserScript==
// @name         GitHub Release Assets Highlighter
// @namespace    https://github.com
// @version      1.0
// @description  为GitHub Release Assets添加隔行变色效果
// @author       You
// @match        https://github.com/*/releases*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // 默认颜色配置
    const defaultColors = {
        oddRowColor: "#f8f9fa", // 奇数行背景色
        evenRowColor: "#ffffff", // 偶数行背景色
        hoverColor: "#e9ecef" // 鼠标悬停颜色
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
    `);

    // 注册油猴菜单选项
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