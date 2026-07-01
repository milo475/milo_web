/* ============================================================
   courses.js — Бүх хичээлийн курсууд
   • Түвшингийн 3 курс (Анхан/Дунд/Ахлах, тус бүр 30) — levels.js
   • Хэрэгслийн 4 курс (nmap, wireshark, metasploit, john/hashcat),
     тус бүр 90 хичээл (Анхан 30 · Дунд 30 · Ахлах 30) — tools/

   Hands-on командуудыг вэб дэх виртуал терминал дээр турших боломжтой
   (ялангуяа nmap бүрэн ажиллана). Бодит халдлага биш — сурах симуляц.

   block types: p · h · list · cmd{cmd,out?} · note · warn
   ============================================================ */

import { LINUX_COURSE } from './levels.js';
import { NMAP90 } from './tools/nmap_full.js';
import { WIRESHARK90 } from './tools/wireshark_full.js';
import { METASPLOIT90 } from './tools/metasploit.js';
import { JOHN90 } from './tools/john.js';

export const COURSES = [
  LINUX_COURSE,
  NMAP90,
  WIRESHARK90,
  METASPLOIT90,
  JOHN90,
];

export default COURSES;
