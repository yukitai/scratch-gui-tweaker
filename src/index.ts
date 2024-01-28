// ==UserScript==
// @name         TurboWarp Tweaker
// @description  tweaks the TurboWarp!
// @icon         https://turbowarp.org/favicon.ico
// @version      0.1
// @author       yukiitai
// @match        https://turbowarp.org/editor
// @match        https://turbowarp.org/editor?*
// @grant        unsafeWindow
// ==/UserScript==

import hljs from 'highlightjs'

import style from './inject_style'

import * as utils from './utils'
import * as tools from './blockly/tools'
import config from './config';

    (function() {
        'use strict';
    
        let string_match_disabled = false;
        let max_auto_show_count = 5;
    
       
    
        const el = document.createElement("style");
        el.innerHTML = style;
    
        window.setInterval(() => {
            document.querySelectorAll(".blocklyMinimalBody.scratchCommentBody").forEach(el => {
                const content = el.querySelector("textarea").value
                const result = content.split("\n")[0].match(/hljs:\s*(\S+)/);
                let el0;
                if (el0 = el.querySelector("div")) { el.removeChild(el0); }
                if (result && result[1]) {
                    const language = result[1];
                    try {
                        const highlighted = hljs.highlightAuto(content, [language]);
                        const div = document.createElement("div");
                        div.classList.add("comment_hlpreview");
                        div.innerHTML = `<code><pre>${highlighted.value}</pre></code>`;
                        el.appendChild(div);
                    } catch (e) { }
                }
            });
        }, 100);
    
        const search = document.createElement("div");
        search.innerHTML = `\
    <div class="search_row">
      <button class="search_close_btn">×</button>
      <input class="search_input" />
    </div>
    <div class="result_infobox">
      <span class="result_info">0</span> results found.
      <button class="show_all_btn hidden">show all</button>
    </div>
    <div class="result_list"><ul></ul></div>`;
        search.classList.add("hidden");
        search.classList.add("search_menu");
    
        const show_all_btn = search.querySelector(".show_all_btn") as HTMLButtonElement;
        const result_info = search.querySelector(".result_info") as HTMLDivElement;
        const search_close_btn = search.querySelector(".search_close_btn") as HTMLButtonElement;
        const search_input = search.querySelector(".search_input") as HTMLInputElement;
        const result_list = search.querySelector(".result_list") as HTMLDivElement;
    
        search_close_btn.addEventListener("click", () => {
            search.classList.add("hidden");
        });
    
        const update = e => {
            result_list.innerHTML = "<ul></ul>";

            const el = e.target;
            const pat_string = el.value
                               ? el.value.split(" ").filter(x => x !== "").join(" ")
                               : "";
            const pat = utils.parse_pat(pat_string);
            const workspace = Blockly.getMainWorkspace();
            const blocks = workspace.blockDB_;
            const results = [];
            for (const block of Object.values(blocks)) {
                const rank1 = utils.match_pat(block, pat);
                const rank2 = utils.match_str(block, pat_string);
                const rank = Math.max(rank1, rank2);
                if (rank) {
                    results.push([
                        rank,
                        block,
                        `<svg xmlns="http://www.w3.org/2000/svg"
                              width="${block.width}px"
                              height="${block.height}px"
                              style="scale: ${ config.preview_scale };">
                                  ${block.svgGroup_.innerHTML}
                         </svg>`
                    ]);
                }
            }
    
            const show_result = () => {
                results.sort((a, b) => b[0] - a[0]);
                const rank_max = results[0][0];
                const filtered_results = results.filter(x => x[0] > rank_max - config.ignore_result_rank_difference_max)
                result_list.innerHTML = `<ul>${filtered_results.map(result => {
                    return `\
    <li>
      <span class="hidden">rank: ${result[0]}</span>
      <button class="search_result_itema">${result[2]}</button>
    </li>`;
                }).join("")}</ul>`;
    
                result_list.querySelectorAll(".search_result_itema").forEach((el, i) => {
                    const svg = el.lastElementChild;
                    svg.removeChild(svg.lastElementChild);
                    el.addEventListener("click", () => {
                        // scroll to it
                        tools.scroll_block_into_view(filtered_results[i][1])
                    });
                });
            }
    
            result_info.innerHTML = `${results.length}`;
    
            if (results.length > max_auto_show_count) {
                show_all_btn.addEventListener("click", () => {
                    show_result();
                    show_all_btn.classList.add("hidden");
                });
                show_all_btn.classList.remove("hidden");
            } else {
                show_all_btn.classList.add("hidden");
                show_result();
            }
        }
    
        search_input.addEventListener("input", update);
    
        unsafeWindow.addEventListener("keypress", e => {
            if (e.code === "KeyB" && e.ctrlKey) {
                show_all_btn.classList.add("hidden");
                search_input.value = "";
                search.classList.remove("hidden");
                search_input.focus();
                e.preventDefault();
            } else if (e.code === "Escape" || e.code === "Enter") {
                if (!search.classList.contains("hidden")) {
                    search.classList.add("hidden");
                    e.preventDefault();
                }
            }
        })
    
        unsafeWindow.document.querySelector("body").appendChild(el);
        unsafeWindow.document.querySelector("body").appendChild(search);
    })();