/* ============================================================
   lessons.js — Kali Linux хичээлүүд (эхнээс нь)
   Линукс огт мэдэхгүй хүнд зориулсан, монгол хэл дээрх дараалсан
   хичээлүүд. Контентоо энд засна.

   block types:
     { type: 'p',    text }                  — догол мөр
     { type: 'h',    text }                  — дэд гарчиг
     { type: 'list', items: [] }             — жагсаалт
     { type: 'cmd',  cmd, out? }             — терминалын команд (+гаралт)
     { type: 'note', text }                  — зөвлөмж
     { type: 'warn', text }                  — анхааруулга
   ============================================================ */

export const LESSONS = [
  {
    id: 'intro',
    title: 'Linux ба Kali гэж юу вэ?',
    level: 'Эхлэл',
    summary: 'Үйлдлийн систем, Linux, Kali гэж юу болохыг танилцуулна.',
    blocks: [
      { type: 'p', text: 'Linux бол үнэгүй, нээлттэй эх кодтой үйлдлийн систем (operating system) юм. Windows, macOS-той адил компьютерийг ажиллуулдаг боловч сервер, аюулгүй байдал, хөгжүүлэлтийн ертөнцөд хамгийн өргөн хэрэглэгддэг.' },
      { type: 'p', text: 'Kali Linux бол Linux-ийн нэг "хувилбар" (distribution буюу distro). Тусгайлан кибер аюулгүй байдал, нэвтрэлтийн тест (penetration testing)-д зориулагдсан бөгөөд 600 гаруй аюулгүй байдлын хэрэгслийг суулгасан байдаг.' },
      { type: 'h', text: 'Distro гэж юу вэ?' },
      { type: 'p', text: 'Linux-ийн цөм (kernel) дээр суурилсан, өөр өөр зориулалт, дүр төрхтэй багц бүтээгдэхүүнүүдийг distro гэнэ. Жишээ нь:' },
      { type: 'list', items: [
        'Ubuntu — эхлэн суралцагчдад ээлтэй, өргөн хэрэглээний',
        'Debian — тогтвортой байдлаараа алдартай (Kali үүн дээр суурилсан)',
        'Kali — аюулгүй байдал, pentest-д зориулсан',
        'Arch — нарийвчилсан тохиргоо хүсдэг туршлагатай хэрэглэгчдэд',
      ] },
      { type: 'note', text: 'Kali-г өдөр тутмын үндсэн систем болгож хэрэглэхийг зөвлөдөггүй. Сурах, туршихдаа виртуал машин (VirtualBox/VMware) дээр ажиллуулах нь хамгийн зөв.' },
    ],
  },

  {
    id: 'terminal',
    title: 'Терминалтай танилцах',
    level: 'Эхлэл',
    summary: 'Командын мөр гэж юу вэ, prompt-ийг хэрхэн уншихаа сурна.',
    blocks: [
      { type: 'p', text: 'Терминал (terminal) буюу командын мөр бол текст бичиж компьютерт тушаал өгдөг цонх юм. Linux-д хулганаар хийдэг бараг бүх зүйлийг терминалаар илүү хурдан, хүчтэйгээр хийж болно.' },
      { type: 'h', text: 'Kali-ийн prompt-ийг унших' },
      { type: 'p', text: 'Терминал нээхэд дараах байдалтай мөр харагдана:' },
      { type: 'cmd', cmd: '' },
      { type: 'p', text: 'Энэ нь: kali — нэвтэрсэн хэрэглэгчийн нэр, дараагийн kali — компьютерийн нэр (hostname), [~] — одоо байгаа хавтас (~ нь гэрийн хавтас /home/kali). Төгсгөлийн $ тэмдэг нь энгийн хэрэглэгч гэдгийг, # тэмдэг бол root (хамгийн өндөр эрх) гэдгийг илтгэнэ.' },
      { type: 'h', text: 'Эхний команд' },
      { type: 'p', text: 'whoami — би хэн бэ? гэдгийг хэлж өгнө:' },
      { type: 'cmd', cmd: 'whoami', out: 'kali' },
      { type: 'note', text: 'Команд бичээд Enter дарна. Дээш/доош сумаар өмнө бичсэн командуудаа дуудаж болно. Tab товчоор нэрийг автоматаар гүйцээнэ.' },
    ],
  },

  {
    id: 'filesystem',
    title: 'Файлын систем ба чиглүүлэлт',
    level: 'Үндэс',
    summary: 'pwd, ls, cd ашиглан хавтсуудаар хэрхэн зорчихыг сурна.',
    blocks: [
      { type: 'p', text: 'Linux-д бүх зүйл / (root) хавтаснаас эхэлдэг мод хэлбэрийн бүтэцтэй. Чиний файлууд ихэвчлэн /home/kali дотор байрлана.' },
      { type: 'h', text: 'Хаана байгаагаа мэдэх — pwd' },
      { type: 'cmd', cmd: 'pwd', out: '/home/kali' },
      { type: 'h', text: 'Доторх зүйлсийг харах — ls' },
      { type: 'cmd', cmd: 'ls', out: 'Desktop  Documents  Downloads  Pictures' },
      { type: 'p', text: 'Дэлгэрэнгүй, нуугдсан файлуудтай нь харах:' },
      { type: 'cmd', cmd: 'ls -la', out: 'total 32\ndrwxr-xr-x 4 kali kali 4096 Jun 30 14:00 .\ndrwxr-xr-x 3 root root 4096 Jun 01 09:12 ..\n-rw-r--r-- 1 kali kali  220 Jun 01 09:12 .bashrc\ndrwxr-xr-x 2 kali kali 4096 Jun 30 14:00 Documents' },
      { type: 'h', text: 'Хавтас солих — cd' },
      { type: 'cmd', cmd: 'cd Documents' },
      { type: 'list', items: [
        'cd .. — нэг шат дээшээ',
        'cd ~ — гэрийн хавтас руу',
        'cd / — хамгийн дээд (root) хавтас руу',
        'cd - — өмнө байсан хавтас руу буцах',
      ] },
      { type: 'note', text: 'Зам бичихдээ Tab дарж гүйцээлгэвэл алдаа гарах магадлал багасна.' },
    ],
  },

  {
    id: 'files',
    title: 'Хавтас, файл үүсгэх ба удирдах',
    level: 'Үндэс',
    summary: 'mkdir, touch, cp, mv, rm командуудаар файл удирдана.',
    blocks: [
      { type: 'h', text: 'Хавтас үүсгэх — mkdir' },
      { type: 'cmd', cmd: 'mkdir tsalin' },
      { type: 'h', text: 'Хоосон файл үүсгэх — touch' },
      { type: 'cmd', cmd: 'touch t\u0435mdeglel.txt' },
      { type: 'h', text: 'Хуулах — cp' },
      { type: 'cmd', cmd: 'cp temdeglel.txt temdeglel-backup.txt' },
      { type: 'h', text: 'Зөөх / нэр солих — mv' },
      { type: 'cmd', cmd: 'mv temdeglel.txt tsalin/' },
      { type: 'p', text: 'Ижил команд нэр солиход бас ажиллана:' },
      { type: 'cmd', cmd: 'mv huuchin.txt shine.txt' },
      { type: 'h', text: 'Устгах — rm' },
      { type: 'cmd', cmd: 'rm temdeglel-backup.txt' },
      { type: 'p', text: 'Хавтсыг доторх бүх зүйлтэй нь устгах:' },
      { type: 'cmd', cmd: 'rm -r tsalin' },
      { type: 'warn', text: 'rm устгасан зүйлийг сэргээх боломжгүй (хогийн сав байхгүй). Ялангуяа sudo rm -rf / төрлийн командыг ХЭЗЭЭ Ч санамсаргүй бүү бич — энэ систем бүхэлд нь устгана.' },
    ],
  },

  {
    id: 'reading',
    title: 'Файл унших ба засах',
    level: 'Үндэс',
    summary: 'cat, less, head, tail болон nano засварлагч.',
    blocks: [
      { type: 'h', text: 'Бүх агуулгыг харах — cat' },
      { type: 'cmd', cmd: 'cat /etc/hostname', out: 'kali' },
      { type: 'h', text: 'Урт файлыг хуудаслаж унших — less' },
      { type: 'cmd', cmd: 'less /etc/passwd' },
      { type: 'p', text: 'less дотор сумаар гүйлгэнэ, q дарж гарна.' },
      { type: 'h', text: 'Эхэн / төгсгөлийг харах — head, tail' },
      { type: 'cmd', cmd: 'head -n 5 /etc/passwd' },
      { type: 'cmd', cmd: 'tail -n 5 /etc/passwd' },
      { type: 'h', text: 'Файл засах — nano' },
      { type: 'cmd', cmd: 'nano temdeglel.txt' },
      { type: 'p', text: 'nano дотор шууд бичнэ. Хадгалах: Ctrl+O, дараа Enter. Гарах: Ctrl+X.' },
      { type: 'note', text: 'nano бол хамгийн энгийн засварлагч. Хожим vim, vi гэх илүү хүчтэй хэрэгслүүдийг сурч болно.' },
    ],
  },

  {
    id: 'permissions',
    title: 'Эрх (permissions) ба sudo',
    level: 'Дунд',
    summary: 'Файлын эрхийг ойлгох, chmod, chown, sudo хэрэглэх.',
    blocks: [
      { type: 'p', text: 'ls -l командын эхэнд гарах -rwxr-xr-- гэх тэмдэгтүүд нь файлын эрхийг харуулдаг. Эхний тэмдэг төрөл (- файл, d хавтас), дараагийн 9 нь эзэмшигч / групп / бусад хэрэглэгчийн унших(r), бичих(w), ажиллуулах(x) эрх.' },
      { type: 'cmd', cmd: 'ls -l script.sh', out: '-rw-r--r-- 1 kali kali 128 Jun 30 14:10 script.sh' },
      { type: 'h', text: 'Эрх өөрчлөх — chmod' },
      { type: 'p', text: 'Файлыг ажиллуулах боломжтой болгох:' },
      { type: 'cmd', cmd: 'chmod +x script.sh' },
      { type: 'p', text: 'Тоон хэлбэрээр (r=4, w=2, x=1): эзэмшигч бүх эрх, бусад нь зөвхөн унших:' },
      { type: 'cmd', cmd: 'chmod 744 script.sh' },
      { type: 'h', text: 'Эзэмшигч солих — chown' },
      { type: 'cmd', cmd: 'sudo chown kali:kali script.sh' },
      { type: 'h', text: 'sudo — түр зуур админ эрхээр ажиллуулах' },
      { type: 'p', text: 'Систем хэмжээний өөрчлөлт (багц суулгах, /etc засах гэх мэт) хийхэд админ (root) эрх хэрэгтэй. Командынхаа өмнө sudo гэж бичнэ:' },
      { type: 'cmd', cmd: 'sudo apt update' },
      { type: 'warn', text: 'sudo бол хүчтэй. root эрхээр буруу команд ажиллуулбал системээ эвдэж болно. Юу хийж байгаагаа ойлгож байж л sudo хэрэглэ.' },
    ],
  },

  {
    id: 'packages',
    title: 'Програм суулгах (apt)',
    level: 'Дунд',
    summary: 'apt ашиглан програм шинэчлэх, суулгах, устгах.',
    blocks: [
      { type: 'p', text: 'Kali (Debian) дээр програмыг apt багц менежерээр удирдана. Windows дээрх "exe татаж суулгах"-ын оронд нэг командаар суулгадаг.' },
      { type: 'h', text: 'Багцын жагсаалтыг шинэчлэх' },
      { type: 'cmd', cmd: 'sudo apt update' },
      { type: 'h', text: 'Суусан програмуудыг шинэчлэх' },
      { type: 'cmd', cmd: 'sudo apt upgrade' },
      { type: 'h', text: 'Шинэ програм суулгах' },
      { type: 'cmd', cmd: 'sudo apt install git' },
      { type: 'h', text: 'Устгах' },
      { type: 'cmd', cmd: 'sudo apt remove git' },
      { type: 'note', text: 'Шинэ систем дээр эхлээд sudo apt update && sudo apt upgrade -y командыг ажиллуулж бүгдийг шинэчлэх нь зөв дадал.' },
    ],
  },

  {
    id: 'networking',
    title: 'Сүлжээний үндэс',
    level: 'Дунд',
    summary: 'ip, ping, нэр шийдвэрлэлт болон холболтыг шалгах.',
    blocks: [
      { type: 'h', text: 'Өөрийн IP хаягийг харах' },
      { type: 'cmd', cmd: 'ip a' },
      { type: 'p', text: 'Хуучин ifconfig команд бас хэрэглэгддэг (net-tools суулгасан бол):' },
      { type: 'cmd', cmd: 'ifconfig' },
      { type: 'h', text: 'Холболт шалгах — ping' },
      { type: 'cmd', cmd: 'ping -c 4 8.8.8.8', out: '64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.3 ms\n...\n4 packets transmitted, 4 received, 0% packet loss' },
      { type: 'h', text: 'DNS / нэр шийдвэрлэх' },
      { type: 'cmd', cmd: 'nslookup example.com' },
      { type: 'note', text: '-c 4 нь зөвхөн 4 удаа ping илгээгээд зогсоно гэсэн үг. Үгүй бол Ctrl+C дарж зогсооно.' },
    ],
  },

  {
    id: 'processes',
    title: 'Процесс ба систем',
    level: 'Дунд',
    summary: 'ps, top, kill ашиглан ажиллаж буй програмуудыг удирдах.',
    blocks: [
      { type: 'h', text: 'Ажиллаж буй процессуудыг харах' },
      { type: 'cmd', cmd: 'ps aux' },
      { type: 'h', text: 'Бодит цагийн хяналт — top' },
      { type: 'cmd', cmd: 'top' },
      { type: 'p', text: 'top дотор q дарж гарна. Илүү ойлгомжтой htop-ийг суулгаж болно: sudo apt install htop.' },
      { type: 'h', text: 'Процесс зогсоох — kill' },
      { type: 'cmd', cmd: 'kill 1234' },
      { type: 'p', text: 'Хатуу зогсоох (хариу өгөхгүй байвал):' },
      { type: 'cmd', cmd: 'kill -9 1234' },
      { type: 'note', text: '1234 нь процессын дугаар (PID). Үүнийг ps aux эсвэл top-оос харна.' },
    ],
  },

  {
    id: 'search',
    title: 'Хайлт хийх',
    level: 'Дунд',
    summary: 'find, grep, locate ашиглан файл, текст хайх.',
    blocks: [
      { type: 'h', text: 'Файл хайх — find' },
      { type: 'cmd', cmd: 'find /home -name "*.txt"' },
      { type: 'h', text: 'Текст доторх үг хайх — grep' },
      { type: 'cmd', cmd: 'grep "password" notes.txt' },
      { type: 'p', text: 'Хавтсаар бүхэлд нь (рекурсив) хайх:' },
      { type: 'cmd', cmd: 'grep -r "TODO" .' },
      { type: 'h', text: 'Хурдан хайлт — locate' },
      { type: 'cmd', cmd: 'locate bashrc' },
      { type: 'note', text: 'grep-ийг командын гаралттай хослуулж болно: ip a | grep inet — энэ нь зөвхөн inet мөрүүдийг харуулна. | тэмдгийг "pipe" гэдэг.' },
    ],
  },

  {
    id: 'kali-tools',
    title: 'Kali-ийн хэрэгслүүд (танилцуулга)',
    level: 'Дараагийн алхам',
    summary: 'Kali-д орсон үндсэн хэрэгслүүд ба ёс зүйн анхааруулга.',
    blocks: [
      { type: 'p', text: 'Үндсэн командуудаа эзэмшсэн бол Kali-ийн зорилго болох аюулгүй байдлын хэрэгслүүд рүү орж болно. Эдгээр нь жинхэнэ хүчирхэг тул зөвхөн зөвшөөрөлтэй орчинд хэрэглэнэ.' },
      { type: 'list', items: [
        'nmap — сүлжээ, нээлттэй портуудыг сканнердах',
        'wireshark — сүлжээний трафик харах, шинжлэх',
        'metasploit — нэвтрэлтийн тестийн фреймворк',
        'john / hashcat — нууц үгийн бат бөхийг шалгах',
        'burpsuite — веб аппликэшний аюулгүй байдлын тест',
      ] },
      { type: 'p', text: 'Жишээ — өөрийн дотоод сүлжээгээ сканнердах:' },
      { type: 'cmd', cmd: 'nmap -sn 192.168.1.0/24' },
      { type: 'warn', text: 'Ёс зүй ба хууль: Зөвхөн ӨӨРИЙН эсвэл бичгээр зөвшөөрөл авсан систем дээр л эдгээр хэрэгслийг хэрэглэ. Бусдын систем рүү зөвшөөрөлгүй халдах нь хууль зөрчсөн гэмт хэрэг бөгөөд хүнд хариуцлага хүлээлгэдэг.' },
      { type: 'note', text: 'Дараагийн алхам: Linux-ийн bash скрипт бичих, сүлжээний онол (TCP/IP), мөн TryHackMe / HackTheBox зэрэг хууль ёсны дадлагын платформ дээр сурах.' },
    ],
  },
];

export default LESSONS;
